/**
 * Story theme configuration.
 * Each theme overrides CSS custom properties via a `data-story-theme` attribute.
 * The CSS files in `styles/themes/` define the actual overrides.
 *
 * Theme selection:  eventData.theme → fallback to 'vietnamese-history'
 */

export const STORY_THEMES = {
  'vietnamese-history': {
    id: 'vietnamese-history',
    name: 'Lịch sử Việt Nam',
    description: 'Gold accents, parchment tones, cinematic warmth',
    sectionPattern: ['light', 'dark', 'dark', 'climax', 'light', 'dark'],
  },
  'dark-cinematic': {
    id: 'dark-cinematic',
    name: 'Điện ảnh tối',
    description: 'Deep blacks, ember highlights, dramatic contrast',
    sectionPattern: ['dark', 'dark', 'dark', 'climax', 'dark', 'dark'],
  },
  'parchment-scroll': {
    id: 'parchment-scroll',
    name: 'Cuộn giấy cổ',
    description: 'Warm parchment, ink calligraphy, scholarly tone',
    sectionPattern: ['light', 'light', 'light', 'climax', 'light', 'light'],
  },
  'war-strategy': {
    id: 'war-strategy',
    name: 'Chiến thuật quân sự',
    description: 'Dark strategic maps, red & gold, military precision',
    sectionPattern: ['dark', 'dark', 'dark', 'climax', 'dark', 'dark'],
  },
  'royal-court': {
    id: 'royal-court',
    name: 'Cung đình hoàng gia',
    description: 'Deep crimson, gold leaf, imperial elegance',
    sectionPattern: ['light', 'dark', 'light', 'climax', 'light', 'dark'],
  },
};

export const DEFAULT_THEME = 'vietnamese-history';

export const resolveTheme = (themeId) =>
  STORY_THEMES[themeId] ?? STORY_THEMES[DEFAULT_THEME];
