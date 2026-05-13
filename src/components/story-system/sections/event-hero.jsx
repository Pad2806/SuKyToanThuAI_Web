import React, { useRef } from 'react';
import { Link } from 'react-router';
import { useHeroAnimation } from '../hooks/use-story-animations.js';
import { formatHistoricalYear } from '../../../lib/event-queries.js';

/**
 * Full-screen cinematic hero — Section I: Hook.
 * Renders the immersive entry point for every historical event.
 * All content driven by the event data object.
 */
export const EventHero = ({ event, heroScrolled }) => {
  const heroRef = useRef(null);
  useHeroAnimation(heroRef);

  return (
    <header className="evt-hero" ref={heroRef} id="evt-hook">
      <div className="evt-hero__bg" aria-hidden="true">
        <img alt="" src={event.image ?? '/images/generated/parchment.png'} />
        <div className="evt-hero__vignette" />
        <div className="evt-hero__grain" />
      </div>
      <div className="evt-hero__inner">
        <Link className="evt-hero__back" to="/">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Về trang chủ
        </Link>
        <span className="evt-hero__era">{event.eraSlug?.replaceAll('-', ' ')}</span>
        <h1 className="evt-hero__title">{event.title}</h1>
        <div className="evt-hero__divider" aria-hidden="true" />
        <blockquote className="evt-hero__quote">
          <p>"{event.excerpt}"</p>
        </blockquote>
        <dl className="evt-hero__facts">
          <div>
            <dt>Thời gian</dt>
            <dd>{formatHistoricalYear(event.year)}</dd>
          </div>
          <div>
            <dt>Địa điểm</dt>
            <dd>{event.location ?? 'Chưa rõ'}</dd>
          </div>
          <div>
            <dt>Nhân vật</dt>
            <dd>{(event.actors ?? []).join(', ')}</dd>
          </div>
          {event.opponent && (
            <div>
              <dt>Đối thủ</dt>
              <dd>{event.opponent}</dd>
            </div>
          )}
        </dl>
        <a className="evt-hero__cta" href="#evt-setup">
          <span>Bắt đầu khám phá</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
      <div className={`evt-hero__scroll-hint ${heroScrolled ? 'is-hidden' : ''}`} aria-hidden="true">
        <div className="evt-hero__scroll-line" />
      </div>
    </header>
  );
};

export default EventHero;
