import React, { useRef, useMemo } from 'react';

/* ── Hooks ── */
import {
  buildSectionDefs,
  useStorySections,
  useStoryBeats,
} from './hooks/use-story-sections.js';
import { useSectionAnimations } from './hooks/use-story-animations.js';
import { useStoryTheme } from './hooks/use-story-theme.js';

/* ── Navigation ── */
import { StoryTOC } from './navigation/story-toc.jsx';
import { StoryProgressIndicator } from '../story-interactive/story-progress-indicator.jsx';
import { ReadingProgressBar } from '../story/reading-progress-bar.jsx';

/* ── Sections ── */
import { EventHero } from './sections/event-hero.jsx';
import { SetupSection } from './sections/setup-section.jsx';
import { RisingSection } from './sections/rising-section.jsx';
import { ClimaxSection } from './sections/climax-section.jsx';
import { AftermathSection } from './sections/aftermath-section.jsx';
import { TakeawaySection } from './sections/takeaway-section.jsx';

/**
 * EventStoryPage — The top-level orchestrator.
 *
 * Usage:
 *   <EventStoryPage data={eventData} />
 *   <EventStoryPage data={eventData} relatedEvents={relatedEvents} />
 *
 * This is a SYSTEM, not a page.
 * It composes section components, resolves themes, and manages
 * scroll tracking — all driven by the data object.
 *
 * To add a new event, create a data file and pass it here.
 * No code changes required.
 */
export const EventStoryPage = ({ data, relatedEvents = [] }) => {
  const containerRef = useRef(null);

  /* ── Derive section definitions from data ── */
  const beats = data.story?.beats ?? [];
  const sectionDefs = useMemo(() => buildSectionDefs(beats), [beats]);

  /* ── Extract individual beats ── */
  const {
    hookBeat,
    setupBeat,
    risingBeat,
    climaxBeat,
    fallingBeat,
    takeawayBeat,
  } = useStoryBeats(beats);

  /* ── Resolve theme ── */
  const { themeId, getSectionVariant } = useStoryTheme(data.theme);

  /* ── Section tracking ── */
  const { activeIndex, heroScrolled, handleNavClick } = useStorySections(sectionDefs);

  /* ── Scroll animations ── */
  useSectionAnimations(containerRef);

  return (
    <article
      className="evt-story"
      ref={containerRef}
      data-story-theme={themeId}
      data-event-type={data.type}
    >
      <ReadingProgressBar />
      <StoryProgressIndicator sections={sectionDefs} />

      {/* ═══ I. HOOK — Full-screen Cinematic Hero ═══ */}
      <EventHero event={data} heroScrolled={heroScrolled} />

      {/* ═══ Sticky TOC ═══ */}
      <StoryTOC
        sections={sectionDefs}
        activeIndex={activeIndex}
        onNavClick={handleNavClick}
      />

      {/* ═══ II. SETUP — Context & Characters ═══ */}
      {setupBeat && (
        <SetupSection
          beat={setupBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'setup')}
          variant={getSectionVariant(1)}
        />
      )}

      {/* ═══ III. RISING ACTION — Timeline ═══ */}
      {risingBeat && (
        <RisingSection
          beat={risingBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'rising')}
          variant={getSectionVariant(2)}
        />
      )}

      {/* ═══ IV. CLIMAX — WOW Moment ═══ */}
      {climaxBeat && (
        <ClimaxSection
          beat={climaxBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'climax')}
          variant={getSectionVariant(3)}
        />
      )}

      {/* ═══ V. AFTERMATH ═══ */}
      {fallingBeat && (
        <AftermathSection
          beat={fallingBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'falling')}
          variant={getSectionVariant(4)}
        />
      )}

      {/* ═══ VI. TAKEAWAY ═══ */}
      {takeawayBeat && (
        <TakeawaySection
          beat={takeawayBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'takeaway')}
          variant={getSectionVariant(5)}
          relatedEvents={relatedEvents}
        />
      )}
    </article>
  );
};

export default EventStoryPage;
