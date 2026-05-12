import React from 'react';
import { Link } from 'react-router';

export const NotFoundPage = () => (
  <section className="not-found-page section-dark">
    <div className="not-found-page__bg" aria-hidden="true">
      <img alt="" src="/images/generated/parchment.png" />
      <div className="not-found-page__vignette" />
    </div>
    <div className="not-found-page__content">
      <span className="not-found-page__code">404</span>
      <h1>Trang này đã rời khỏi dòng sử</h1>
      <p>Đường dẫn không còn tồn tại hoặc chưa được biên soạn trong kho chuyện hiện tại.</p>
      <Link className="btn-hero btn-hero--primary" to="/">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Trở về trang chủ</span>
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
