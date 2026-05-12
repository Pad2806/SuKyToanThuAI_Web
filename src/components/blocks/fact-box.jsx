import React from 'react';

export const FactBox = ({ block }) => (
  <aside className="fact-box block-entrance">
    {block.title && <h3>{block.title}</h3>}
    <p>{block.body}</p>
  </aside>
);

export default FactBox;
