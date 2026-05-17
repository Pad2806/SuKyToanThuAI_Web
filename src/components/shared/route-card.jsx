import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatHistoricalYear } from '../../lib/event-queries.js';

gsap.registerPlugin(ScrollTrigger);

export const RouteCard = ({ children, eyebrow, title, coverImage, subtitle }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.route-hero__eyebrow',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo('.route-hero__title',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
      );
      if (subtitle) {
        gsap.fromTo('.route-hero__subtitle',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
        );
      }
      if (coverImage) {
        gsap.to('.route-hero__bg img', {
          scale: 1.06, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [title, coverImage]);

  return (
    <>
      <header className="route-hero section-dark" ref={heroRef}>
        {coverImage && (
          <div className="route-hero__bg" aria-hidden="true">
            <img alt="" src={coverImage} />
            <div className="route-hero__vignette" />
          </div>
        )}
        {!coverImage && <div className="route-hero__pattern" aria-hidden="true" />}
        <div className="route-hero__inner">
          <Link className="route-hero__back" to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Trang chủ
          </Link>
          <p className="route-hero__eyebrow">{eyebrow}</p>
          <h1 className="route-hero__title">{title}</h1>
          {subtitle && <p className="route-hero__subtitle">{subtitle}</p>}
        </div>
      </header>
      <section className="route-body section-dark">
        <div className="route-body__inner">
          {children}
        </div>
      </section>
    </>
  );
};

export const EventLinks = ({ events }) => (
  <div className="event-links-grid">
    {events.map((event) => (
      <Link to={`/su-kien/${event.slug}`} className="event-link-card" key={event.id}>
        <div className="event-link-card__image">
          <img alt={event.title} loading="lazy" src={event.image || '/images/generated/parchment.png'} />
          <div className="event-link-card__overlay" />
        </div>
        <div className="event-link-card__body">
          <span className="event-link-card__year">{formatHistoricalYear(event.year)}</span>
          <h3>{event.title}</h3>
          <p>{event.excerpt}</p>
        </div>
      </Link>
    ))}
  </div>
);

export default RouteCard;
