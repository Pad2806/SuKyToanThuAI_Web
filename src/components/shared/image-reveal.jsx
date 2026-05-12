import React from 'react';

export const ImageReveal = ({ alt, src }) => (
  <figure className="image-reveal">
    <img alt={alt} loading="lazy" src={src} />
  </figure>
);

export default ImageReveal;
