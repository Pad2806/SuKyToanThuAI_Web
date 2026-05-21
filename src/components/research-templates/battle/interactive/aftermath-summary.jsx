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
  const comparisonRef = useRef(null);

  useEffect(() => {
    if (!comparisonRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* Stagger stat cards */
      gsap.from('.aftermath__stat-card', {
        y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.aftermath__stats',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

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
    }, comparisonRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="aftermath">
      <h3 className="aftermath__title">{aftermath.title}</h3>

      {/* Stats cards */}
      <div className="aftermath__stats">
        {aftermath.stats.map((stat, i) => (
          <AnimatedStat key={i} stat={stat} />
        ))}
      </div>

      {/* Before / After comparison */}
      <div className="aftermath__comparison" ref={comparisonRef}>
        <div className="aftermath__col aftermath__col--before">
          <h4 className="aftermath__col-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {aftermath.before.title}
          </h4>
          <ul className="aftermath__list">
            {aftermath.before.items.map((item, i) => (
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
            {aftermath.after.title}
          </h4>
          <ul className="aftermath__list">
            {aftermath.after.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AftermathSummary;
