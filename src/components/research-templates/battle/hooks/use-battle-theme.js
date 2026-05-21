import { useMemo } from 'react';

/**
 * Battle template — Theme configuration.
 * Independent copy from story-system for full isolation.
 */
const STORY_THEMES = {
  'vietnamese-history': {
    id: 'vietnamese-history',
    name: 'Lịch sử Việt Nam',
    sectionPattern: ['light', 'dark', 'dark', 'climax', 'light', 'dark'],
  },
  'dark-cinematic': {
    id: 'dark-cinematic',
    name: 'Điện ảnh tối',
    sectionPattern: ['dark', 'dark', 'dark', 'climax', 'dark', 'dark'],
  },
  'parchment-scroll': {
    id: 'parchment-scroll',
    name: 'Cuộn giấy cổ',
    sectionPattern: ['light', 'light', 'light', 'climax', 'light', 'light'],
  },
  'war-strategy': {
    id: 'war-strategy',
    name: 'Chiến thuật quân sự',
    sectionPattern: ['dark', 'dark', 'dark', 'climax', 'dark', 'dark'],
  },
  'royal-court': {
    id: 'royal-court',
    name: 'Cung đình hoàng gia',
    sectionPattern: ['light', 'dark', 'light', 'climax', 'light', 'dark'],
  },
};

const DEFAULT_THEME = 'vietnamese-history';

const resolveTheme = (themeId) =>
  STORY_THEMES[themeId] ?? STORY_THEMES[DEFAULT_THEME];

export function useStoryTheme(themeId) {
  return useMemo(() => {
    const theme = resolveTheme(themeId ?? DEFAULT_THEME);
    return {
      theme,
      themeId: theme.id,
      sectionPattern: theme.sectionPattern,
      getSectionVariant: (index) => theme.sectionPattern[index] ?? 'dark',
    };
  }, [themeId]);
}
