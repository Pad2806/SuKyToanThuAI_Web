import { describe, expect, it } from 'vitest';
import {
  getAdjacentEras,
  getAllEras,
  getAllEvents,
  getAllTopics,
  getEraBySlug,
  getEventsByEra,
  getEventsByGrade,
  getEventsByTopic,
  getFeaturedEvents,
  getRelatedEvents,
  searchEvents,
} from '../src/lib/event-queries.js';

describe('event query contracts', () => {
  it('returns ordered eras and resolves an era by slug', () => {
    const eras = getAllEras();
    const orders = eras.map((era) => era.order);

    expect(eras.length).toBeGreaterThanOrEqual(2);
    expect(orders).toEqual([...orders].sort((left, right) => left - right));
    expect(new Set(orders).size).toBe(eras.length);
    expect(getEraBySlug(eras[0].slug)).toEqual(eras[0]);
  });

  it('filters events by era slug using event era linkage', () => {
    const populatedEras = getAllEras().filter((era) => getEventsByEra(era.slug).length > 0);

    expect(populatedEras.length).toBeGreaterThanOrEqual(2);

    for (const era of populatedEras) {
      const events = getEventsByEra(era.slug);

      expect(events.length).toBeGreaterThan(0);
      expect(events.every((event) => event.eraId === era.id)).toBe(true);
      expect(events.every((event) => event.eraSlug === era.slug)).toBe(true);
    }
  });

  it('filters by grade and topic without returning unrelated events', () => {
    const thcsEvents = getEventsByGrade('THCS');
    const topic = getAllTopics()[0];
    const topicEvents = getEventsByTopic(topic.slug);

    expect(thcsEvents.length).toBeGreaterThan(0);
    expect(thcsEvents.every((event) => event.gradeTags.includes('THCS'))).toBe(true);
    expect(topicEvents.length).toBeGreaterThan(0);
    expect(topicEvents.every((event) => event.topics.includes(topic.slug))).toBe(true);
  });

  it('returns featured, related, search, and adjacent results within valid sets', () => {
    const allEvents = getAllEvents();
    const source = allEvents[0];
    const featured = getFeaturedEvents(3);
    const related = getRelatedEvents({ eventId: source.id, limit: 3 });
    const searchResults = searchEvents({ q: source.title.split(' ')[0] });
    const adjacent = getAdjacentEras(source.eraSlug);

    expect(featured.length).toBeLessThanOrEqual(3);
    expect(featured.every((event) => event.featured)).toBe(true);
    expect(related.every((event) => event.id !== source.id)).toBe(true);
    expect(searchResults.every((event) => allEvents.some((item) => item.id === event.id))).toBe(true);
    expect(adjacent.next?.order ?? Number.POSITIVE_INFINITY).toBeGreaterThan(
      adjacent.current.order,
    );
  });
});
