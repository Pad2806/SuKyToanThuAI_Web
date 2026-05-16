import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { CoverageWarningPanel } from '../src/components/ai-studio/coverage-warning-panel.jsx';
import { EventStoryPage } from '../src/components/story-system/event-story-page.jsx';

const eventData = {
  id: 'page-1',
  slug: 'ai-page-page-1',
  title: 'Trang AI mẫu',
  eraId: null,
  eraSlug: null,
  year: null,
  gradeTags: [],
  topics: [],
  type: 'universal',
  featured: false,
  summary: 'Trang được tạo từ AI Studio.',
  excerpt: 'Trang được tạo từ AI Studio.',
  image: null,
  fallbackImage: '/images/generated/parchment.png',
  location: null,
  actors: [],
  opponent: null,
  result: null,
  characters: [],
  timeline: [],
  climaxScene: null,
  aftermath: null,
  takeaway: null,
  quiz: [],
  story: { templateType: 'universal', beats: [{ type: 'setup', title: 'Bối cảnh', blocks: [{ type: 'text', body: 'Nội dung từ người dùng.' }] }] },
  theme: 'vietnamese-history',
  relatedEventSlugs: [],
};

describe('AI Studio story-event pages', () => {
  it('renders partial generated event data with the system story renderer', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <EventStoryPage data={eventData} />
      </MemoryRouter>,
    );

    expect(html).toContain('Trang AI mẫu');
    expect(html).toContain('Nội dung từ người dùng.');
  });

  it('shows missing-data warnings before omission confirmation', () => {
    const html = renderToStaticMarkup(
      <CoverageWarningPanel
        report={{ missing: [{ key: 'timeline', label: 'Dòng thời gian', reason: 'Thiếu mốc.' }] }}
        onEdit={() => {}}
        onContinue={() => {}}
      />,
    );

    expect(html).toContain('Trang đang thiếu dữ liệu');
    expect(html).toContain('Dòng thời gian');
  });
});
