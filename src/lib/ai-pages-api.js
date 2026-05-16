import { api } from './api-client.js';

export const createResearchPage = (payload) => api.post('/ai/research', payload);

export const createCreatorPage = (payload) => api.post('/ai/create', payload);

export const confirmMissingSections = (pageId) => (
  api.post(`/ai/create/${pageId}/confirm-missing`, {})
);

export const listAiPages = (sourceMode) => {
  const query = sourceMode ? `?sourceMode=${encodeURIComponent(sourceMode)}` : '';
  return api.get(`/ai/pages${query}`);
};

export const getAiPage = (pageId) => api.get(`/ai/pages/${pageId}`);
