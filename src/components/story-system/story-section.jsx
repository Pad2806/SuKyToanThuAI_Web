import React from 'react';

/**
 * Reusable section wrapper for the storytelling flow.
 * Renders the consistent eyebrow + title + divider header pattern.
 *
 * @param {Object} props
 * @param {'light'|'dark'|'climax'} props.variant - Visual variant
 * @param {Object} props.def - Section definition { id, numeral, label }
 * @param {string} [props.title] - Override title from beat data
 * @param {boolean} [props.wide] - Use wider shell for climax etc.
 * @param {React.ReactNode} props.children
 */
export const StorySection = ({ variant = 'dark', def, title, wide, children }) => {
  const safeDef = def || { id: 'evt-unknown', numeral: '', label: '' };
  return (
    <section
      className={`evt-section evt-section--${variant}`}
      id={safeDef.id}
    >
      <div className={`evt-section__shell${wide ? ' evt-section__shell--wide' : ''}`}>
        <div className="evt-section__header">
          <div className="evt-section__eyebrow">
            <span className="evt-section__numeral">{safeDef.numeral}</span>
            <span className="evt-section__eyebrow-text">{safeDef.label}</span>
          </div>
          <h2 className="evt-section__title">{title ?? safeDef.label}</h2>
          <div className="evt-section__divider" aria-hidden="true" />
        </div>
        <div className="evt-section__body">
          {children}
        </div>
      </div>
    </section>
  );
};

export default StorySection;

