import React from 'react';

export const GlossaryBlock = ({ block }) => (
  <section className="glossary-block block-entrance" aria-label="Chú giải">
    <h3>{block.title ?? 'Chú giải'}</h3>
    <dl>
      {(block.terms ?? []).map((item) => (
        <div className="glossary-block__item" key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.definition}</dd>
        </div>
      ))}
    </dl>
  </section>
);

export default GlossaryBlock;
