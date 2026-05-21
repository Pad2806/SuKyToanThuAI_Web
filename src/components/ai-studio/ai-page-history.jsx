import React from 'react';
import { Link } from 'react-router';

export const AiPageHistory = ({ title, pages = [], emptyText }) => (
  <div className="ai-page-history">
    <h3 className="ai-page-history__title">{title}</h3>
    {pages.length === 0 ? (
      <p className="ai-page-history__empty">{emptyText}</p>
    ) : (
      <div className="ai-page-history__list">
        {pages.map((page) => (
          <Link key={page.id} className="ai-page-history__item" to={`/ai/trang/${page.id}`}>
            <img alt="" src={page.thumbnail || '/images/generated/parchment.png'} />
            <span>
              <strong>{page.title}</strong>
              <small>{page.status} · {new Date(page.createdAt).toLocaleDateString('vi-VN')}</small>
            </span>
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default AiPageHistory;
