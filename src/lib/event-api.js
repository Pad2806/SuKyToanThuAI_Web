/**
 * API-ready data fetching layer for story events.
 *
 * Resolves rich story data from the backend first, then falls back to local
 * mock modules so the UI remains usable while the API is offline in dev.
 *
 * The mock directory uses the convention:
 *   src/data/mock/{slug}.js  →  export const {camelCase} = { slug: '{slug}', ... }
 */

import { api } from './api-client.js';

/* ── Registry of known interactive event slugs → module paths ── */
const MOCK_REGISTRY = import.meta.glob('../data/mock/*.js');

/**
 * Fetch an interactive story event by slug.
 * Returns null if the slug has no matching data.
 *
 * @param {string} slug
 * @returns {Promise<import('../data/types/story-event-schema.js').StoryEventData | null>}
 */
export async function fetchStoryEvent(slug) {
  try {
    return await api.get(`/content/events/${slug}`);
  } catch {
    if (!import.meta.env.DEV) return null;
  }

  for (const path in MOCK_REGISTRY) {
    const mod = await MOCK_REGISTRY[path]();
    const data = Object.values(mod).find(
      (val) => val && typeof val === 'object' && val.slug === slug,
    );
    if (data) return data;
  }

  return null;
}

/**
 * Checks if an event object has the rich interactive data
 * needed for the full storytelling page.
 */
export function hasInteractiveData(event) {
  return (
    event?.characters?.length > 0 &&
    event?.timeline?.length > 0 &&
    event?.quiz?.length > 0 &&
    event?.story?.beats?.length > 0
  );
}

/**
 * Fetch related events for end-of-story navigation.
 * Returns lightweight summaries (slug, title, year).
 *
 * @param {string[]} slugs
 * @returns {Promise<{ slug: string, title: string, year: number }[]>}
 */
export async function fetchRelatedEvents(slugs = []) {
  if (slugs.length === 0) return [];

  const results = [];
  for (const slug of slugs) {
    const event = await fetchStoryEvent(slug);
    if (event) {
      results.push({ slug: event.slug, title: event.title, year: event.year });
    }
  }
  return results;
}
