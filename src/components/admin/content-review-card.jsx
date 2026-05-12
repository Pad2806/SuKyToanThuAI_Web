import React from 'react';

export const ContentReviewCard = ({ beat, onAction }) => (
  <article className="content-review-card">
    <h3>{beat.title}</h3>
    {(beat.blocks ?? []).map((block, index) => (
      <div className="review-block" key={`${block.type}-${index}`}>
        <p>{block.type}</p>
        <button onClick={() => onAction('edit', index)} type="button">Chỉnh sửa</button>
        <button onClick={() => onAction('approve', index)} type="button">Duyệt</button>
        <button onClick={() => onAction('reject', index)} type="button">Từ chối</button>
      </div>
    ))}
  </article>
);

export default ContentReviewCard;
