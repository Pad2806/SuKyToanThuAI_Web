import { useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Battle template — Section definitions and tracking hooks.
 * Independent copy from story-system for full isolation.
 */
const BEAT_SECTION_MAP = {
  hook: { label: 'Mở màn' },
  setup: { label: 'Bối cảnh' },
  rising: { label: 'Diễn biến' },
  climax: { label: 'Cao trào' },
  falling: { label: 'Hệ quả' },
  takeaway: { label: 'Bài học' },
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/**
 * Generates section definitions from story beats.
 * Dynamically assigns Roman numerals to avoid gaps when sections are omitted.
 */
export function buildSectionDefs(beats = []) {
  const types = beats.map((b) => b.type);
  let numeralIndex = 0;

  return types.map((type) => {
    const isHook = type === 'hook';
    return {
      id: `evt-${type === 'falling' ? 'aftermath' : type}`,
      type,
      label: BEAT_SECTION_MAP[type]?.label ?? type,
      numeral: isHook ? '' : ROMAN_NUMERALS[numeralIndex++],
    };
  });
}

/**
 * Tracks which story section is currently visible via IntersectionObserver.
 */
export function useStorySections(sectionDefs) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroScrolled, setHeroScrolled] = useState(false);

  useEffect(() => {
    const sectionEls = sectionDefs
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          const idx = sectionDefs.findIndex((s) => s.id === visible.target.id);
          if (idx >= 0) setActiveIndex(idx);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );

    sectionEls.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [sectionDefs]);

  useEffect(() => {
    const handleScroll = () => {
      setHeroScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, []);

  return { activeIndex, heroScrolled, handleNavClick };
}

/**
 * Extracts individual beats from the story data by type.
 */
export function useStoryBeats(storyBeats = []) {
  return useMemo(() => {
    const map = {};
    for (const beat of storyBeats) {
      map[beat.type] = beat;
    }
    return {
      hookBeat: map.hook ?? null,
      setupBeat: map.setup ?? null,
      risingBeat: map.rising ?? null,
      climaxBeat: map.climax ?? null,
      fallingBeat: map.falling ?? null,
      takeawayBeat: map.takeaway ?? null,
    };
  }, [storyBeats]);
}
