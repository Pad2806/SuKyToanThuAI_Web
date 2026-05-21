import React from 'react';
import { BattleSection } from '../shared/battle-section.jsx';
import { BeatBlocks } from '../shared/battle-blocks.jsx';
import { InteractiveTimeline } from '../interactive/interactive-timeline.jsx';

/**
 * BattleRising — Section III: Rising Action + Timeline.
 */
export const BattleRising = ({ beat, event, sectionDef, variant }) => (
  <BattleSection variant={variant} def={sectionDef} title={beat?.title ?? 'Diễn Biến'}>
    <BeatBlocks blocks={beat?.blocks} />

    {event.timeline?.length > 0 && (
      <InteractiveTimeline milestones={event.timeline} />
    )}
  </BattleSection>
);

export default BattleRising;
