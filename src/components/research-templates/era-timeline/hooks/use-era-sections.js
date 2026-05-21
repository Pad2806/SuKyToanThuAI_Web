import { useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Era Timeline template — Section definitions and tracking hooks.
 */
const BEAT_SECTION_MAP = {
  hook: { label: 'Tổng Quan' },
  setup: { label: 'Bối Cảnh' },
  rising: { label: 'Dòng Chảy' },
  takeaway: { label: 'Bài Học' },
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function buildSectionDefs(beats = []) {
  const types = beats.map((b) => b.type);
  let numeralIndex = 0;
  return types.map((type) => {
    const isHook = type === 'hook';
    return {
      id: `evt-${type}`,
      type,
      label: BEAT_SECTION_MAP[type]?.label ?? type,
      numeral: isHook ? '' : ROMAN_NUMERALS[numeralIndex++],
    };
  });
}

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
      takeawayBeat: map.takeaway ?? null,
    };
  }, [storyBeats]);
}
