import React from 'react';

export const FigureCard = ({ block }) => (
  <article className="figure-card block-entrance">
    {block.portrait && <img alt={block.name} src={block.portrait} />}
    <div>
      <h3>{block.name}</h3>
      <p className="figure-card__role">{block.role}</p>
      <p>{block.bio}</p>
    </div>
  </article>
);

export default FigureCard;
