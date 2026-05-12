import eras from '../data/mock/eras.json';
import events from '../data/mock/events.json';
import topics from '../data/mock/topics.json';
import { withStoryFallback } from './story-fallbacks.js';

const byOrder = (left, right) => left.order - right.order;
const byYear = (left, right) => left.year - right.year;

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const resolveEra = (eraSlugOrId) =>
  eras.find((era) => era.slug === eraSlugOrId || era.id === eraSlugOrId);

export const formatHistoricalYear = (year) => {
  const value = Number(year);

  if (!Number.isFinite(value)) {
    return 'Chưa rõ';
  }

  return value < 0 ? `${Math.abs(value)} TCN` : `${value}`;
};

const matchesFilter = (event, filters = {}) => {
  const matchesEra = !filters.era || event.eraSlug === filters.era || event.eraId === filters.era;
  const matchesGrade = !filters.grade || event.gradeTags.includes(filters.grade);
  const matchesTopic = !filters.topic || event.topics.includes(filters.topic);
  const matchesType = !filters.type || event.type === filters.type;

  return matchesEra && matchesGrade && matchesTopic && matchesType;
};

export const getAllEvents = () => [...events].map(withStoryFallback).sort(byYear);

export const getEventBySlug = (eventSlug) =>
  withStoryFallback(events.find((event) => event.slug === eventSlug || event.id === eventSlug)) ?? null;

export const getAllEras = () => [...eras].sort(byOrder);

export const getAllTopics = () => [...topics];

export const getEraBySlug = (eraSlug) => resolveEra(eraSlug) ?? null;

export const getAdjacentEras = (eraSlug) => {
  const orderedEras = getAllEras();
  const currentIndex = orderedEras.findIndex((era) => era.slug === eraSlug || era.id === eraSlug);

  if (currentIndex < 0) {
    return { previous: null, current: null, next: null };
  }

  return {
    previous: orderedEras[currentIndex - 1] ?? null,
    current: orderedEras[currentIndex],
    next: orderedEras[currentIndex + 1] ?? null,
  };
};

export const getEventsByEra = (eraSlugOrId) => {
  const era = resolveEra(eraSlugOrId);

  if (!era) {
    return [];
  }

  return events.filter((event) => event.eraId === era.id).map(withStoryFallback).sort(byYear);
};

export const getEventsByGrade = (grade) =>
  events.filter((event) => event.gradeTags.includes(grade)).map(withStoryFallback).sort(byYear);

export const getEventsByTopic = (topicSlug) =>
  events.filter((event) => event.topics.includes(topicSlug)).map(withStoryFallback).sort(byYear);

export const getFeaturedEvents = (limit) => {
  const featuredEvents = events.filter((event) => event.featured).map(withStoryFallback).sort(byYear);

  return Number.isFinite(limit) ? featuredEvents.slice(0, limit) : featuredEvents;
};

export const getRelatedEvents = ({ eventId, limit = 3 }) => {
  const source = events.find((event) => event.id === eventId || event.slug === eventId);

  if (!source) {
    return [];
  }

  const related = events.filter((event) => {
    const sharesTopic = event.topics.some((topic) => source.topics.includes(topic));
    const sharesEra = event.eraId === source.eraId;
    return event.id !== source.id && (sharesTopic || sharesEra);
  });

  return related.map(withStoryFallback).slice(0, limit);
};

export const searchEvents = ({ q = '', filters = {} } = {}) => {
  const query = normalizeText(q);

  return events
    .filter((event) => {
      const haystack = normalizeText([
        event.title,
        event.summary,
        event.excerpt,
        event.location,
        ...(event.actors ?? []),
      ].join(' '));
      const matchesQuery = !query || haystack.includes(query);
      return matchesQuery && matchesFilter(event, filters);
    })
    .map(withStoryFallback)
    .sort(byYear);
};
