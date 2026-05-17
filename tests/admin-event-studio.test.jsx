import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdminWorkQueue } from '../src/components/admin/admin-work-queue.jsx';
import { buildAdminFlowSteps } from '../src/components/admin/admin-flow-checklist.jsx';
import { QualityGatePanel } from '../src/components/admin/quality-gate-panel.jsx';
import { StoryInteractionsEditor } from '../src/components/admin/story-interactions-editor.jsx';

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
        { slot_key: 'climax', status: 'approved', image_url: '/climax.png' },
        { slot_key: 'aftermath', status: 'approved', image_url: '/aftermath.png' },
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
    expect(html).toContain('Dòng thời gian');
    expect(html).toContain('Câu hỏi trắc nghiệm');
  });
});
