import React from 'react';

export const QuoteBlock = ({ block }) => (
  <blockquote className="quote-block block-entrance">
    <p>{block.quote}</p>
    {block.source && <cite>{block.source}</cite>}
  </blockquote>
);

export default QuoteBlock;
