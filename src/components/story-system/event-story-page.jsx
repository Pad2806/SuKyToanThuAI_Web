import React, { useMemo, useRef } from 'react';
import { ReadingProgressBar } from '../story/reading-progress-bar.jsx';
import { CharacterGrid } from '../story-interactive/character-card.jsx';
import { StoryProgressIndicator } from '../story-interactive/story-progress-indicator.jsx';
import { useSectionAnimations } from './hooks/use-story-animations.js';
import { useStoryBeats, useStorySections } from './hooks/use-story-sections.js';
import { useStoryTheme } from './hooks/use-story-theme.js';
import { StoryTOC } from './navigation/story-toc.jsx';
import { AftermathSection } from './sections/aftermath-section.jsx';
import { ClimaxSection } from './sections/climax-section.jsx';
import { EventHero } from './sections/event-hero.jsx';
import { RisingSection } from './sections/rising-section.jsx';
import { SetupSection } from './sections/setup-section.jsx';

const STORY_SECTION_DEFS = [
  { id: 'evt-setup', type: 'setup', label: 'Bối cảnh', numeral: 'I' },
  { id: 'evt-characters', type: 'characters', label: 'Nhân vật chính', numeral: 'II' },
  { id: 'evt-rising', type: 'rising', label: 'Diễn biến', numeral: 'III' },
  { id: 'evt-climax', type: 'climax', label: 'Cao trào', numeral: 'IV' },
  { id: 'evt-tactical-map', type: 'tactical-map', label: 'Bản đồ chiến thuật', numeral: 'V' },
  { id: 'evt-outcomes', type: 'outcomes', label: 'Hệ quả và bài học', numeral: 'VI' },
];

const sectionByType = (type) => STORY_SECTION_DEFS.find((section) => section.type === type);

export const EventStoryPage = ({
  data,
  relatedEvents = [],
  previewMode = false,
  scrollContainerRef = null,
}) => {
  const containerRef = useRef(null);
  const beats = data.story?.beats ?? [];

  const {
    setupBeat,
    risingBeat,
    climaxBeat,
    fallingBeat,
    takeawayBeat,
  } = useStoryBeats(beats);

  const { themeId, getSectionVariant } = useStoryTheme(data.theme);

  const sectionDefs = useMemo(() => (
    STORY_SECTION_DEFS.filter((section) => {
      if (section.type === 'setup') return Boolean(setupBeat);
      if (section.type === 'characters') return (data.characters ?? []).length > 0;
      if (section.type === 'rising') return Boolean(risingBeat || data.timeline?.length);
      if (section.type === 'climax') return Boolean(climaxBeat || data.climaxScene);
      if (section.type === 'tactical-map') {
        return Boolean(data.climaxScene?.backgroundImage && data.climaxScene?.hotspots?.length);
      }
      if (section.type === 'outcomes') {
        return Boolean(fallingBeat || takeawayBeat || data.aftermath || data.takeaway);
      }
      return false;
    })
  ), [climaxBeat, data, fallingBeat, risingBeat, setupBeat, takeawayBeat]);

  const { activeIndex, heroScrolled, handleNavClick } = useStorySections(previewMode ? [] : sectionDefs);
  useSectionAnimations(previewMode ? { current: null } : containerRef);

  return (
    <article
      className="evt-story evt-story--fullscreen"
      ref={containerRef}
      data-story-theme={themeId}
      data-event-type={data.type}
      data-preview-mode={previewMode || undefined}
    >
      {!previewMode && <ReadingProgressBar />}

      <EventHero event={data} heroScrolled={heroScrolled} previewMode={previewMode} />

      {!previewMode && <StoryProgressIndicator sections={sectionDefs} />}

      {!previewMode && (
        <StoryTOC
          sections={sectionDefs}
          activeIndex={activeIndex}
          onNavClick={handleNavClick}
        />
      )}

      {setupBeat && (
        <SetupSection
          beat={setupBeat}
          event={data}
          sectionDef={sectionByType('setup')}
          variant={getSectionVariant(1)}
        />
      )}

      {data.characters?.length > 0 && (
        <section className="evt-section evt-section--characters" id="evt-characters">
          <div className="evt-characters-heading">
            <div className="evt-section__header">
              <div className="evt-section__eyebrow">
                <span className="evt-section__numeral">II</span>
                <span className="evt-section__eyebrow-text">Nhân vật</span>
              </div>
              <h2 className="evt-section__title">Nhân vật chính</h2>
              <div className="evt-section__divider" aria-hidden="true" />
            </div>
          </div>
          <div className="evt-section__body evt-characters-body">
            <CharacterGrid
              characters={data.characters}
              fallbackImage={data.image || data.fallbackImage}
              showTitle={false}
            />
          </div>
        </section>
      )}

      {(risingBeat || data.timeline?.length > 0) && (
        <RisingSection
          beat={risingBeat}
          event={data}
          sectionDef={sectionByType('rising')}
          variant={getSectionVariant(2)}
          scrollContainerRef={scrollContainerRef}
        />
      )}

      {(climaxBeat || data.climaxScene) && (
        <ClimaxSection
          beat={climaxBeat}
          event={data}
          sectionDef={sectionByType('climax')}
          mapSectionDef={sectionByType('tactical-map')}
          variant={getSectionVariant(3)}
        />
      )}

      {(fallingBeat || takeawayBeat || data.aftermath || data.takeaway) && (
        <AftermathSection
          beat={fallingBeat}
          takeawayBeat={takeawayBeat}
          event={data}
          sectionDef={sectionByType('outcomes')}
          variant={getSectionVariant(4)}
          relatedEvents={relatedEvents}
        />
      )}
    </article>
  );
};

export default EventStoryPage;
