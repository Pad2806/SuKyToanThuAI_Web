import React from 'react';
import { Link } from 'react-router';

const footerLinks = [
  { label: 'Dòng thời gian', to: '/#dong-chay' },
  { label: 'Tìm kiếm', to: '/#footer-search' },
];

const gradeLinks = [
  { label: 'Tiểu học', to: '/khoi-lop/th' },
  { label: 'THCS', to: '/khoi-lop/thcs' },
  { label: 'THPT', to: '/khoi-lop/thpt' },
];

export const Footer = () => (
  <footer className="site-footer section-dark">
    <div className="site-footer__inner">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo">Sử Ký AI</Link>
          <p>Nền tảng kể chuyện lịch sử Việt Nam bằng cấu trúc câu chuyện sáu hồi — từ khoảnh khắc mở màn đến bài học còn lại.</p>
        </div>
        <nav className="site-footer__nav">
          <h4>Khám phá</h4>
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
        <nav className="site-footer__nav">
          <h4>Khối lớp</h4>
          {gradeLinks.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>
      </div>
      <div className="site-footer__bottom">
        <span>© 2026 Sử Ký AI — Đồ án Chuyên đề Ngôn ngữ Lập trình</span>
      </div>
    </div>
  </footer>
);

export default Footer;
