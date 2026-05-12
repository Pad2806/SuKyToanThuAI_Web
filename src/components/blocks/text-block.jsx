import React from 'react';

export const TextBlock = ({ block }) => (
  <div className="text-block block-entrance">
    {block.title && <h3>{block.title}</h3>}
    <p>{block.body}</p>
  </div>
);

export default TextBlock;
