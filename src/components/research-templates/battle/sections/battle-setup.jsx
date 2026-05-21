import React from 'react';
import { BattleSection } from '../shared/battle-section.jsx';
import { BeatBlocks, QuickFacts } from '../shared/battle-blocks.jsx';
import { CharacterGrid } from '../interactive/character-card.jsx';

/**
 * BattleSetup — Section II: Context & Characters.
 */
export const BattleSetup = ({ beat, event, sectionDef, variant }) => {
  const quickFacts = beat?.blocks?.find((b) => b.type === 'quick-facts');

  return (
    <BattleSection variant={variant} def={sectionDef} title={beat?.title ?? 'Bối Cảnh'}>
      <BeatBlocks blocks={beat?.blocks} skipTypes={['quick-facts']} />

      {quickFacts && (
        <QuickFacts title={quickFacts.title} items={quickFacts.items} />
      )}

      {event.characters?.length > 0 && (
        <CharacterGrid characters={event.characters} />
      )}
    </BattleSection>
  );
};

export default BattleSetup;
