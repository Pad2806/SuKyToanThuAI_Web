import React from 'react';
import { StorySection } from '../story-section.jsx';
import { BeatBlocks, QuickFacts } from '../blocks/story-blocks.jsx';
import { CharacterGrid } from '../../story-interactive/character-card.jsx';

/**
 * Section II: Setup — Context & Characters.
 * Renders setup beat blocks (text + images + quotes), quick facts, and character cards.
 */
export const SetupSection = ({ beat, event, sectionDef, variant }) => {
  const quickFacts = beat?.blocks?.find((b) => b.type === 'quick-facts');

  return (
    <StorySection variant={variant} def={sectionDef} title={beat?.title ?? 'Bối Cảnh'}>
      <BeatBlocks blocks={beat?.blocks} skipTypes={['quick-facts']} />

      {quickFacts && (
        <QuickFacts title={quickFacts.title} items={quickFacts.items} />
      )}

      {event.characters?.length > 0 && (
        <CharacterGrid characters={event.characters} />
      )}
    </StorySection>
  );
};

export default SetupSection;
