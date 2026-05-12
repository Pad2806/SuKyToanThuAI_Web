import React from 'react';
import { FactBox } from '../components/blocks/fact-box.jsx';
import { GlossaryBlock } from '../components/blocks/glossary-block.jsx';
import { IllustrationFirstBlock } from '../components/blocks/illustration-first-block.jsx';
import { ImageBlock } from '../components/blocks/image-block.jsx';
import { QuickFactsBlock } from '../components/blocks/quick-facts-block.jsx';
import { QuoteBlock } from '../components/blocks/quote-block.jsx';
import { TextBlock } from '../components/blocks/text-block.jsx';
import { EventMetaPanel } from '../components/meta/event-meta-panel.jsx';
import { FigureCard } from '../components/meta/figure-card.jsx';

export const blockRenderers = {
  'event-meta': (block, event) => <EventMetaPanel event={{ ...event, ...block.event }} />,
  'fact-box': (block) => <FactBox block={block} />,
  figure: (block) => <FigureCard block={block} />,
  glossary: (block) => <GlossaryBlock block={block} />,
  image: (block) => <ImageBlock block={block} />,
  'illustration-first': (block) => <IllustrationFirstBlock block={block} />,
  'quick-facts': (block) => <QuickFactsBlock block={block} />,
  quote: (block) => <QuoteBlock block={block} />,
  text: (block) => <TextBlock block={block} />,
};

export const useBlockRenderer = (event) => (block, index) => {
  const render = blockRenderers[block.type] ?? blockRenderers.text;

  return (
    <React.Fragment key={`${block.type}-${index}`}>
      {render(block, event)}
    </React.Fragment>
  );
};

export default useBlockRenderer;
