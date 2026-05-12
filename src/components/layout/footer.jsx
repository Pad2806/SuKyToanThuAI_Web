import React from 'react';
import { Link } from 'react-router';

const footerLinks = [
  { label: 'Dòng thời gian', to: '/#dong-chay' },
  { label: 'Tìm kiếm', to: '/#footer-search' },
];

const gradeLinks = [
  { label: 'Lớp 5', to: '/khoi-lop/5' },
  { label: 'Lớp 6', to: '/khoi-lop/6' },
  { label: 'Lớp 7', to: '/khoi-lop/7' },
  { label: 'Lớp 8', to: '/khoi-lop/8' },
  { label: 'Lớp 9', to: '/khoi-lop/9' },
  { label: 'Lớp 10', to: '/khoi-lop/10' },
  { label: 'Lớp 11', to: '/khoi-lop/11' },
  { label: 'Lớp 12', to: '/khoi-lop/12' },
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
            {gradeLinks.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="site-footer__bottom">
        <span>© 2026 Sử Ký AI — Đồ án Chuyên đề Ngôn ngữ Lập trình</span>
      </div>
    </div>
  </footer>
);

export default Footer;
