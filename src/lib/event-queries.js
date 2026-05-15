import mockEras from '../data/mock/eras.json';
import mockEvents from '../data/mock/events.json';
import { api } from './api-client.js';
import { withStoryFallback } from './story-fallbacks.js';

const byOrder = (left, right) => left.order - right.order;
const byYear = (left, right) => left.year - right.year;

let eras = [...mockEras];
let events = [];

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const normalizeEvent = (event) => {
  const normalized = { ...event, topics: event.topics ?? [event.type].filter(Boolean) };
  return withStoryFallback(normalized);
};

events = mockEvents.map(normalizeEvent);

const replaceById = (items, item) => {
  const index = items.findIndex((candidate) => candidate.id === item.id || candidate.slug === item.slug);
  if (index < 0) return [...items, item];
  const next = [...items];
  next[index] = item;
  return next;
};

const resolveEra = (eraSlugOrId) =>
  eras.find((era) => era.slug === eraSlugOrId || era.id === eraSlugOrId);

const queryString = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const value = search.toString();
  return value ? `?${value}` : '';
};

export const hydrateContentCache = ({ eras: nextEras, events: nextEvents } = {}) => {
  if (Array.isArray(nextEras)) eras = nextEras;
  if (Array.isArray(nextEvents)) events = nextEvents.map(normalizeEvent);
};

export const loadAllEras = async () => {
  try {
    eras = await api.get('/content/eras');
  } catch {
    return getAllEras();
  }
  return getAllEras();
};

export const loadAllEvents = async (filters = {}) => {
  try {
    events = (await api.get(`/content/events${queryString(filters)}`)).map(normalizeEvent);
  } catch {
    return getAllEvents();
  }
  return getAllEvents();
};

export const loadEraBySlug = async (eraSlug) => {
  try {
    const era = await api.get(`/content/eras/${eraSlug}`);
    eras = replaceById(eras, era);
    if (Array.isArray(era.events)) {
      events = mergeEvents(events, era.events);
    }
    return era;
  } catch {
    return getEraBySlug(eraSlug);
  }
};

export const loadEventBySlug = async (eventSlug) => {
  try {
    const event = normalizeEvent(await api.get(`/content/events/${eventSlug}`));
    events = replaceById(events, event);
    return event;
  } catch {
    return getEventBySlug(eventSlug);
  }
};

export const loadFeaturedEvents = async (limit) => {
  try {
    const loaded = await api.get(`/content/events/featured${queryString({ limit })}`);
    events = mergeEvents(events, loaded);
    return loaded.map(normalizeEvent);
  } catch {
    return getFeaturedEvents(limit);
  }
};

export const loadSearchEvents = async ({ q = '', filters = {} } = {}) => {
  try {
    const loaded = await api.get(`/content/search${queryString({ q, ...filters })}`);
    events = mergeEvents(events, loaded);
    return loaded.map(normalizeEvent);
  } catch {
    return searchEvents({ q, filters });
  }
};

export const formatHistoricalYear = (year) => {
  const value = Number(year);
  if (!Number.isFinite(value)) return 'Chưa rõ';
  return value < 0 ? `${Math.abs(value)} TCN` : `${value}`;
};

export const getAllEvents = () => [...events].map(normalizeEvent).sort(byYear);

export const getEventBySlug = (eventSlug) => {
  const event = events.find((item) => item.slug === eventSlug || item.id === eventSlug);
  return event ? normalizeEvent(event) : null;
};

export const getAllEras = () => [...eras].sort(byOrder);

export const getEraBySlug = (eraSlug) => resolveEra(eraSlug) ?? null;

export const getAdjacentEras = (eraSlug) => {
  const orderedEras = getAllEras();
  const currentIndex = orderedEras.findIndex((era) => era.slug === eraSlug || era.id === eraSlug);
  if (currentIndex < 0) return { previous: null, current: null, next: null };
  return {
    previous: orderedEras[currentIndex - 1] ?? null,
    current: orderedEras[currentIndex],
    next: orderedEras[currentIndex + 1] ?? null,
  };
};

export const getEventsByEra = (eraSlugOrId) => {
  const era = resolveEra(eraSlugOrId);
  if (!era) return [];
  return events.filter((event) => event.eraId === era.id).map(normalizeEvent).sort(byYear);
};

export const getEventsByGrade = (grade) =>
  events.filter((event) => event.gradeTags.includes(grade)).map(normalizeEvent).sort(byYear);

export const getAllTopics = () =>
  [...new Set(events.flatMap((event) => event.topics ?? [event.type]).filter(Boolean))]
    .sort()
    .map((slug) => ({ slug, label: slug.replaceAll('-', ' ') }));

export const getEventsByTopic = (topic) =>
  events.filter((event) => event.topics?.includes(topic)).map(normalizeEvent).sort(byYear);

export const getFeaturedEvents = (limit) => {
  const featuredEvents = events.filter((event) => event.featured).map(normalizeEvent).sort(byYear);
  return Number.isFinite(limit) ? featuredEvents.slice(0, limit) : featuredEvents;
};

export const getRelatedEvents = ({ eventId, limit = 3 }) => {
  const source = events.find((event) => event.id === eventId || event.slug === eventId);
  if (!source) return [];
  const related = events.filter((event) => {
    const explicit = source.relatedEventSlugs?.includes(event.slug);
    const sharesEra = event.eraId === source.eraId;
    return event.id !== source.id && (explicit || sharesEra);
  });
  return related.map(normalizeEvent).slice(0, limit);
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
    .map(normalizeEvent)
    .sort(byYear);
};

const matchesFilter = (event, filters = {}) => {
  const matchesEra = !filters.era || event.eraSlug === filters.era || event.eraId === filters.era;
  const matchesGrade = !filters.grade || event.gradeTags.includes(filters.grade);
  const matchesType = !filters.type || event.type === filters.type;
  return matchesEra && matchesGrade && matchesType;
};

const mergeEvents = (currentEvents, nextEvents) =>
  nextEvents.reduce((merged, event) => replaceById(merged, normalizeEvent(event)), currentEvents);
