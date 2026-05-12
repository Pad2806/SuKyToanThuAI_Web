import { describe, expect, it } from 'vitest';
import { getAllEvents } from '../src/lib/event-queries.js';
import { applyListingState, parseListingState, stringifyListingState } from '../src/lib/listing-state.js';

describe('listing state contracts', () => {
  it('round-trips valid filter state through URL parameters', () => {
    const state = { grade: 'THCS', sort: 'year-desc', topic: 'khang-chien-chong-xam-luoc', type: 'battle' };
    const parsed = parseListingState(stringifyListingState(state));

    expect(parsed).toEqual(state);
  });

  it('sorts by year without changing the result set', () => {
    const events = getAllEvents();
    const sorted = applyListingState(events, { grade: '', sort: 'year-desc', topic: '', type: '' });

    expect(sorted.map((event) => event.id).sort()).toEqual(events.map((event) => event.id).sort());
    expect(sorted[0].year).toBeGreaterThanOrEqual(sorted[sorted.length - 1].year);
  });
});
