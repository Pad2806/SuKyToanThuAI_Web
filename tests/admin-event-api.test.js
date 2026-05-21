import { afterEach, describe, expect, it, vi } from 'vitest';
import { adminEventApi } from '../src/lib/admin-event-api.js';

describe('admin event API client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds admin event requests against the content API prefix', async () => {
    const calls = [];
    vi.stubGlobal('fetch', vi.fn(async (url, options = {}) => {
      calls.push({ url, options });
      return {
        ok: true,
        status: 200,
        json: async () => [],
      };
    }));

    await adminEventApi.options();
    await adminEventApi.revisionDraft('event-1');
    await adminEventApi.sources('event-1');
    await adminEventApi.submitReview('event-1');
    await adminEventApi.importSource('event-1', new FormData());

    expect(calls[0].url).toBe('/api/content/admin/events/options');
    expect(calls[0].options.method).toBeUndefined();
    expect(calls[1].url).toBe('/api/content/admin/events/event-1/revision-draft');
    expect(calls[1].options.method).toBe('POST');
    expect(calls[2].url).toBe('/api/content/admin/events/event-1/sources');
    expect(calls[2].options.method).toBeUndefined();
    expect(calls[3].url).toBe('/api/content/admin/events/event-1/submit-review');
    expect(calls[3].options.method).toBe('POST');
    expect(calls[4].url).toBe('/api/content/admin/events/event-1/sources');
    expect(calls[4].options.method).toBe('POST');
    expect(calls[4].options.headers.get('Content-Type')).toBeNull();
  });

  it('formats FastAPI validation errors as readable messages', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 422,
      json: async () => ({
        detail: [{
          loc: ['body', 'slug'],
          msg: 'String should have at least 2 characters',
        }],
      }),
    })));

    await expect(adminEventApi.create({ title: 'Do', slug: 'o' }))
      .rejects
      .toThrow('slug: String should have at least 2 characters');
  });

  it('does not coerce object error details to [object Object]', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 400,
      json: async () => ({ detail: { reason: 'bad payload' } }),
    })));

    await expect(adminEventApi.create({}))
      .rejects
      .toThrow('{"reason":"bad payload"}');
  });
});
