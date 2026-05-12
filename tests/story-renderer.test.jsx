import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { StoryRenderer } from '../src/components/story/story-renderer.jsx';
import { getEventBySlug } from '../src/lib/event-queries.js';

describe('story renderer', () => {
  it('renders table of contents, event metadata, and new block types', () => {
    const event = getEventBySlug('chien-thang-bach-dang-938');
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StoryRenderer event={event} />
      </MemoryRouter>,
    );

    expect(html).toContain('Mục lục');
    expect(html).toContain('Sự kiện nhanh');
    expect(html).toContain('Chú giải');
    expect(html).toContain('Năm');
  });
});
