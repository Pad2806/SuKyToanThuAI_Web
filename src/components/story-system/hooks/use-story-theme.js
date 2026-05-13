import { useMemo } from 'react';
import { resolveTheme, DEFAULT_THEME } from '../../../data/themes/story-themes.js';

/**
 * Resolves the theme config from event data.
 * Returns the theme object and the variant pattern for sections.
 */
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
