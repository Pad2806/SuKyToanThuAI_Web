import React from 'react';

export const IllustrationFirstBlock = ({ block }) => (
  <figure className="illustration-first block-entrance" data-block-type="illustration-first">
    <img alt={block.alt ?? block.caption ?? ''} src={block.image} />
    {block.caption && <figcaption>{block.caption}</figcaption>}
    {block.body && <p>{block.body}</p>}
  </figure>
);

export default IllustrationFirstBlock;
