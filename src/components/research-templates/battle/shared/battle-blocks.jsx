import React from 'react';

const hasContent = (block) => {
  if (!block || typeof block !== 'object') return false;
  if (block.type === 'text') return Boolean(block.body);
  if (block.type === 'quote') return Boolean(block.quote);
  if (block.type === 'image') return Boolean(block.image || block.caption);
  return true;
};

/**
 * Battle template - Block renderers.
 * Independent copy from story-system for full isolation.
 */
export const BeatBlocks = ({ blocks = [], skipTypes = [] }) => (
  <>
    {blocks
      .filter((block) => !skipTypes.includes(block.type))
      .filter(hasContent)
      .map((block, i) => {
        switch (block.type) {
          case 'text':
            return <p key={i} className="evt-text-block">{block.body}</p>;

          case 'image':
            return (
              <figure key={i} className="evt-image-block">
                {block.image && (
                  <img
                    src={block.image}
                    alt={block.caption || ''}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                {block.caption && (
                  <figcaption className="evt-image-block__caption">{block.caption}</figcaption>
                )}
              </figure>
            );

          case 'quote':
            return (
              <blockquote key={i} className="evt-quote-block">
                <p>"{block.quote}"</p>
                {block.source && <cite>- {block.source}</cite>}
              </blockquote>
            );

          case 'quick-facts':
            return null;

          default:
            return null;
        }
      })}
  </>
);

/**
 * Quick Facts panel.
 */
export const QuickFacts = ({ title, items }) => (
  <div className="evt-quick-facts">
    <h4 className="evt-quick-facts__title">{title}</h4>
    <dl className="evt-quick-facts__grid">
      {items.map((item, i) => (
        <div key={i}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

/**
 * Standalone quote block.
 */
export const StoryQuote = ({ quote, source }) => {
  if (!quote) return null;
  return (
    <blockquote className="evt-climax-quote">
      <p>"{quote}"</p>
      {source && <cite>- {source}</cite>}
    </blockquote>
  );
};
