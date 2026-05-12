import React from 'react';

export const ImageBlock = ({ block }) => (
  <figure className="image-block block-entrance">
    <img alt={block.alt ?? block.caption ?? ''} loading="lazy" src={block.image ?? block.fallbackImage} />
    {block.caption && <figcaption>{block.caption}</figcaption>}
  </figure>
);

export default ImageBlock;
