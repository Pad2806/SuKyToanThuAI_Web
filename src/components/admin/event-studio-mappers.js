import { adminEventApi } from '../../lib/admin-event-api.js';
import { DEFAULT_STORY_IMAGE, cleanImageUrl, isUsableImage } from '../../lib/image-utils.js';

const DEFAULT_IMAGE = DEFAULT_STORY_IMAGE;
const UNUSABLE_ASSET_STATUSES = new Set(['rejected', 'failed', 'archived']);
const UNUSED_ASSET_STATUSES = new Set(['approved', 'generated']);
const DESTINATION_LABELS = {
  hero: 'Ảnh bìa',
  context: 'Bối cảnh',
  climax: 'Cao trào',
  aftermath: 'Hệ quả',
  takeaway: 'Bài học',
  battleMap: 'Bản đồ chiến thuật',
  timeline: 'Mốc diễn biến',
  character: 'Nhân vật',
};

export async function saveManualAsset(eventId, slot, url) {
  const imageUrl = cleanImageUrl(url);
  if (!imageUrl) return;
  await adminEventApi.upsertAsset(eventId, {
    slotKey: slot.slotKey || slot.slot_key,
    slotLabel: slot.slotLabel || slot.slot_label,
    status: 'generated',
    prompt: slot.prompt,
    imageUrl,
    metadata: slot.metadata || {},
  });
}

export const normalizeDraftEventData = (data = {}) => {
  const next = clone(unwrapDraftEventData(data));
  normalizeStorySections(next);
  normalizeInteractions(next);
  return next;
};

export const factsFromDraft = (data) => {
  const normalized = normalizeDraftEventData(data);
  return {
    title: normalized.title, slug: normalized.slug, eraId: normalized.eraId, eraSlug: normalized.eraSlug,
    year: normalized.year, gradeTags: normalized.gradeTags, type: normalized.type,
    templateType: normalized.story?.templateType || normalized.type,
    summary: normalized.summary, excerpt: normalized.excerpt, image: normalized.image,
    fallbackImage: normalized.fallbackImage, location: normalized.location, actors: normalized.actors,
    opponent: normalized.opponent, result: normalized.result,
    relatedEventSlugs: normalized.relatedEventSlugs,
  };
};

export const interactionsFromDraft = (data) => {
  const normalized = normalizeDraftEventData(data);
  return {
    characters: normalized.characters,
    timeline: normalized.timeline,
    climaxScene: normalized.climaxScene,
    aftermath: normalized.aftermath,
    takeaway: normalized.takeaway,
    quiz: normalized.quiz,
  };
};

export function toPreviewEvent(detail, draftData = null) {
  const normalizedDraft = draftData ? normalizeDraftEventData(draftData) : null;
  const event = mergeDraftEvent(detail.event, normalizedDraft);
  const allocator = createAssetAllocator(detail.assets || []);
  const interactive = event.interactive_data || {};
  const fallbackImage = cleanImageUrl(event.fallback_image) || DEFAULT_IMAGE;
  const heroImage = allocator.takeAsset('hero', DESTINATION_LABELS.hero) || allocator.takeUrl(event.image, DESTINATION_LABELS.hero);
  const characters = (interactive.characters || []).map((character, index) => ({
    ...character,
    portrait: allocator.takeUrl(character.portrait, `${DESTINATION_LABELS.character} ${index + 1}`),
  }));
  const timeline = (interactive.timeline || []).map((item, index) => ({
    ...item,
    image: allocator.takeAsset(`timeline-scene-${index + 1}`, `${DESTINATION_LABELS.timeline} ${index + 1}`)
      || allocator.takeUrl(item.image, `${DESTINATION_LABELS.timeline} ${index + 1}`),
  }));
  const mappedCharacters = characters.map((character, index) => ({
    ...character,
    portrait: character.portrait
      || allocator.takeAsset(`character-${index + 1}`, `${DESTINATION_LABELS.character} ${index + 1}`),
  }));
  const climaxScene = hydrateClimaxScene(interactive.climaxScene, allocator, heroImage);
  const timelineVisual = null;
  const aftermath = hydrateAftermath(interactive.aftermath, allocator);
  const story = hydrateStoryImages(
    clone(storyForPreview(normalizedDraft, detail, event)),
    allocator,
    { hasTimeline: false, hasClimax: Boolean(climaxScene), hasAftermath: Boolean(aftermath?.image) },
  );

  return {
    id: event.id, slug: event.slug, title: event.title, eraId: event.era_id,
    eraSlug: event.era_slug, year: event.year, gradeTags: event.grade_tags || [],
    topics: [event.type], type: event.type, featured: event.featured,
    summary: event.summary, excerpt: event.excerpt, image: heroImage, fallbackImage,
    location: event.location, actors: event.actors || [], opponent: event.opponent,
    result: event.result, characters: mappedCharacters, timeline, timelineVisual, climaxScene, aftermath,
    takeaway: interactive.takeaway, quiz: interactive.quiz || [], story, theme: event.theme,
    relatedEventSlugs: event.related_event_slugs || [], assetUsage: allocator.getUsage(),
  };
}

function mergeDraftEvent(event, draftData) {
  if (!draftData) return event;
  const normalizedDraft = normalizeDraftEventData(draftData);
  return {
    ...event,
    title: normalizedDraft.title ?? event.title, slug: normalizedDraft.slug ?? event.slug,
    era_id: normalizedDraft.eraId ?? event.era_id, era_slug: normalizedDraft.eraSlug ?? event.era_slug,
    year: normalizedDraft.year ?? event.year, grade_tags: normalizedDraft.gradeTags ?? event.grade_tags,
    type: normalizedDraft.type ?? event.type,
    template_type: normalizedDraft.story?.templateType ?? normalizedDraft.templateType ?? event.template_type,
    summary: normalizedDraft.summary ?? event.summary, excerpt: normalizedDraft.excerpt ?? event.excerpt,
    image: normalizedDraft.image ?? event.image, fallback_image: normalizedDraft.fallbackImage ?? event.fallback_image,
    location: normalizedDraft.location ?? event.location, actors: normalizedDraft.actors ?? event.actors,
    opponent: normalizedDraft.opponent ?? event.opponent, result: normalizedDraft.result ?? event.result,
    related_event_slugs: normalizedDraft.relatedEventSlugs ?? event.related_event_slugs,
    interactive_data: {
      ...(event.interactive_data || {}),
      characters: normalizedDraft.characters ?? event.interactive_data?.characters ?? [],
      timeline: normalizedDraft.timeline ?? event.interactive_data?.timeline ?? [],
      climaxScene: normalizedDraft.climaxScene ?? event.interactive_data?.climaxScene ?? null,
      aftermath: normalizedDraft.aftermath ?? event.interactive_data?.aftermath ?? null,
      takeaway: normalizedDraft.takeaway ?? event.interactive_data?.takeaway ?? null,
      quiz: normalizedDraft.quiz ?? event.interactive_data?.quiz ?? [],
    },
  };
}

function normalizeStorySections(data) {
  const story = data.story || { templateType: data.templateType || data.type || 'universal', beats: [] };
  story.beats = Array.isArray(story.beats) ? story.beats.map(normalizeBeat) : [];
  data.story = story;

  if (data.hero) {
    data.summary ||= data.hero.summary || data.hero.subtitle || '';
    data.excerpt ||= data.hero.subtitle || data.hero.summary || '';
  }

  if (data.context) {
    const setup = ensureBeat(story, 'setup', data.context.title || 'Bối cảnh');
    appendTextBlock(setup, joinText(data.context.description, data.context.paragraphs));
    const facts = data.context.quickFacts || data.context.facts;
    if (Array.isArray(facts) && !setup.blocks.some((block) => block.type === 'quick-facts')) {
      setup.blocks.push({ type: 'quick-facts', title: 'Dữ kiện nhanh', items: facts });
    }
  }
}

function unwrapDraftEventData(data) {
  if (!data || typeof data !== 'object') return {};
  if (data.eventData && typeof data.eventData === 'object') return data.eventData;
  if (data.aiDraft?.eventData && typeof data.aiDraft.eventData === 'object') return data.aiDraft.eventData;
  if (data.generatedContent?.eventData && typeof data.generatedContent.eventData === 'object') return data.generatedContent.eventData;
  if (data.draftContent?.eventData && typeof data.draftContent.eventData === 'object') return data.draftContent.eventData;
  if (data.generatedContent && typeof data.generatedContent === 'object') return data.generatedContent;
  if (data.draftContent && typeof data.draftContent === 'object') return data.draftContent;
  if (data.story?.eventData && typeof data.story.eventData === 'object') return data.story.eventData;
  return data;
}

function storyForPreview(normalizedDraft, detail, event) {
  if (normalizedDraft?.story?.beats?.length) return normalizedDraft.story;
  if (detail.story?.story_json?.beats?.length) return detail.story.story_json;
  return { templateType: event.template_type, beats: [] };
}

function normalizeInteractions(data) {
  data.characters = (data.characters || []).map((character, index) => ({
    id: character.id || `character-${index + 1}`,
    ...character,
    side: character.side || character.faction || 'other',
    traits: Array.isArray(character.traits) ? character.traits : [character.traits].filter(Boolean),
    contribution: character.contribution || character.description || character.bio || '',
    description: character.description || character.bio || character.contribution || '',
  }));

  data.timeline = (data.timeline || []).map((item, index) => ({
    id: item.id || `milestone-${index + 1}`,
    order: item.order || index + 1,
    ...item,
    summary: item.summary || item.description || '',
    description: item.description || item.longDescription || item.detail || item.summary || '',
    keyPoints: normalizeList(item.keyPoints || item.points || item.facts || item.bullets),
    date: item.date || timelineDate(item),
  }));

  const keyPhases = data.keyPhases || data.key_phases || [];
  const tacticalMap = data.tacticalMap || data.tactical_map || null;
  if ((keyPhases.length || tacticalMap) && !data.climaxScene) data.climaxScene = { title: 'Cao trào', phases: [] };
  if (data.climaxScene) {
    if (!data.climaxScene.phases?.length && keyPhases.length) {
      data.climaxScene.phases = keyPhases.map((phase, index) => ({
        id: phase.id || `phase-${index + 1}`,
        label: phase.label || phase.title || `Giai đoạn ${index + 1}`,
        summary: phase.summary || phase.description || '',
        description: phase.description || phase.summary || '',
        keyDetail: phase.keyDetail || phase.importantDetail || '',
      }));
    }
    if (tacticalMap && !data.climaxScene.hotspots?.length) {
      const points = tacticalMap.points || tacticalMap.hotspots || [];
      data.climaxScene.hotspots = points.map((point, index) => ({
        id: point.id || `hotspot-${index + 1}`,
        x: point.position?.x || point.x || Math.min(18 + (index % 4) * 20, 82),
        y: point.position?.y || point.y || Math.min(28 + Math.floor(index / 4) * 22, 78),
        label: point.label || point.name || `Điểm ${index + 1}`,
        description: point.description || '',
        tacticalRole: point.tacticalRole || point.role || '',
      }));
    }
    data.climaxScene.mapDescription ||= tacticalMap?.description || '';
  }

  if (data.quiz && !Array.isArray(data.quiz)) data.quiz = data.quiz.questions || [];
}

function normalizeBeat(beat) {
  return {
    ...beat,
    blocks: (beat.blocks || []).map((block) => ({
      ...block,
      body: block.body || block.text || block.description,
    })),
  };
}

function ensureBeat(story, type, title) {
  let beat = story.beats.find((item) => item.type === type);
  if (!beat) {
    beat = { type, title, blocks: [] };
    story.beats.push(beat);
  }
  beat.blocks ||= [];
  return beat;
}

function appendTextBlock(beat, body) {
  const text = String(body || '').trim();
  if (!text) return;
  const existing = beat.blocks.map((block) => block.body || block.text || '').join(' ');
  if (!existing.includes(text)) beat.blocks.push({ type: 'text', body: text });
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item : item.value || item.label)).filter(Boolean);
}

function joinText(...values) {
  return values.flatMap((value) => (Array.isArray(value) ? value : [value])).filter(Boolean).join('\n\n');
}

function createAssetAllocator(assets) {
  const allRows = assets.map(normalizeAssetRow).filter(Boolean);
  const rows = allRows.filter((asset) => !UNUSABLE_ASSET_STATUSES.has(asset.status) && hasUsableImage(asset.image));
  const used = new Set();
  const usage = new Map();
  const takeUrl = (...args) => {
    const { urls, usedIn } = splitUrlArgs(args);
    for (const url of urls) {
      const image = cleanImageUrl(url);
      if (hasUsableImage(image) && !used.has(image)) {
        used.add(image);
        recordUsage(usage, { key: null, label: 'Direct image', image }, usedIn, 'direct');
        return image;
      }
    }
    return null;
  };
  const takeAsset = (...args) => {
    const { keys, usedIn } = splitAssetArgs(args);
    for (const key of keys.flat().filter(Boolean)) {
      const match = rows.find((asset) => asset.key === key && !used.has(asset.image));
      if (match) {
        used.add(match.image);
        recordUsage(usage, match, usedIn || destinationForSlot(match.key), 'slot');
        return match.image;
      }
    }
    return null;
  };
  const useAsset = (...args) => {
    const { keys, usedIn } = splitAssetArgs(args);
    for (const key of keys.flat().filter(Boolean)) {
      const match = rows.find((asset) => asset.key === key);
      if (match) {
        recordUsage(usage, match, usedIn || destinationForSlot(match.key), 'slot');
        return match.image;
      }
    }
    return null;
  };
  const peekAsset = (...keys) => {
    for (const key of keys.flat().filter(Boolean)) {
      const match = rows.find((asset) => asset.key === key);
      if (match) return match.image;
    }
    return null;
  };
  const getUsage = () => buildAssetUsage(allRows, usage);
  return { takeAsset, takeUrl, useAsset, peekAsset, getUsage };
}

function normalizeAssetRow(asset) {
  const status = asset.status || 'generated';
  const image = cleanImageUrl(asset.imageUrl || asset.image_url);
  const metadata = asset.metadata || {};
  return {
    id: asset.id,
    key: asset.slotKey || asset.slot_key,
    label: asset.slotLabel || asset.slot_label || asset.slotKey || asset.slot_key,
    status,
    image,
    requirement: asset.requirement || metadata.requirement || 'optional',
    group: asset.group || metadata.group,
  };
}

function splitUrlArgs(args) {
  if (args.length > 1 && typeof args.at(-1) === 'string' && !looksLikeUrl(args.at(-1))) {
    return { urls: args.slice(0, -1), usedIn: args.at(-1) };
  }
  return { urls: args, usedIn: 'Direct image' };
}

function splitAssetArgs(args) {
  if (args.length > 1 && typeof args.at(-1) === 'string') {
    return { keys: args.slice(0, -1), usedIn: args.at(-1) };
  }
  return { keys: args, usedIn: '' };
}

function looksLikeUrl(value) {
  return /^(https?:|\/|data:|blob:)/.test(String(value || '').trim());
}

function recordUsage(usage, asset, usedIn, source) {
  const key = `${asset.key || 'direct'}:${asset.image}`;
  const current = usage.get(key) || {
    slotKey: asset.key,
    slotLabel: asset.label,
    imageUrl: asset.image,
    usedIn: [],
    source,
  };
  if (usedIn && !current.usedIn.includes(usedIn)) current.usedIn.push(usedIn);
  usage.set(key, current);
}

function buildAssetUsage(rows, usage) {
  const usedRows = Array.from(usage.values());
  const usedKeys = new Set(usedRows.filter((row) => row.slotKey).map((row) => `${row.slotKey}:${row.imageUrl}`));
  return {
    used: usedRows,
    unused: rows
      .filter((row) => row.key && UNUSED_ASSET_STATUSES.has(row.status) && hasUsableImage(row.image))
      .filter((row) => !usedKeys.has(`${row.key}:${row.image}`))
      .map(assetUsageRow),
    missingRequired: missingRequiredRows(rows),
  };
}

function assetUsageRow(row) {
  return {
    slotKey: row.key,
    slotLabel: row.label,
    imageUrl: row.image,
    status: row.status,
    requirement: row.requirement,
    group: row.group,
  };
}

function missingRequiredRows(rows) {
  const required = rows.filter((row) => row.requirement === 'required' && !hasUsableImage(row.image));
  const oneOfGroups = new Map();
  rows.filter((row) => row.requirement === 'one-of' && row.group).forEach((row) => {
    const group = oneOfGroups.get(row.group) || [];
    group.push(row);
    oneOfGroups.set(row.group, group);
  });
  const missingOneOf = Array.from(oneOfGroups.values()).flatMap((group) => (
    group.some((row) => hasUsableImage(row.image)) ? [] : group
  ));
  return [...required, ...missingOneOf].map(assetUsageRow);
}

function destinationForSlot(slotKey) {
  if (slotKey === 'hero') return DESTINATION_LABELS.hero;
  if (slotKey === 'context') return DESTINATION_LABELS.context;
  if (slotKey === 'climax') return DESTINATION_LABELS.climax;
  if (slotKey === 'aftermath') return DESTINATION_LABELS.aftermath;
  if (slotKey === 'takeaway') return DESTINATION_LABELS.takeaway;
  if (slotKey === 'battle-map' || slotKey === 'air-raid-map') return DESTINATION_LABELS.battleMap;
  if (slotKey?.startsWith('timeline-scene-')) return DESTINATION_LABELS.timeline;
  if (slotKey?.startsWith('character-')) return DESTINATION_LABELS.character;
  if (slotKey?.startsWith('climax-phase-')) return DESTINATION_LABELS.climax;
  return DESTINATION_LABELS.hero;
}

function hydrateStoryImages(story, allocator, rendered) {
  const beats = Array.isArray(story.beats) ? story.beats : [];
  story.beats = beats.map((beat) => {
    const nextBeat = { ...beat, blocks: reserveExistingImages(beat.blocks, allocator) };
    injectBeatImage(nextBeat, imageForBeat(nextBeat.type, allocator, rendered), captionForBeat(nextBeat.type));
    return nextBeat;
  });
  return story;
}

function reserveExistingImages(blocks = [], allocator) {
  return (Array.isArray(blocks) ? blocks : []).map((block) => {
    if (block.type !== 'image') return block;
    const image = allocator.takeUrl(block.image, DESTINATION_LABELS.storyBeat);
    return image ? { ...block, image } : null;
  }).filter(Boolean);
}

function imageForBeat(type, allocator, rendered) {
  if (type === 'setup') return allocator.takeAsset('context', DESTINATION_LABELS.context);
  if (type === 'climax') return allocator.takeAsset('climax', DESTINATION_LABELS.climax);
  if (type === 'falling') return allocator.takeAsset('aftermath', DESTINATION_LABELS.aftermath);
  if (type === 'takeaway') return allocator.takeAsset('takeaway', DESTINATION_LABELS.takeaway);
  return null;
}

function injectBeatImage(beat, image, caption) {
  if (!hasUsableImage(image) || beat.blocks.some((block) => block.type === 'image')) return;
  const afterTextIndex = beat.blocks.findIndex((block) => block.type === 'text' || block.type === 'quote');
  beat.blocks.splice(afterTextIndex >= 0 ? afterTextIndex + 1 : 0, 0, { type: 'image', image, caption });
}

function hydrateClimaxScene(scene, allocator, heroImage) {
  if (!scene) return null;
  const climaxImage = allocator.takeAsset('climax', DESTINATION_LABELS.climax) || heroImage;
  const mapImage = allocator.useAsset('battle-map', 'Bản đồ cao trào')
    || allocator.useAsset('air-raid-map', 'Bản đồ cao trào');
  const phases = Array.isArray(scene.phases) ? scene.phases : [];
  const existing = Array.isArray(scene.phaseImages) ? scene.phaseImages : [];
  const phaseCount = Math.max(phases.length, existing.length);
  const phaseImages = Array.from({ length: phaseCount }, (_, index) => (
    allocator.takeAsset(`climax-phase-${index + 1}`, `Cao trào giai đoạn ${index + 1}`)
      || allocator.takeUrl(existing[index], `Cao trào giai đoạn ${index + 1}`)
      || climaxImage
  ));
  const backgroundImage = climaxImage;
  return { ...scene, backgroundImage, mapImage, phaseImages };
}

function hydrateAftermath(aftermath, allocator) {
  if (!aftermath) return null;
  return { ...aftermath, image: allocator.takeAsset('aftermath', DESTINATION_LABELS.aftermath) || allocator.takeUrl(aftermath.image, DESTINATION_LABELS.aftermath) };
}

function captionForBeat(type) {
  return {
    setup: 'Bối cảnh lịch sử và không gian chính',
    rising: 'Một mốc diễn biến quan trọng',
    climax: 'Khoảnh khắc cao trào của sự kiện',
    falling: 'Hệ quả sau sự kiện',
    takeaway: 'Dấu ấn còn lại trong lịch sử',
  }[type] || '';
}

function timelineDate(item) {
  const direct = stringValue(item?.date);
  if (direct) return direct;
  const parts = [item?.day, item?.month, item?.year].map((value) => stringValue(value)).filter(Boolean);
  return parts.join('/') || stringValue(item?.year);
}

function stringValue(value) {
  return String(value || '').trim();
}

function hasUsableImage(value) {
  return isUsableImage(value, { allowDefault: false });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}
