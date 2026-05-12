import React from 'react';

export const QuickFactsBlock = ({ block }) => (
  <aside className="quick-facts block-entrance">
    <h3>{block.title ?? 'Sự kiện nhanh'}</h3>
    <dl>
      {(block.items ?? []).map((item) => (
        <div className="quick-facts__item" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  </aside>
);

export default QuickFactsBlock;
