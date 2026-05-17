import { adminEventApi } from '../../lib/admin-event-api.js';

export async function saveManualAsset(eventId, slot, url) {
  if (!url) return;
  await adminEventApi.upsertAsset(eventId, {
    slotKey: slot.slotKey || slot.slot_key,
    slotLabel: slot.slotLabel || slot.slot_label,
    status: 'generated',
    prompt: slot.prompt,
    imageUrl: url,
    metadata: slot.metadata || {},
  });
}

export function factsFromDraft(data) {
  return {
    title: data.title,
    slug: data.slug,
    eraId: data.eraId,
    eraSlug: data.eraSlug,
    year: data.year,
    gradeTags: data.gradeTags,
    type: data.type,
    templateType: data.story?.templateType || data.type,
    summary: data.summary,
    excerpt: data.excerpt,
    image: data.image,
    fallbackImage: data.fallbackImage,
    location: data.location,
    actors: data.actors,
    opponent: data.opponent,
    result: data.result,
    relatedEventSlugs: data.relatedEventSlugs,
  };
}

export function interactionsFromDraft(data) {
  return {
    characters: data.characters,
    timeline: data.timeline,
    climaxScene: data.climaxScene,
    aftermath: data.aftermath,
    takeaway: data.takeaway,
    quiz: data.quiz,
  };
}

export function toPreviewEvent(detail) {
  const event = detail.event;
  const interactive = event.interactive_data || {};
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    eraId: event.era_id,
    eraSlug: event.era_slug,
    year: event.year,
    gradeTags: event.grade_tags || [],
    topics: [event.type],
    type: event.type,
    featured: event.featured,
    summary: event.summary,
    excerpt: event.excerpt,
    image: event.image,
    fallbackImage: event.fallback_image,
    location: event.location,
    actors: event.actors || [],
    opponent: event.opponent,
    result: event.result,
    characters: interactive.characters || [],
    timeline: interactive.timeline || [],
    climaxScene: interactive.climaxScene,
    aftermath: interactive.aftermath,
    takeaway: interactive.takeaway,
    quiz: interactive.quiz || [],
    story: detail.story?.story_json || { templateType: event.template_type, beats: [] },
    theme: event.theme,
    relatedEventSlugs: event.related_event_slugs || [],
  };
}
