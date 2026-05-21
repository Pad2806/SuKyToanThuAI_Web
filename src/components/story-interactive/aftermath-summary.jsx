import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedStat = ({ stat }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="aftermath__stat-card" ref={ref}>
      <span className={`aftermath__stat-value ${visible ? 'is-visible' : ''}`}>
        {stat.value}
      </span>
      <span className="aftermath__stat-label">{stat.label}</span>
      {stat.sublabel && (
        <span className="aftermath__stat-sub">{stat.sublabel}</span>
      )}
    </div>
  );
};

export const AftermathSummary = ({ aftermath }) => {
  const summaryRef = useRef(null);
  const comparisonRef = useRef(null);
  const stats = aftermath?.stats ?? [];
  const before = aftermath?.before;
  const after = aftermath?.after;
  const consequences = aftermath?.consequences ?? [];
  const lessons = aftermath?.lessons ?? [];
  const hasComparison = before && after;

  useEffect(() => {
    if (!summaryRef.current || !comparisonRef.current || !hasComparison) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const summary = summaryRef.current;

    const ctx = gsap.context(() => {
      /* Stagger stat cards */
      if (stats.length > 0) {
        gsap.from('.aftermath__stat-card', {
          y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.aftermath__stats',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* Before/After columns slide in from sides */
      gsap.from('.aftermath__col--before', {
        x: -60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: comparisonRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
      gsap.from('.aftermath__col--after', {
        x: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: comparisonRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      /* Arrow animates in */
      gsap.from('.aftermath__divider', {
        scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: {
          trigger: comparisonRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, summary);

    return () => ctx.revert();
  }, [hasComparison, stats.length]);

  return (
    <div className="aftermath" ref={summaryRef}>
      <h3 className="aftermath__title">{aftermath?.title ?? 'Hệ quả'}</h3>
      {aftermath?.description && <p className="aftermath__description">{aftermath.description}</p>}
      {aftermath?.historicalMeaning && (
        <p className="aftermath__meaning">{aftermath.historicalMeaning}</p>
      )}

      {aftermath?.image && (
        <figure className="aftermath__image">
          <img src={aftermath.image} alt={aftermath?.title ?? 'Hệ quả'} loading="lazy" />
        </figure>
      )}

      {/* Stats cards */}
      {stats.length > 0 && (
        <div className="aftermath__stats">
          {stats.map((stat, i) => (
            <AnimatedStat key={i} stat={stat} />
          ))}
        </div>
      )}

      {(consequences.length > 0 || lessons.length > 0) && (
        <div className="aftermath__insights">
          {consequences.length > 0 && (
            <section>
              <h4>Hệ quả trực tiếp</h4>
              <ul>{consequences.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </section>
          )}
          {lessons.length > 0 && (
            <section>
              <h4>Bài học</h4>
              <ul>{lessons.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </section>
          )}
        </div>
      )}

      {/* Before / After comparison */}
      {hasComparison && (
        <div className="aftermath__comparison" ref={comparisonRef}>
          <div className="aftermath__col aftermath__col--before">
            <h4 className="aftermath__col-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              {before.title}
            </h4>
            <ul className="aftermath__list">
              {(before.items ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="aftermath__divider" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="aftermath__col aftermath__col--after">
            <h4 className="aftermath__col-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              {after.title}
            </h4>
            <ul className="aftermath__list">
              {(after.items ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AftermathSummary;
