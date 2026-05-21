import React from 'react';

/**
 * Battle template — Reusable section wrapper.
 * Independent copy from story-system for full isolation.
 */
export const BattleSection = ({ variant = 'dark', def, title, wide, children }) => (
  <section
    className={`evt-section evt-section--${variant}`}
    id={def.id}
  >
    <div className={`evt-section__shell${wide ? ' evt-section__shell--wide' : ''}`}>
      <div className="evt-section__header">
        <div className="evt-section__eyebrow">
          <span className="evt-section__numeral">{def.numeral}</span>
          <span className="evt-section__eyebrow-text">{def.label}</span>
        </div>
        <h2 className="evt-section__title">{title ?? def.label}</h2>
        <div className="evt-section__divider" aria-hidden="true" />
      </div>
      <div className="evt-section__body">
        {children}
      </div>
    </div>
  </section>
);

export default BattleSection;
