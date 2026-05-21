import React, { useRef } from 'react';
import { Link } from 'react-router';
import { useHeroAnimation } from '../hooks/use-battle-animations.js';
import { formatHistoricalPeriod } from '../../../../lib/event-queries.js';
import { resolveImageUrl } from '../../../../lib/fallback-image.js';

/**
 * BattleHero — Full-screen cinematic hero for battle events.
 * Back link goes to Không Gian AI.
 */
export const BattleHero = ({ event, heroScrolled }) => {
  const heroRef = useRef(null);
  useHeroAnimation(heroRef);

  /* Strip "Tiêu đề:" or similar prefixes from excerpt */
  const cleanExcerpt = (text) => {
    if (!text) return '';
    return text.replace(/^["']?\s*Tiêu đề\s*[:：]\s*/i, '').trim();
  };

  /* Show max 3 actor names, e.g. "A, B, C +2" */
  const MAX_ACTORS = 3;
  const actors = event.actors ?? [];
  const actorDisplay = actors.length <= MAX_ACTORS
    ? actors.join(', ')
    : `${actors.slice(0, MAX_ACTORS).join(', ')} +${actors.length - MAX_ACTORS}`;

  return (
    <header className="evt-hero" ref={heroRef} id="evt-hook">
      <div className="evt-hero__bg" aria-hidden="true">
        <img alt="" src={resolveImageUrl(event.image, event.title)} />
        <div className="evt-hero__vignette" />
        <div className="evt-hero__grain" />
      </div>
      <div className="evt-hero__inner">
        <Link className="evt-hero__back" to="/khong-gian-ai">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Không Gian AI
        </Link>
        <h1 className="evt-hero__title">{event.title}</h1>
        <div className="evt-hero__divider" aria-hidden="true" />
        <blockquote className="evt-hero__quote">
          <p>"{cleanExcerpt(event.excerpt)}"</p>
        </blockquote>
        <dl className="evt-hero__facts">
          <div>
            <dt>Thời gian</dt>
            <dd>{formatHistoricalPeriod(event)}</dd>
          </div>
          <div>
            <dt>Địa điểm</dt>
            <dd>{event.location ?? 'Chưa rõ'}</dd>
          </div>
          <div>
            <dt>Nhân vật</dt>
            <dd>{actorDisplay}</dd>
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

export default BattleHero;
