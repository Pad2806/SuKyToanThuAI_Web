import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { EventStoryPage } from '../src/components/story-system/event-story-page.jsx';

const event = {
  id: 'event-layout',
  slug: 'event-layout',
  title: 'Tran Bach Dang',
  eraSlug: 'tran',
  year: 1288,
  type: 'battle',
  theme: 'war-strategy',
  excerpt: 'A decisive river battle.',
  image: '/hero.png',
  location: 'Bach Dang river',
  actors: ['Tran Hung Dao'],
  opponent: 'Yuan fleet',
  characters: [
    {
      id: 'leader',
      name: 'Tran Hung Dao',
      role: 'Commander',
      side: 'dai-viet',
      portrait: '/leader.png',
      bio: 'Designed the river trap and coordinated the counterattack.',
    },
    {
      id: 'general',
      name: 'Tran Khanh Du',
      role: 'Ambush general',
      side: 'dai-viet',
      portrait: '/general.png',
      bio: 'Cut the supply route before the decisive river battle.',
    },
    {
      id: 'admiral',
      name: 'O Ma Nhi',
      role: 'Yuan naval commander',
      side: 'yuan',
      portrait: '/admiral.png',
      bio: 'Led the fleet into the tidal trap.',
    },
    {
      id: 'prince',
      name: 'Thoat Hoan',
      role: 'Expedition commander',
      side: 'yuan',
      portrait: '/prince.png',
      bio: 'Commanded the larger invasion force.',
    },
  ],
  timeline: [
    {
      id: 'm1',
      year: '1288',
      month: 'High tide',
      title: 'The fleet enters',
      description: 'Enemy ships advance across the hidden stakes.',
      image: '/timeline-1.png',
      facts: ['High tide hid the stake field', 'The fleet moved past the trap zone'],
    },
  ],
  climaxScene: {
    title: 'Final trap',
    backgroundImage: '/map.png',
    phaseImages: ['/phase-1.png'],
    phases: [
      {
        id: 'p1',
        label: 'Low tide',
        summary: 'The stakes emerge.',
        description: 'The trapped fleet cannot retreat.',
        keyDetail: 'Timing turned the river into a weapon.',
      },
    ],
    hotspots: [
      {
        id: 'h1',
        x: 45,
        y: 52,
        label: 'Stake field',
        description: 'Hidden stakes broke the ship formation.',
        role: 'Main trap zone',
      },
    ],
  },
  aftermath: {
    title: 'Outcome',
    stats: [{ label: 'Result', value: 'Victory' }],
  },
  takeaway: {
    happened: 'The ambush succeeded.',
    whyItMatters: 'It ended the invasion.',
    lesson: 'Terrain knowledge can offset force imbalance.',
  },
  quiz: [],
  story: {
    beats: [
      {
        type: 'setup',
        title: 'Boi canh',
        blocks: [
          { type: 'text', body: 'The invasion put the country under pressure.' },
          { type: 'quick-facts', title: 'Facts', items: [{ label: 'Year', value: '1288' }] },
          { type: 'image', image: '/setup.png', caption: 'River context' },
        ],
      },
      {
        type: 'rising',
        title: 'Dien bien',
        blocks: [{ type: 'text', body: 'The defending force waited for tide timing.' }],
      },
      {
        type: 'climax',
        title: 'Cao trao',
        blocks: [{ type: 'text', body: 'The trap closed.' }],
      },
      {
        type: 'falling',
        title: 'He qua',
        blocks: [{ type: 'text', body: 'The invaders retreated.' }],
      },
      {
        type: 'takeaway',
        title: 'Bai hoc',
        blocks: [{ type: 'text', body: 'Strategy mattered.' }],
      },
    ],
  },
};

describe('event story full-width layout', () => {
  it('renders the cover hero first, then the requested cinematic section order', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <EventStoryPage data={event} previewMode />
      </MemoryRouter>,
    );

    expect(html).toContain('evt-story--fullscreen');
    expect(html).toContain('id="evt-hook"');

    const heroIndex = html.indexOf('id="evt-hook"');
    const setupIndex = html.indexOf('id="evt-setup"');
    const charactersIndex = html.indexOf('id="evt-characters"');
    const risingIndex = html.indexOf('id="evt-rising"');
    const climaxIndex = html.indexOf('id="evt-climax"');
    const mapIndex = html.indexOf('id="evt-tactical-map"');
    const outcomesIndex = html.indexOf('id="evt-outcomes"');

    expect([setupIndex, charactersIndex, risingIndex, climaxIndex, mapIndex, outcomesIndex].every((i) => i >= 0)).toBe(true);
    expect(heroIndex).toBeLessThan(setupIndex);
    expect(setupIndex).toBeLessThan(charactersIndex);
    expect(charactersIndex).toBeLessThan(risingIndex);
    expect(risingIndex).toBeLessThan(climaxIndex);
    expect(climaxIndex).toBeLessThan(mapIndex);
    expect(mapIndex).toBeLessThan(outcomesIndex);
  });

  it('uses full-screen character rows, enriched filmstrip slides, and an outcome visual', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <EventStoryPage data={event} previewMode />
      </MemoryRouter>,
    );

    expect(html).toContain('char-profile--cinematic');
    expect(html).toContain('char-profile--screen');
    expect(html).toContain('char-row');
    expect(html).toContain('background-image:url(/leader.png)');
    expect(html).toContain('High tide hid the stake field');
    expect(html).toContain('climax-map--fullscreen');
    expect(html).toContain('Main trap zone');
    expect(html).toContain('evt-outcomes-visual');
  });
});
