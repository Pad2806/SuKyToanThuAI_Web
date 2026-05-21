import React, { useRef, useMemo } from 'react';

/* ── Hooks ── */
import {
  buildSectionDefs,
  useStorySections,
  useStoryBeats,
} from './hooks/use-era-sections.js';
import { useSectionAnimations } from './hooks/use-era-animations.js';

/* ── Shared UI (reuse from battle) ── */
import { ReadingProgressBar } from '../battle/shared/battle-progress-bar.jsx';
import { StoryProgressIndicator } from '../battle/shared/battle-progress-indicator.jsx';

/* ── Era-specific sections ── */
import { EraHero } from './sections/era-hero.jsx';
import { EraOverview } from './sections/era-overview.jsx';
import { EraFlow } from './sections/era-flow.jsx';
import { EraTakeaway } from './sections/era-takeaway.jsx';

/* ── Styles ── */
import './era-timeline.css';

/**
 * EraTimelineTemplate — Page layout for time-period / multi-era content.
 *
 * Renders a vertical timeline flow of historical eras with events,
 * connections, and interactive cards.
 */
export const EraTimelineTemplate = ({ data }) => {
  const containerRef = useRef(null);

  const beats = data.story?.beats ?? [];
  const sectionDefs = useMemo(() => buildSectionDefs(beats), [beats]);

  const { hookBeat, setupBeat, risingBeat, takeawayBeat } = useStoryBeats(beats);
  const { activeIndex, heroScrolled, handleNavClick } = useStorySections(sectionDefs);
  useSectionAnimations(containerRef);

  const eras = data.eras ?? [];
  const connections = data.connections ?? [];

  return (
    <article
      className="evt-story"
      ref={containerRef}
      data-story-theme={data.theme || 'history-overview'}
      data-event-type="era-timeline"
      data-research-template="era-timeline"
    >
      <ReadingProgressBar />
      <StoryProgressIndicator sections={sectionDefs} />

      {/* ═══ I. HERO — Full-screen Overview ═══ */}
      <EraHero event={data} heroScrolled={heroScrolled} />

      {/* ═══ II. OVERVIEW — Stats + Context ═══ */}
      {setupBeat && (
        <EraOverview
          beat={setupBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'setup')}
          variant="dark"
        />
      )}

      {/* ═══ III. TIMELINE FLOW — The WOW Component ═══ */}
      {eras.length > 0 && risingBeat && (
        <EraFlow
          eras={eras}
          connections={connections}
          sectionDef={sectionDefs.find((s) => s.type === 'rising')}
          variant="dark"
          fallbackImage={data.image ?? '/images/generated/parchment.png'}
        />
      )}

      {/* ═══ IV. TAKEAWAY + QUIZ ═══ */}
      {takeawayBeat && (
        <EraTakeaway
          beat={takeawayBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'takeaway')}
          variant="dark"
        />
      )}
    </article>
  );
};

export default EraTimelineTemplate;
