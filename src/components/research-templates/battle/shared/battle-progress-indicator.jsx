import React, { useEffect, useState } from 'react';

/**
 * Battle template — Vertical story progress indicator.
 * Independent copy for full isolation.
 */
export const StoryProgressIndicator = ({ sections }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollPercent(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionEls = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionEls.indexOf(entry.target);
            if (idx >= 0) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="story-progress" aria-label="Tiến trình câu chuyện">
      <div className="story-progress__line" aria-hidden="true">
        <div
          className="story-progress__fill"
          style={{ height: `${scrollPercent * 100}%` }}
        />
      </div>
      <div className="story-progress__dots">
        {sections.map((section, i) => (
          <button
            className={`story-progress__dot ${i === activeIndex ? 'is-active' : ''} ${i < activeIndex ? 'is-passed' : ''}`}
            key={section.id}
            onClick={() => {
              const el = document.getElementById(section.id);
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            type="button"
            aria-label={section.label}
            title={section.label}
          >
            <span className="story-progress__dot-inner" />
          </button>
        ))}
      </div>
      <span className="story-progress__label">{sections[activeIndex]?.label ?? ''}</span>
    </nav>
  );
};

export default StoryProgressIndicator;
