import React from 'react';
import { BattleSection } from '../shared/battle-section.jsx';
import { BeatBlocks } from '../shared/battle-blocks.jsx';
import { AftermathSummary } from '../interactive/aftermath-summary.jsx';

/**
 * BattleAftermath — Section V: Results and consequences.
 */
export const BattleAftermath = ({ beat, event, sectionDef, variant }) => (
  <BattleSection variant={variant} def={sectionDef} title={beat?.title ?? 'Hệ Quả'}>
    <BeatBlocks blocks={beat?.blocks} />

    {event.aftermath && (
      <AftermathSummary aftermath={event.aftermath} />
    )}
  </BattleSection>
);

export default BattleAftermath;
