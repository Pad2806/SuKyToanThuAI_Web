export const DEFAULT_STORY_IMAGE = '/images/generated/parchment.png';

export function cleanImageUrl(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isUsableImage(value, { allowDefault = true } = {}) {
  const src = cleanImageUrl(value);
  return Boolean(src) && (allowDefault || src !== DEFAULT_STORY_IMAGE);
}

export function pickDisplayImage(...candidates) {
  return candidates.map(cleanImageUrl).find(Boolean) || DEFAULT_STORY_IMAGE;
}

export function pickRealImage(...candidates) {
  return candidates.map(cleanImageUrl).find((src) => src && src !== DEFAULT_STORY_IMAGE) || null;
}
