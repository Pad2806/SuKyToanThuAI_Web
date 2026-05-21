/**
 * Stable Random Fallback Image Resolver
 * Prevents screen flickering by generating a stable fallback image based on a hash of the content title, index, or key.
 */

export const FALLBACK_IMAGES = [
  '/images/generated/parchment.png',
  '/images/generated/fallback1.jpg',
  '/images/generated/fallback2.png',
  '/images/generated/fallback3.png',
  '/images/generated/fallback4.png',
  '/images/generated/fallback5.png',
  '/images/generated/fallback6.png',
  '/images/generated/fallback7.png',
];

/**
 * Returns a stable fallback image URL based on a seed string (e.g. event ID, title, phase title)
 * @param {string} [seed] - A seed string to make the fallback stable
 * @returns {string} - Fallback image URL
 */
export const getStableFallbackImage = (seed) => {
  if (!seed) {
    const num = Math.floor(Math.random() * 7) + 1;
    const ext = num === 1 ? 'jpg' : 'png';
    return `/images/generated/fallback${num}.${ext}`;
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const num = (Math.abs(hash) % 7) + 1;
  const ext = num === 1 ? 'jpg' : 'png';
  return `/images/generated/fallback${num}.${ext}`;
};

/**
 * Resolves an image URL, falling back to a stable random fallback image if the URL is missing or points to parchment.png
 * @param {string | null | undefined} imageUrl - The original image URL
 * @param {string} [seed] - Optional seed for stable fallback selection
 * @returns {string} - The resolved image URL
 */
export const resolveImageUrl = (imageUrl, seed) => {
  if (!imageUrl || imageUrl === '/images/generated/parchment.png') {
    return getStableFallbackImage(seed);
  }
  return imageUrl;
};
