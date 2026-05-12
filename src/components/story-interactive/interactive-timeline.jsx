import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const moodColors = {
  tense: '#c9a84c',
  rising: '#d4a843',
  preparation: '#4a8c5c',
  tension: '#b85c2f',
  climax: '#d4443e',
  victory: '#c9a84c',
};

export const InteractiveTimeline = ({ milestones }) => {
  const [activeId, setActiveId] = useState(null);
  const [scrollActiveIndex, setScrollActiveIndex] = useState(-1);
  const trackRef = useRef(null);
  const lineRef = useRef(null);
  const fillRef = useRef(null);

  /* ── Scroll-triggered animations ── */
  useEffect(() => {
    if (!trackRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setScrollActiveIndex(milestones.length - 1);
      return;
    }

    const ctx = gsap.context(() => {
      /* Line fill animation — scrub with scroll */
      if (fillRef.current) {
        gsap.fromTo(fillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: trackRef.current,
              start: 'top 75%',
              end: 'bottom 50%',
              scrub: 0.8,
            },
          },
        );
      }

      /* Each milestone: entrance + scroll-highlight */
      gsap.utils.toArray('.tl-milestone').forEach((node, i) => {
        /* Entrance animation */
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });

        entranceTl
          .from(node.querySelector('.tl-milestone__marker'), {
            scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)',
          })
          .from(node.querySelector('.tl-milestone__content'), {
            x: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
          }, '-=0.35')
          .from(node.querySelector('.tl-milestone__glow'), {
            opacity: 0, scale: 0.5, duration: 0.4,
          }, '-=0.5');

        /* Scroll-highlight: milestone becomes "active" when in center viewport */
        ScrollTrigger.create({
          trigger: node,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setScrollActiveIndex(i),
          onEnterBack: () => setScrollActiveIndex(i),
        });
      });
    }, trackRef);

    return () => ctx.revert();
  }, [milestones]);

  const handleToggle = useCallback((id) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="interactive-tl" ref={trackRef}>
      <h3 className="interactive-tl__title">Diễn biến theo thời gian</h3>
      <div className="interactive-tl__track">
        {/* Background line (dim) */}
        <div className="interactive-tl__line" aria-hidden="true" ref={lineRef} />
        {/* Fill line (gold, scrubs with scroll) */}
        <div className="interactive-tl__fill" aria-hidden="true" ref={fillRef} />

        {milestones.map((m, i) => {
          const isOpen = activeId === m.id;
          const isScrollActive = i === scrollActiveIndex;
          const isPassed = i < scrollActiveIndex;
          const isLast = i === milestones.length - 1;
          const accentColor = moodColors[m.mood] ?? 'var(--gold)';

          return (
            <div
              className={[
                'tl-milestone',
                isOpen && 'tl-milestone--open',
                isLast && 'tl-milestone--last',
                isScrollActive && 'tl-milestone--scroll-active',
                isPassed && 'tl-milestone--passed',
              ].filter(Boolean).join(' ')}
              key={m.id}
            >
              {/* Glow behind marker when scroll-active */}
              <div
                className="tl-milestone__glow"
                aria-hidden="true"
                style={{ '--accent': accentColor }}
              />

              <button
                className={`tl-milestone__marker ${isOpen ? 'is-active' : ''}`}
                onClick={() => handleToggle(m.id)}
                type="button"
                aria-expanded={isOpen}
                aria-label={`Mốc ${i + 1}: ${m.title}`}
                style={{ '--accent': accentColor }}
              >
                <span className="tl-milestone__num">{String(i + 1).padStart(2, '0')}</span>
              </button>

              <div className="tl-milestone__content">
                <span className="tl-milestone__time">{m.year} · {m.month}</span>
                <h4 className="tl-milestone__title">{m.title}</h4>

                <div
                  className={`tl-milestone__detail ${isOpen ? 'tl-milestone__detail--open' : ''}`}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <p>{m.description}</p>
                </div>

                {!isOpen && (
                  <button
                    className="tl-milestone__expand"
                    onClick={() => handleToggle(m.id)}
                    type="button"
                    aria-label="Xem chi tiết"
                  >
                    Xem chi tiết
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
