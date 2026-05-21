import React from 'react';
import { StorySection } from '../story-section.jsx';
import { BeatBlocks } from '../blocks/story-blocks.jsx';
import { ClimaxScene } from '../../story-interactive/climax-scene.jsx';

/**
 * Section IV: Climax — The WOW moment.
 * Renders climax blocks (text + images + quotes) and interactive battle scene.
 */
export const ClimaxSection = ({ beat, event, sectionDef, variant }) => (
  <StorySection variant={variant} def={sectionDef} title={beat?.title ?? 'Cao Trào'} wide>
    <BeatBlocks blocks={beat?.blocks} />

    {event.climaxScene && (
      <ClimaxScene scene={{ ...event.climaxScene, templateType: event.story?.templateType }} />
    )}
  </StorySection>
);

export default ClimaxSection;
