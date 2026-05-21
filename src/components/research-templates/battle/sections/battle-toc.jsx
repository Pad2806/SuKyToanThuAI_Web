import React from 'react';

/**
 * BattleTOC — Sticky Table of Contents for battle template.
 */
export const BattleTOC = ({ sections, activeIndex, onNavClick }) => (
  <nav className="evt-toc" aria-label="Mục lục câu chuyện">
    <div className="evt-toc__track">
      {sections.map((s, i) => (
        <button
          className={`evt-toc__item ${i === activeIndex ? 'is-active' : ''}`}
          key={s.id}
          onClick={() => onNavClick(s.id)}
          type="button"
        >
          <span className="evt-toc__numeral">{s.numeral}</span>
          <span className="evt-toc__label">{s.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default BattleTOC;
