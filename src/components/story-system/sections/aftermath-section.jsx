import React from 'react';
import { StorySection } from '../story-section.jsx';
import { BeatBlocks } from '../blocks/story-blocks.jsx';
import { AftermathSummary } from '../../story-interactive/aftermath-summary.jsx';

/**
 * Section V: Aftermath — Results and consequences.
 */
export const AftermathSection = ({ beat, event, sectionDef, variant }) => (
  <StorySection variant={variant} def={sectionDef} title={beat?.title ?? 'Hệ Quả'}>
    <BeatBlocks blocks={beat?.blocks} />

    {event.aftermath && (
      <AftermathSummary aftermath={event.aftermath} />
    )}
  </StorySection>
);

export default AftermathSection;
