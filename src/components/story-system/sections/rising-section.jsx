import React from 'react';
import { StorySection } from '../story-section.jsx';
import { BeatBlocks } from '../blocks/story-blocks.jsx';
import { InteractiveTimeline } from '../../story-interactive/interactive-timeline.jsx';

/**
 * Section III: Rising Action — Narrative + Interactive Timeline.
 */
export const RisingSection = ({ beat, event, sectionDef, variant }) => (
  <StorySection variant={variant} def={sectionDef} title={beat?.title ?? 'Diễn Biến'}>
    <BeatBlocks blocks={beat?.blocks} />

    {event.timeline?.length > 0 && (
      <InteractiveTimeline milestones={event.timeline} />
    )}
  </StorySection>
);

export default RisingSection;
