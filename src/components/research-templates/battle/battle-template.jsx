import React, { useRef, useMemo } from 'react';

/* ── Hooks (battle-local copies) ── */
import {
  buildSectionDefs,
  useStorySections,
  useStoryBeats,
} from './hooks/use-battle-sections.js';
import { useSectionAnimations } from './hooks/use-battle-animations.js';
import { useStoryTheme } from './hooks/use-battle-theme.js';

/* ── Shared UI (battle-local copies) ── */
import { ReadingProgressBar } from './shared/battle-progress-bar.jsx';
import { StoryProgressIndicator } from './shared/battle-progress-indicator.jsx';

/* ── Battle-specific sections ── */
import { BattleHero } from './sections/battle-hero.jsx';
import { BattleTOC } from './sections/battle-toc.jsx';
import { BattleSetup } from './sections/battle-setup.jsx';
import { BattleRising } from './sections/battle-rising.jsx';
import { BattleClimax } from './sections/battle-climax.jsx';
import { BattleAftermath } from './sections/battle-aftermath.jsx';
import { BattleTakeaway } from './sections/battle-takeaway.jsx';

/**
 * BattleTemplate — Full page layout for battle/war events.
 *
 * FULLY ISOLATED from story-system — all dependencies are local copies.
 * Modifying any component here will NOT affect the main event pages.
 */
export const BattleTemplate = ({ data, relatedEvents = [] }) => {
  const containerRef = useRef(null);

  const beats = data.story?.beats ?? [];
  const sectionDefs = useMemo(() => buildSectionDefs(beats), [beats]);

  const {
    hookBeat,
    setupBeat,
    risingBeat,
    climaxBeat,
    fallingBeat,
    takeawayBeat,
  } = useStoryBeats(beats);

  const { themeId, getSectionVariant } = useStoryTheme(data.theme);
  const { activeIndex, heroScrolled, handleNavClick } = useStorySections(sectionDefs);
  useSectionAnimations(containerRef);

  return (
    <article
      className="evt-story"
      ref={containerRef}
      data-story-theme={themeId}
      data-event-type={data.type}
      data-research-template="battle"
    >
      <ReadingProgressBar />
      <StoryProgressIndicator sections={sectionDefs} />

      {/* ═══ I. HOOK — Full-screen Cinematic Hero ═══ */}
      <BattleHero event={data} heroScrolled={heroScrolled} />

      {/* ═══ Sticky TOC ═══ */}
      <BattleTOC
        sections={sectionDefs}
        activeIndex={activeIndex}
        onNavClick={handleNavClick}
      />

      {/* ═══ II. SETUP — Context & Characters ═══ */}
      {setupBeat && (
        <BattleSetup
          beat={setupBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'setup')}
          variant={getSectionVariant(1)}
        />
      )}

      {/* ═══ III. RISING ACTION — Timeline ═══ */}
      {risingBeat && (
        <BattleRising
          beat={risingBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'rising')}
          variant={getSectionVariant(2)}
        />
      )}

      {/* ═══ IV. CLIMAX — WOW Moment ═══ */}
      {climaxBeat && (
        <BattleClimax
          beat={climaxBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'climax')}
          variant={getSectionVariant(3)}
        />
      )}

      {/* ═══ V. AFTERMATH ═══ */}
      {fallingBeat && (
        <BattleAftermath
          beat={fallingBeat}
          event={data}
          sectionDef={sectionDefs.find((s) => s.type === 'falling')}
          variant={getSectionVariant(4)}
        />
      )}

      {/* ═══ VI. TAKEAWAY ═══ */}
      {takeawayBeat && (
        <BattleTakeaway
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

export default BattleTemplate;
