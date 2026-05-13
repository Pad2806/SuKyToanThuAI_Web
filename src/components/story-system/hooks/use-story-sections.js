import { useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Section definition shape used across the story system.
 * Generated from event data, not hardcoded.
 */
const BEAT_SECTION_MAP = {
  hook: { label: 'Mở màn', numeral: 'I' },
  setup: { label: 'Bối cảnh', numeral: 'II' },
  rising: { label: 'Diễn biến', numeral: 'III' },
  climax: { label: 'Cao trào', numeral: 'IV' },
  falling: { label: 'Hệ quả', numeral: 'V' },
  takeaway: { label: 'Bài học', numeral: 'VI' },
};

/**
 * Generates section definitions from story beats.
 * Keeps it data-driven — no hardcoded section list.
 */
export function buildSectionDefs(beats = []) {
  const types = beats.map((b) => b.type);
  return types.map((type) => ({
    id: `evt-${type === 'falling' ? 'aftermath' : type}`,
    type,
    label: BEAT_SECTION_MAP[type]?.label ?? type,
    numeral: BEAT_SECTION_MAP[type]?.numeral ?? '',
  }));
}

/**
 * Tracks which story section is currently visible via IntersectionObserver.
 * Returns activeIndex, heroScrolled state, and a nav click handler.
 */
export function useStorySections(sectionDefs) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroScrolled, setHeroScrolled] = useState(false);

  /* ── Section tracking via IntersectionObserver ── */
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

  /* ── Hero scroll detection ── */
  useEffect(() => {
    const handleScroll = () => {
      setHeroScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Navigate to section ── */
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
