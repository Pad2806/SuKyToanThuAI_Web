import { api } from './api-client.js';

const base = '/content/admin/events';

export const adminEventApi = {
  options: () => api.get(`${base}/options`),
  list: (status) => api.get(`${base}${status ? `?status_filter=${status}` : ''}`),
  create: (payload) => api.post(base, payload),
  revisionDraft: (eventId) => api.post(`${base}/${eventId}/revision-draft`, {}),
  detail: (eventId) => api.get(`${base}/${eventId}`),
  sources: (eventId) => api.get(`${base}/${eventId}/sources`),
  updateFacts: (eventId, payload) => api.patch(`${base}/${eventId}/facts`, payload),
  updateStory: (eventId, payload) => api.patch(`${base}/${eventId}/story`, payload),
  updateInteractions: (eventId, payload) => api.patch(`${base}/${eventId}/interactions`, payload),
  importSource: (eventId, formData) => api.form(`${base}/${eventId}/sources`, formData),
  draftStory: (eventId, payload) => api.post(`${base}/${eventId}/ai/draft-story`, payload),
  ensureSlots: (eventId) => api.post(`${base}/${eventId}/assets/ensure-slots`, {}),
  generatePrompts: (eventId) => api.post(`${base}/${eventId}/assets/prompts`, {}),
  upsertAsset: (eventId, payload) => api.post(`${base}/${eventId}/assets`, payload),
  generateImage: (eventId, slotId) => api.post(`${base}/${eventId}/assets/${slotId}/generate-image`, {}),
  reviewAsset: (eventId, slotId, payload) => api.patch(`${base}/${eventId}/assets/${slotId}/review`, payload),
  quality: (eventId) => api.post(`${base}/${eventId}/quality-check`, {}),
  submitReview: (eventId) => api.post(`${base}/${eventId}/submit-review`, {}),
  publish: (eventId) => api.post(`${base}/${eventId}/publish`, {}),
  archive: (eventId) => api.post(`${base}/${eventId}/archive`, {}),
};
