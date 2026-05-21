import React from 'react';

/**
 * EraOverview — Stats grid for era-timeline (setup section).
 */
export const EraOverview = ({ beat, event, sectionDef, variant = 'dark' }) => {
  const overview = event.overview || {};
  const blocks = beat?.blocks || [];
  const quickFacts = blocks.find((b) => b.type === 'quick-facts');
  const textBlocks = blocks.filter((b) => b.type === 'text');

  return (
    <section className={`evt-section evt-section--${variant}`} id={sectionDef.id}>
      <div className="evt-section__shell">
        <div className="evt-section__header">
          <div className="evt-section__eyebrow">
            <span className="evt-section__numeral">{sectionDef.numeral}</span>
            <span className="evt-section__eyebrow-text">{sectionDef.label}</span>
          </div>
          <h2 className="evt-section__title">Bối Cảnh Thời Đại</h2>
          <div className="evt-section__divider" aria-hidden="true" />
        </div>
        <div className="evt-section__body">
          {textBlocks.map((block, i) => (
            <p className="evt-block-text" key={i}>{block.body}</p>
          ))}

          {/* Overview stats */}
          <div className="era-overview-stats">
            <div className="era-stat">
              <span className="era-stat__value">{overview.totalEvents ?? 0}</span>
              <span className="era-stat__label">Sự kiện</span>
            </div>
            <div className="era-stat">
              <span className="era-stat__value">{overview.totalYears ?? 0}</span>
              <span className="era-stat__label">Năm lịch sử</span>
            </div>
            <div className="era-stat era-stat--wide">
              <span className="era-stat__highlight">{overview.highlight || ''}</span>
            </div>
          </div>

          {/* Quick facts */}
          {quickFacts && (
            <div className="evt-quick-facts">
              <h3 className="evt-quick-facts__title">{quickFacts.title || 'Tổng quan'}</h3>
              <dl className="evt-quick-facts__grid">
                {(quickFacts.items || []).map((item, i) => (
                  <div key={i}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EraOverview;
