import React, { useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';

const grades = [
  { label: 'Lớp 5', to: '/khoi-lop/5' },
  { label: 'Lớp 6', to: '/khoi-lop/6' },
  { label: 'Lớp 7', to: '/khoi-lop/7' },
  { label: 'Lớp 8', to: '/khoi-lop/8' },
  { label: 'Lớp 9', to: '/khoi-lop/9' },
  { label: 'Lớp 10', to: '/khoi-lop/10' },
  { label: 'Lớp 11', to: '/khoi-lop/11' },
  { label: 'Lớp 12', to: '/khoi-lop/12' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const scrollToTop = () => {
      // Reset Lenis
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true, force: true });
      }
      // Reset native scroll (multiple methods for reliability)
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (location.pathname === '/') {
      scrollToTop();
    } else {
      navigate('/');
      scrollToTop();
      // Also reset after React re-render
      setTimeout(scrollToTop, 50);
      setTimeout(scrollToTop, 150);
    }
  }, [navigate, location.pathname]);

  const scrollToSearch = (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('footer-search');
    if (searchInput) {
      // Cuộn mượt mà đến ô tìm kiếm và tự động focus
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => searchInput.focus(), 500);
    } else {
      // Nếu đang ở trang khác, chuyển hướng về trang chủ
      window.location.href = '/#footer-search';
    }
  };

  return (
    <header className="site-header">
      <nav aria-label="Điều hướng chính" className="site-nav">
        <a className="site-nav__brand" href="/" onClick={handleLogoClick}>
          <span className="site-nav__logo-text">
            <span className="site-nav__logo-main">Sử Ký</span>
            <span className="site-nav__logo-accent">AI</span>
          </span>
        </a>
        <div className="site-nav__links">
          {grades.map((item) => (
            <Link className="site-nav__link" key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
          <a href="#search" className="site-nav__link site-nav__link--search" onClick={scrollToSearch}>
            Tìm kiếm
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6, opacity: 0.8 }}>
               <circle cx="11" cy="11" r="8"></circle>
               <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
