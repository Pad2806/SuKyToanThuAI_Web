import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { StoryRenderer } from '../src/components/story/story-renderer.jsx';
import { getEventBySlug } from '../src/lib/event-queries.js';

describe('story renderer', () => {
  it('renders table of contents, event metadata, and new block types', () => {
    const event = structuredClone(getEventBySlug('chien-thang-bach-dang-938'));
    event.story.beats = event.story.beats.map((beat) => {
      if (beat.type === 'setup') {
        return {
          ...beat,
          blocks: [
            { type: 'quick-facts', items: [{ label: 'Năm', value: '938' }] },
            ...(beat.blocks ?? []).filter((block) => block.type !== 'quick-facts'),
          ],
        };
      }

      if (beat.type === 'takeaway') {
        return {
          ...beat,
          blocks: [
            ...(beat.blocks ?? []),
            {
              type: 'glossary',
              terms: [{ term: 'Tự chủ', definition: 'Quyền tự quyết vận mệnh cộng đồng.' }],
            },
          ],
        };
      }

      return beat;
    });

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
