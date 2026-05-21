import React from 'react';

export const HistoricalTakeaway = ({ takeaway }) => {
  const sections = [
    { numeral: 'I', title: 'Điều đã xảy ra', body: takeaway.happened },
    { numeral: 'II', title: 'Vì sao quan trọng', body: takeaway.whyItMatters },
    { numeral: 'III', title: 'Bài học rút ra', body: takeaway.lesson },
  ];

  return (
    <div className="takeaway-panel">
      <h3 className="takeaway-panel__heading">Tóm tắt ý nghĩa lịch sử</h3>
      <div className="takeaway-panel__grid">
        {sections.map((s, i) => (
          <div className="takeaway-card" key={i}>
            <span className="takeaway-card__numeral" aria-hidden="true">{s.numeral}</span>
            <h4 className="takeaway-card__title">{s.title}</h4>
            <p className="takeaway-card__body">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalTakeaway;
