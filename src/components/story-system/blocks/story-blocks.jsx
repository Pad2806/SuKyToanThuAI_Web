import React from 'react';

/**
 * Universal block renderer — renders ALL block types from story beats.
 * Supports: text, image, quote, quick-facts.
 * This is the core renderer — no block type should be silently dropped.
 */
export const BeatBlocks = ({ blocks = [], skipTypes = [] }) => (
  <>
    {blocks
      .filter((b) => !skipTypes.includes(b.type))
      .map((b, i) => {
        switch (b.type) {
          case 'text':
            return <p key={i} className="evt-text-block">{textFromBlock(b)}</p>;

          case 'image':
            if (!(b.image || '').trim()) return null;
            return (
              <figure key={i} className="evt-image-block">
                <img
                  src={b.image}
                  alt={b.caption || ''}
                  loading="lazy"
                  decoding="async"
                />
                {b.caption && (
                  <figcaption className="evt-image-block__caption">{b.caption}</figcaption>
                )}
              </figure>
            );

          case 'quote':
            return (
              <blockquote key={i} className="evt-quote-block">
                <p>"{b.quote}"</p>
                {b.source && <cite>— {b.source}</cite>}
              </blockquote>
            );

          case 'quick-facts':
            return null; // Handled separately by sections that need it

          case 'list':
          case 'bullet-list':
            return (
              <ul key={i} className="evt-list-block">
                {(b.items ?? []).map((item, itemIndex) => (
                  <li key={itemIndex}>{typeof item === 'string' ? item : item.value || item.label}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
  </>
);

const textFromBlock = (block) => (
  block.body
  || block.text
  || block.description
  || ''
);

/**
 * @deprecated Use BeatBlocks instead — kept for backward compat.
 */
export const TextBlocks = ({ blocks = [] }) => (
  <BeatBlocks blocks={blocks} />
);

/**
 * Quick Facts panel — data-driven list of label/value pairs.
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
 * Standalone quote block for explicit use.
 */
export const StoryQuote = ({ quote, source }) => (
  <blockquote className="evt-climax-quote">
    <p>"{quote}"</p>
    {source && <cite>— {source}</cite>}
  </blockquote>
);

export default { BeatBlocks, TextBlocks, QuickFacts, StoryQuote };
