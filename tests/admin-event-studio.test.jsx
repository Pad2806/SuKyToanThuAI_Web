import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AdminWorkQueue } from '../src/components/admin/admin-work-queue.jsx';
import { AssetSlotBoard } from '../src/components/admin/asset-slot-board.jsx';
import { EventMetaForm } from '../src/components/admin/event-meta-form.jsx';
import { buildAdminFlowSteps } from '../src/components/admin/admin-flow-checklist.jsx';
import { QualityGatePanel } from '../src/components/admin/quality-gate-panel.jsx';
import { AiDraftPanel } from '../src/components/admin/ai-draft-panel.jsx';
import { SourceImportPanel } from '../src/components/admin/source-import-panel.jsx';
import { StoryPreview } from '../src/components/admin/story-preview.jsx';
import { StoryInteractionsEditor } from '../src/components/admin/story-interactions-editor.jsx';
import { normalizeDraftEventData, saveManualAsset, toPreviewEvent } from '../src/components/admin/event-studio-mappers.js';
import { BeatBlocks } from '../src/components/story-system/blocks/story-blocks.jsx';
import { EventHero } from '../src/components/story-system/sections/event-hero.jsx';
import { AftermathSummary } from '../src/components/story-interactive/aftermath-summary.jsx';
import { CharacterGrid } from '../src/components/story-interactive/character-card.jsx';
import { ClimaxScene } from '../src/components/story-interactive/climax-scene.jsx';
import { InteractiveTimeline } from '../src/components/story-interactive/interactive-timeline.jsx';
import { adminEventApi } from '../src/lib/admin-event-api.js';
import { slugify } from '../src/lib/slugify.js';

const richDraftEventData = () => ({
  title: 'Bach Dang 1288',
  summary: 'Dai Viet defeats the Yuan fleet on the river.',
  excerpt: 'A tidal ambush changed the campaign.',
  imagePrompt: 'wide river battle cover',
  context: {
    title: 'Boi canh',
    description: 'The Yuan fleet entered Dai Viet while defenders prepared a river ambush with stakes and local terrain.',
    quickFacts: ['1288', 'Song Bach Dang'],
    imagePrompt: 'tense river preparations',
  },
  characters: [
    {
      name: 'Tran Hung Dao',
      faction: 'Dai Viet',
      role: 'Commander strategist',
      traits: ['calm', 'strategic'],
      contribution: 'Organized the stake field and coordinated the counterattack.',
      description: 'A military leader shown through command symbols, not a portrait.',
      imagePrompt: 'stylized commander beside a river map',
    },
  ],
  timeline: [
    {
      order: 1,
      time: 'High tide',
      title: 'The fleet advances',
      summary: 'The stake field is hidden under the rising tide.',
      description: 'Yuan ships move deeper into the river channel while Dai Viet boats wait for the tide to reveal the trap.',
      keyPoints: ['Hidden stakes', 'River current', 'Waiting ambush'],
      imagePrompt: 'high tide with hidden wooden stakes',
    },
    {
      order: 2,
      time: 'Low tide',
      title: 'Counterattack after the tide turns',
      summary: 'The trap closes.',
      description: 'As the water falls, ships become trapped among stakes and Dai Viet forces attack from both banks.',
      keyPoints: ['Stakes exposed', 'Enemy ships trapped'],
      imagePrompt: 'low tide counterattack',
    },
  ],
  climaxScene: {
    title: 'The trap closes',
    summary: 'The river becomes the decisive battlefield.',
    description: 'The falling tide exposes the prepared stake field and changes the balance of the battle.',
    quote: 'The decisive moment came with the tide.',
  },
  keyPhases: [
    {
      title: 'Lure the fleet',
      summary: 'Draw ships into the channel.',
      description: 'Dai Viet forces keep distance until the fleet is committed to the river path.',
      importantDetail: 'The timing depends on the tide.',
    },
  ],
  tacticalMap: {
    description: 'A map of ambush zones, river channels, and withdrawal routes.',
    imagePrompt: 'ancient tactical river map',
    points: [
      {
        name: 'Stake field',
        position: { x: 48, y: 58 },
        description: 'Main trap zone in the river.',
        tacticalRole: 'Locks the enemy fleet in place.',
      },
    ],
  },
  aftermath: {
    title: 'Legacy',
    description: 'The victory preserved independence and ended the invasion.',
    consequences: ['The Yuan naval route collapsed.'],
    lessons: ['Tan dung dia hinh', 'Control timing'],
    historicalMeaning: 'A lasting example of strategic patience and local knowledge.',
  },
  quiz: {
    questions: [
      { question: 'What hid the stakes?', options: ['High tide', 'Snow'], correct: 0, explanation: 'High tide covered the stake field.' },
      { question: 'What trapped the ships?', options: ['Wooden stakes', 'Walls'], correct: 0, explanation: 'The stakes pinned ships at low tide.' },
      { question: 'What lesson stands out?', options: ['Terrain', 'Luck'], correct: 0, explanation: 'The plan relied on terrain and timing.' },
    ],
  },
  story: {
    templateType: 'battle',
    beats: [
      { type: 'hook', title: 'River trap', blocks: [{ type: 'text', body: 'The river became a weapon.' }] },
      { type: 'rising', title: 'Dien bien', blocks: [{ type: 'text', body: 'The fleet moved into the channel.' }] },
      { type: 'climax', title: 'Cao trao', blocks: [{ type: 'text', body: 'The tide revealed the stakes.' }] },
      { type: 'falling', title: 'He qua', blocks: [{ type: 'text', body: 'The invasion was broken.' }] },
      { type: 'takeaway', title: 'Bai hoc', blocks: [{ type: 'text', body: 'Terrain and timing shaped the result.' }] },
    ],
  },
});

describe('admin event studio components', () => {
  it('renders event list with status chips and collapsible create form', () => {
    const html = renderToStaticMarkup(
      <AdminWorkQueue
        events={[{ id: 'event-1', title: 'Bach Dang', slug: 'bach-dang', status: 'draft' }]}
        options={{
          eras: [{ id: 'era-tran', slug: 'thoi-tran', name: 'Thoi Tran' }],
          eventTypes: ['battle', 'other'],
          templateTypes: ['battle', 'universal'],
        }}
        selectedId="event-1"
        onCreate={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(html).toContain('admin-status--draft');
    expect(html).toContain('Bach Dang');
    expect(html).toContain('Tạo sự kiện mới');
    expect(html).toContain('Hàng đợi sự kiện');
  });


  it('falls back to slug when an admin event row has no title', () => {
    const html = renderToStaticMarkup(
      <AdminWorkQueue
        events={[{ id: 'event-1', slug: 'fallback-slug', status: 'draft' }]}
        options={{ eras: [{ id: 'era-tran', slug: 'thoi-tran', name: 'Thoi Tran' }] }}
        selectedId="event-1"
        onCreate={vi.fn()}
        onSelect={vi.fn()}
      />,
    );

    expect(html).toContain('fallback-slug');
    expect(html).toContain('admin-status--draft');
  });

  it('keeps Vietnamese d-stroke characters when building slugs', () => {
    expect(slugify('Đỗ')).toBe('do');
    expect(slugify('Đinh Bộ Lĩnh')).toBe('dinh-bo-linh');
  });

  it('keeps publish disabled until the backend quality gate passes', () => {
    const html = renderToStaticMarkup(
      <QualityGatePanel
        eventStatus="review"
        onCheck={vi.fn()}
        onPublish={vi.fn()}
        onSubmitReview={vi.fn()}
        report={{
          passed: false,
          score: 55,
          blockingIssues: [{ key: 'assets', label: 'Anh', reason: 'Can du anh duoc duyet' }],
        }}
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('Can du anh duoc duyet');
  });

  it('requires submit review before publish for draft events', () => {
    const html = renderToStaticMarkup(
      <QualityGatePanel
        eventStatus="draft"
        onCheck={vi.fn()}
        onPublish={vi.fn()}
        onSubmitReview={vi.fn()}
        report={{ passed: true, score: 100, blockingIssues: [] }}
      />,
    );

    expect(html).toContain('Gửi duyệt');
    expect(html).toContain('Công bố sự kiện');
    expect(html).toContain('disabled=""');
  });

  it('tracks admin flow readiness from event data', () => {
    const steps = buildAdminFlowSteps({
      event: {
        title: 'Bach Dang',
        era_id: 'era-tran',
        status: 'draft',
        template_type: 'battle',
        interactive_data: {
          characters: [{ name: 'Tran Hung Dao' }],
          timeline: [{}, {}, {}, {}],
          quiz: [{}, {}, {}],
          climaxScene: { title: 'Tran chien' },
          aftermath: { title: 'Ket qua' },
          takeaway: { lesson: 'Bai hoc' },
        },
      },
      sources: [{ id: 'source-1' }],
      story: { story_json: { beats: [{}, {}, {}, {}, {}, {}] } },
      assets: [
        { slot_key: 'hero', status: 'approved', image_url: '/hero.png' },
        { slot_key: 'context', status: 'approved', image_url: '/context.png' },
        { slot_key: 'character-1', status: 'approved', image_url: '/character-1.png' },
        { slot_key: 'timeline-scene-1', status: 'approved', image_url: '/timeline-1.png' },
        { slot_key: 'timeline-scene-2', status: 'approved', image_url: '/timeline-2.png' },
        { slot_key: 'timeline-scene-3', status: 'approved', image_url: '/timeline-3.png' },
        { slot_key: 'timeline-scene-4', status: 'approved', image_url: '/timeline-4.png' },
        { slot_key: 'climax', status: 'approved', image_url: '/climax.png' },
        { slot_key: 'climax-phase-1', status: 'approved', image_url: '/phase-1.png' },
        { slot_key: 'climax-phase-2', status: 'approved', image_url: '/phase-2.png' },
        { slot_key: 'climax-phase-3', status: 'approved', image_url: '/phase-3.png' },
        { slot_key: 'aftermath', status: 'approved', image_url: '/aftermath.png' },
        { slot_key: 'takeaway', status: 'approved', image_url: '/takeaway.png' },
        { slot_key: 'battle-map', status: 'approved', image_url: '/map.png' },
      ],
    }, { passed: true });

    expect(steps.map((step) => step.done)).toEqual([true, true, true, true, true, true, false]);
    expect(steps.at(-1).active).toBe(true);
  });

  it('renders six story beats and interaction editors', () => {
    const html = renderToStaticMarkup(
      <StoryInteractionsEditor
        event={{ id: 'event-1', template_type: 'battle', interactive_data: {} }}
        story={{ story_json: { templateType: 'battle', beats: [] } }}
        onSaveStory={vi.fn()}
        onSaveInteractions={vi.fn()}
      />,
    );

    expect(html).toContain('Kịch bản &amp; tương tác');
    expect(html.match(/Nội dung cảnh/g)).toHaveLength(6);
    expect(html).toContain('Nhân vật');
    expect(html).toContain('Quân ta');
    expect(html).toContain('Đối phương');
    expect(html).toContain('Dòng thời gian');
    expect(html).toContain('Ngày');
    expect(html).toContain('Tháng');
    expect(html).toContain('Các giai đoạn cao trào');
    expect(html).toContain('Câu hỏi trắc nghiệm');
  });

  it('renders editable AI draft fields before accepting the draft', () => {
    const html = renderToStaticMarkup(
      <AiDraftPanel
        sourceCount={1}
        draft={{
          payload: {
            title: 'Draft title',
            eventData: {
              title: 'Draft title',
              summary: 'Summary',
              excerpt: 'Excerpt',
              story: { beats: [{ type: 'hook', title: 'Hook', blocks: [{ type: 'text', body: 'Body' }] }] },
            },
            citations: [{ chunkId: 'chunk-1', title: 'SGK' }],
            coverageReport: { missing: [] },
          },
        }}
        onDraft={vi.fn()}
        onAccept={vi.fn()}
        onDraftChange={vi.fn()}
      />,
    );

    expect(html).toContain('Chỉnh draft trước khi nhận');
    expect(html).not.toContain('Các cảnh cần kiểm duyệt');
    expect(html).toContain('Tiêu đề cảnh');
    expect(html).toContain('Nội dung cảnh');
    expect(html).toContain('chunk-1');
  });

  it('shows rich AI draft content grouped by storytelling section', () => {
    const html = renderToStaticMarkup(
      <AiDraftPanel
        sourceCount={1}
        draft={{
          payload: {
            title: 'Bach Dang 1288',
            eventData: richDraftEventData(),
            assets: [{ slot: 'timeline-scene-1', prompt: 'river high tide illustration', status: 'queued' }],
            citations: [{ chunkId: 'chunk-1', title: 'SGK' }],
            coverageReport: { missing: [] },
          },
        }}
        onDraft={vi.fn()}
        onAccept={vi.fn()}
        onDraftChange={vi.fn()}
      />,
    );

    expect(html).toContain('Nội dung AI theo từng section');
    expect(html).toContain('Hero / Ảnh bìa');
    expect(html).toContain('Bối cảnh');
    expect(html).toContain('Nhân vật chính');
    expect(html).toContain('Diễn biến');
    expect(html).toContain('4 giai đoạn then chốt');
    expect(html).toContain('Bản đồ chiến thuật');
    expect(html).toContain('Hệ quả và bài học');
    expect(html).toContain('Quiz / Kiểm tra hiểu bài');
    expect(html).toContain('Summary');
    expect(html).toContain('Description');
    expect(html).toContain('Key points');
    expect(html).toContain('Image prompt');
    expect(html).toContain('Counterattack after the tide turns');
    expect(html).toContain('Tan dung dia hinh');
    expect(html).toContain('3 câu hỏi');
  });

  it('normalizes rich draft sections into the admin preview story shape', () => {
    const normalized = normalizeDraftEventData(richDraftEventData());
    const wrapped = normalizeDraftEventData({ aiDraft: { eventData: richDraftEventData() } });
    const preview = toPreviewEvent({
      event: {
        id: 'event-1',
        slug: 'bach-dang-1288',
        title: 'Old title',
        era_id: 'tran',
        era_slug: 'tran',
        year: 1288,
        grade_tags: [],
        type: 'battle',
        featured: false,
        summary: '',
        excerpt: '',
        image: '',
        fallback_image: '/fallback.png',
        location: 'Bach Dang',
        actors: [],
        opponent: '',
        result: '',
        theme: 'vietnamese-history',
        template_type: 'battle',
        related_event_slugs: [],
        interactive_data: { characters: [], timeline: [], quiz: [] },
      },
      story: { story_json: { templateType: 'battle', beats: [] } },
      assets: [],
    }, richDraftEventData());

    expect(normalized.story.beats.some((beat) => beat.type === 'setup')).toBe(true);
    expect(wrapped.timeline).toHaveLength(2);
    expect(normalized.story.beats.find((beat) => beat.type === 'setup').blocks.map((block) => block.body || block.items?.join(' ')).join(' ')).toContain('Yuan fleet entered Dai Viet');
    expect(preview.title).toBe('Bach Dang 1288');
    expect(preview.timeline[0].summary).toContain('stake field is hidden');
    expect(preview.timeline[0].description).toContain('Dai Viet boats wait');
    expect(preview.timeline[0].keyPoints).toEqual(['Hidden stakes', 'River current', 'Waiting ambush']);
    expect(preview.characters[0].contribution).toContain('Organized the stake field');
    expect(preview.climaxScene.phases[0].label).toBe('Lure the fleet');
    expect(preview.climaxScene.hotspots[0].label).toBe('Stake field');
    expect(preview.aftermath.lessons).toEqual(['Tan dung dia hinh', 'Control timing']);
    expect(preview.quiz).toHaveLength(3);
  });

  it('uses the canonical event story renderer for admin story previews', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StoryPreview
          event={{
            id: 'event-1',
            slug: 'preview-event',
            title: 'Preview event',
            eraSlug: 'tran',
            year: 1288,
            excerpt: 'Hook',
            summary: 'Summary',
            image: '/hero.png',
            fallbackImage: '/fallback.png',
            location: 'Bach Dang',
            actors: ['Tran Hung Dao'],
            type: 'battle',
            timeline: [
              { id: 'm1', title: 'Mốc diễn biến', description: 'Một mốc có thể đọc được.', image: '/timeline-preview.png' },
            ],
            story: {
              beats: [
                { type: 'hook', title: 'Hook', blocks: [{ type: 'text', body: 'Hook body' }] },
                { type: 'setup', title: 'Setup', blocks: [{ type: 'text', body: 'Setup body' }] },
                { type: 'rising', title: 'Diễn biến', blocks: [{ type: 'text', body: 'Timeline intro' }] },
              ],
            },
          }}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('evt-story');
    expect(html).toContain('filmstrip--horizontal');
    expect(html).not.toContain('filmstrip--stacked');
    expect(html).toContain('src="/timeline-preview.png"');
    expect(html).not.toContain('story-renderer');
  });

  it('renders preview characters as normalized cinematic rows', () => {
    const html = renderToStaticMarkup(
      <CharacterGrid
        characters={[
          { id: 'ally-1', name: 'Kíp chiến đấu', role: 'Phòng không', side: 'Quân ta' },
          { id: 'enemy-1', name: 'Không quân Mỹ', role: 'Đối phương', side: 'NGUYÊN-MÔNG' },
        ]}
      />,
    );

    expect(html).toContain('Quân ta');
    expect(html).toContain('Đối phương');
    expect(html).not.toContain('NGUYÊN-MÔNG');
    expect(html).toContain('char-row');
    expect(html).toContain('char-profile--screen');
    expect(html).toContain('char-profile--ally');
    expect(html).toContain('char-profile--enemy');
  });

  it('hydrates admin preview with approved image slots across story sections', () => {
    const preview = toPreviewEvent({
      event: {
        id: 'event-1',
        slug: 'dien-bien-phu',
        title: 'Điện Biên Phủ',
        era_id: 'era-khang-chien-chong-phap',
        era_slug: 'khang-chien-chong-phap',
        year: 1954,
        grade_tags: [],
        type: 'battle',
        featured: false,
        summary: 'Tập đoàn cứ điểm bị bao vây.',
        excerpt: 'Chiến dịch quyết định năm 1954.',
        image: '',
        fallback_image: '/images/generated/parchment.png',
        location: 'Điện Biên Phủ',
        actors: ['Võ Nguyên Giáp'],
        opponent: 'Quân đội Pháp',
        result: 'Việt Minh chiến thắng',
        theme: 'vietnamese-history',
        template_type: 'battle',
        related_event_slugs: [],
        interactive_data: {
          characters: [{ id: 'vo-nguyen-giap', name: 'Võ Nguyên Giáp', role: 'Chỉ huy', side: 'dai-viet' }],
          timeline: [
            { id: 'm1', title: 'Kéo pháo vào trận địa', description: 'Chuẩn bị trận địa.' },
            { id: 'm2', title: 'Tấn công Him Lam', description: 'Mở màn chiến dịch.' },
          ],
          climaxScene: {
            title: 'Cao trào',
            phases: [
              { id: 'p1', label: 'Mở màn', summary: 'A', description: 'A' },
              { id: 'p2', label: 'Bước ngoặt', summary: 'B', description: 'B' },
              { id: 'p3', label: 'Kết thúc', summary: 'C', description: 'C' },
            ],
            hotspots: [],
          },
          aftermath: { title: 'Sau chiến dịch', before: { title: 'Trước', items: [] }, after: { title: 'Sau', items: [] }, stats: [] },
          takeaway: { happened: 'A', whyItMatters: 'B', lesson: 'C' },
          quiz: [],
        },
      },
      story: {
        story_json: {
          templateType: 'battle',
          beats: [
            { type: 'setup', title: 'Bối cảnh', blocks: [{ type: 'text', body: 'Bối cảnh chiến dịch.' }] },
            { type: 'rising', title: 'Diễn biến', blocks: [{ type: 'text', body: 'Diễn biến chính.' }] },
            { type: 'climax', title: 'Cao trào', blocks: [{ type: 'text', body: 'Cao trào.' }] },
            { type: 'falling', title: 'Hệ quả', blocks: [{ type: 'text', body: 'Hệ quả.' }] },
            { type: 'takeaway', title: 'Bài học', blocks: [{ type: 'text', body: 'Bài học.' }] },
          ],
        },
      },
      assets: [
        { slot_key: 'hero', status: 'approved', image_url: '/hero.png' },
        { slot_key: 'battlefield', status: 'approved', image_url: '/battlefield.png' },
        { slot_key: 'battle-map', status: 'approved', image_url: '/map.png' },
        { slot_key: 'timeline-scene-1', status: 'approved', image_url: '/timeline-1.png' },
        { slot_key: 'timeline-scene-2', status: 'approved', image_url: '/timeline-2.png' },
        { slot_key: 'timeline-scene-3', status: 'generated', image_url: '/timeline-3.png' },
        { slot_key: 'climax', status: 'approved', image_url: '/climax.png' },
        { slot_key: 'climax-phase-1', status: 'approved', image_url: '/phase-1.png' },
        { slot_key: 'climax-phase-2', status: 'approved', image_url: '/phase-2.png' },
        { slot_key: 'climax-phase-3', status: 'approved', image_url: '/phase-3.png' },
        { slot_key: 'aftermath', status: 'approved', image_url: '/aftermath.png' },
        { slot_key: 'character-1', status: 'approved', image_url: '/character.png' },
        { slot_key: 'takeaway', status: 'approved', image_url: '/takeaway.png' },
      ],
    });

    expect(preview.image).toBe('/hero.png');
    expect(preview.characters[0].portrait).toBe('/character.png');
    expect(preview.timeline.map((item) => item.image)).toEqual(['/timeline-1.png', '/timeline-2.png']);
    expect(preview.timelineVisual).toBeNull();
    expect(preview.climaxScene.mapImage).toBe('/map.png');
    expect(preview.climaxScene.backgroundImage).toBe('/climax.png');
    expect(preview.climaxScene.phaseImages).toEqual(['/phase-1.png', '/phase-2.png', '/phase-3.png']);
    expect(preview.aftermath.image).toBe('/aftermath.png');
    expect(preview.story.beats.flatMap((beat) => beat.blocks).filter((block) => block.type === 'image')).toHaveLength(1);

    const usedImages = [
      preview.image,
      ...preview.characters.map((item) => item.portrait),
      ...preview.timeline.map((item) => item.image),
      ...preview.climaxScene.phaseImages,
      preview.aftermath.image,
    ].filter(Boolean);
    expect(new Set(usedImages).size).toBe(usedImages.length);
    expect(preview.assetUsage.used.some((item) => item.slotKey === 'hero' && item.usedIn.includes('Ảnh bìa'))).toBe(true);
    expect(preview.assetUsage.used.find((item) => item.slotKey === 'battle-map').usedIn).toEqual(['Bản đồ cao trào']);
    expect(preview.assetUsage.unused.map((item) => item.slotKey)).toEqual(expect.arrayContaining(['battlefield', 'timeline-scene-3']));
  });

  it('renders preview timeline and aftermath images from generated slots', () => {
    const timelineHtml = renderToStaticMarkup(
      <InteractiveTimeline
        milestones={[
          { id: 'm1', title: 'Mốc 1', description: 'Diễn biến 1.', image: '/timeline-1.png' },
          { id: 'm2', title: 'Mốc 2', description: 'Diễn biến 2.', image: '/timeline-2.png' },
          { id: 'm3', title: 'Mốc 3', description: 'Diễn biến 3.', image: '/timeline-3.png' },
        ]}
      />,
    );
    const aftermathHtml = renderToStaticMarkup(
      <AftermathSummary aftermath={{ title: 'Hệ quả', image: '/aftermath.png', stats: [] }} />,
    );

    expect(timelineHtml).toContain('src="/timeline-1.png"');
    expect(timelineHtml).toContain('src="/timeline-2.png"');
    expect(timelineHtml).toContain('src="/timeline-3.png"');
    expect(timelineHtml.match(/tl-milestone__image/g)).toHaveLength(3);
    expect(timelineHtml).not.toContain('interactive-tl__visual');
    expect(aftermathHtml).toContain('src="/aftermath.png"');
  });

  it('renders tactical timeline mode from shared map visual data', () => {
    const html = renderToStaticMarkup(
      <InteractiveTimeline
        milestones={[
          { id: 'm1', date: '18/12/1972', title: 'Mốc 1', description: 'Diễn biến 1.' },
          { id: 'm2', month: '12', year: '1972', title: 'Mốc 2', description: 'Diễn biến 2.' },
        ]}
        visual={{ mode: 'air-defense', mapImage: '/air-map.png' }}
      />,
    );

    expect(html).toContain('interactive-tl--tactical');
    expect(html).toContain('src="/air-map.png"');
    expect(html).toContain('tl-tactical-overlay__radar');
    expect(html).toContain('18/12/1972');
    expect(html).toContain('12/1972');
    expect(html).not.toContain('tl-milestone__image');
  });

  it('does not use unrelated static phase art for admin climax labels', () => {
    const html = renderToStaticMarkup(
      <ClimaxScene
        scene={{
          title: 'Cao trào',
          backgroundImage: '/generated-climax.png',
          phases: [
            { id: 'p1', label: 'Giai đoạn 1', summary: 'A', description: 'A' },
            { id: 'p2', label: 'Giai đoạn 2', summary: 'B', description: 'B' },
          ],
          hotspots: [],
        }}
      />,
    );

    expect(html).toContain('Cần duyệt ảnh cao trào 1');
    expect(html).not.toContain('bach-dang-phase');
    expect(html).not.toContain('src="/generated-climax.png"');
  });

  it('does not treat fallback images as approved preview content', () => {
    const preview = toPreviewEvent({
      event: {
        id: 'event-1',
        slug: 'su-kien-thieu-anh',
        title: 'Sự kiện thiếu ảnh',
        era_id: 'era-test',
        era_slug: 'era-test',
        year: 1000,
        grade_tags: [],
        type: 'battle',
        featured: false,
        summary: 'Tóm tắt.',
        excerpt: 'Trích đoạn.',
        image: '',
        fallback_image: '/images/generated/custom-fallback.png',
        location: 'Việt Nam',
        actors: [],
        opponent: '',
        result: '',
        theme: 'vietnamese-history',
        template_type: 'battle',
        related_event_slugs: [],
        interactive_data: { characters: [], timeline: [], quiz: [] },
      },
      story: {
        story_json: {
          templateType: 'battle',
          beats: [{ type: 'setup', title: 'Bối cảnh', blocks: [{ type: 'text', body: 'Bối cảnh.' }] }],
        },
      },
      assets: [],
    });

    expect(preview.image).toBeNull();
    expect(preview.fallbackImage).toBe('/images/generated/custom-fallback.png');
    expect(preview.story.beats[0].blocks.some((block) => block.type === 'image')).toBe(false);
  });

  it('trims blank manual asset urls before saving', async () => {
    const spy = vi.spyOn(adminEventApi, 'upsertAsset').mockResolvedValue({});

    await saveManualAsset('event-1', { slot_key: 'hero', slot_label: 'Ảnh bìa' }, '   ');

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does not render whitespace image urls in story components', () => {
    const heroHtml = renderToStaticMarkup(
      <MemoryRouter>
        <EventHero
          heroScrolled={false}
          event={{
            title: 'Sự kiện',
            excerpt: 'Trích đoạn',
            image: '   ',
            fallbackImage: '/fallback.png',
            eraSlug: 'test',
            year: 1000,
            location: 'Việt Nam',
            actors: [],
          }}
        />
      </MemoryRouter>,
    );
    const blocksHtml = renderToStaticMarkup(
      <BeatBlocks blocks={[{ type: 'image', image: '   ', caption: 'Ảnh lỗi' }]} />,
    );

    expect(heroHtml).toContain('src="/fallback.png"');
    expect(blocksHtml).not.toContain('<img');
  });

  it('shows clear required and optional markers in admin event facts', () => {
    const html = renderToStaticMarkup(
      <EventMetaForm
        event={{ id: 'event-1', title: 'Bạch Đằng', slug: 'bach-dang', era_id: 'era-tran', year: 1288, type: 'battle', template_type: 'battle', summary: '', excerpt: '', grade_tags: [], actors: [], related_event_slugs: [] }}
        options={{ eras: [{ id: 'era-tran', slug: 'tran', name: 'Nhà Trần' }], eventTypes: ['battle'], templateTypes: ['battle'] }}
        onSave={vi.fn()}
      />,
    );

    expect(html).toContain('Tiêu đề');
    expect(html).toContain('Bắt buộc');
    expect(html).toContain('Địa điểm');
    expect(html).toContain('Không bắt buộc');
  });

  it('marks source text and file as one-of-two required inputs', () => {
    const html = renderToStaticMarkup(
      <SourceImportPanel eventId="event-1" sources={[]} onImport={vi.fn()} />,
    );

    expect(html).toContain('Tên tài liệu / nguồn');
    expect(html).toContain('Bắt buộc');
    expect(html.match(/Điền 1 trong 2/g)).toHaveLength(2);
    expect(html).toContain('PDF scan');
  });

  it('shows source extraction metadata for OCR imports', () => {
    const html = renderToStaticMarkup(
      <SourceImportPanel
        eventId="event-1"
        sources={[{
          id: 'source-1',
          title: 'SGK scan',
          status: 'ready',
          metadata: { extractionMethod: 'gemini_ocr', chunkCount: 5, pageCount: 3 },
        }]}
        onImport={vi.fn()}
      />,
    );

    expect(html).toContain('Đọc PDF scan bằng Gemini OCR');
    expect(html).toContain('5 đoạn nguồn');
    expect(html).toContain('3 trang');
  });

  it('marks storytelling asset slots with their current requirement', () => {
    const slots = ['hero', 'battle-map', 'character-1', 'timeline-scene-1'].map((slot_key) => ({
      id: slot_key,
      slot_key,
      status: 'missing',
      metadata: { template: 'battle', requirement: slot_key === 'character-1' || slot_key === 'timeline-scene-1' ? 'required' : undefined },
    }));
    const html = renderToStaticMarkup(
      <AssetSlotBoard slots={slots} onEnsure={vi.fn()} onPrompts={vi.fn()} onImage={vi.fn()} onReview={vi.fn()} onManual={vi.fn()} />,
    );

    expect(html).toContain('Ảnh bìa');
    expect(html).toContain('Bắt buộc');
    expect(html).toContain('Nhân vật 1');
    expect(html).toContain('Mốc diễn biến 1');
  });

  it('shows asset usage state in the image slot board', () => {
    const html = renderToStaticMarkup(
      <AssetSlotBoard
        slots={[
          { id: 'hero', slot_key: 'hero', slot_label: 'Ảnh bìa', status: 'approved', image_url: '/hero.png', metadata: { requirement: 'required' } },
          { id: 'timeline-scene-1', slot_key: 'timeline-scene-1', slot_label: 'Cảnh mốc 1', status: 'generated', image_url: '/timeline-1.png', metadata: { requirement: 'optional' } },
        ]}
        assetUsage={{ used: [{ slotKey: 'hero', usedIn: ['Ảnh bìa'], imageUrl: '/hero.png' }], unused: [{ slotKey: 'timeline-scene-1', imageUrl: '/timeline-1.png' }] }}
        onEnsure={vi.fn()}
        onPrompts={vi.fn()}
        onImage={vi.fn()}
        onReview={vi.fn()}
        onManual={vi.fn()}
      />,
    );

    expect(html).toContain('Đang dùng: Ảnh bìa');
    expect(html).toContain('Chưa dùng trong preview');
  });

  it('shows expected image slots from the selected template before slots are created', () => {
    const html = renderToStaticMarkup(
      <AssetSlotBoard
        slots={[]}
        templateDefinition={{
          templateType: 'battle_air_defense',
          name: 'Trận phòng không',
          assetSlots: [
            { slotKey: 'hero', slotLabel: 'Ảnh bìa', requirement: 'required' },
            { slotKey: 'radar-command', slotLabel: 'Sở chỉ huy radar', requirement: 'required' },
            { slotKey: 'missile-site', slotLabel: 'Trận địa tên lửa', requirement: 'required' },
            { slotKey: 'air-raid-map', slotLabel: 'Bản đồ đường bay', requirement: 'required' },
          ],
        }}
        onEnsure={vi.fn()}
        onPrompts={vi.fn()}
        onImage={vi.fn()}
        onReview={vi.fn()}
        onManual={vi.fn()}
      />,
    );

    expect(html).toContain('Trận phòng không');
    expect(html).toContain('4 ảnh nền tảng trước khi nhập nội dung chi tiết');
    expect(html).toContain('Sở chỉ huy radar');
    expect(html).toContain('Bản đồ đường bay');
  });

  it('labels dynamically added character slots beyond the original two', () => {
    const html = renderToStaticMarkup(
      <AssetSlotBoard
        slots={[{ id: 'character-4', slot_key: 'character-4', status: 'missing', metadata: { template: 'battle' } }]}
        onEnsure={vi.fn()}
        onPrompts={vi.fn()}
        onImage={vi.fn()}
        onReview={vi.fn()}
        onManual={vi.fn()}
      />,
    );

    expect(html).toContain('Nhân vật 4');
  });
});
