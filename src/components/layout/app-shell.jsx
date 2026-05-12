import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Footer } from './footer.jsx';
import { Navbar } from './navbar.jsx';
import { useSmoothScroll } from '../../hooks/use-smooth-scroll.jsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const reset = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true, force: true });
      }
    };
    reset();
    // Also after next frame in case React defers rendering
    requestAnimationFrame(reset);
  }, [pathname]);

  return null;
};

export const AppShell = ({ children }) => {
  useSmoothScroll();

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
};

export default AppShell;
