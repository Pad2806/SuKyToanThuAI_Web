import React, { useRef } from 'react';
import { Link } from 'react-router';
import { useHeroAnimation } from '../hooks/use-era-animations.js';
import { formatHistoricalPeriod } from '../../../../lib/event-queries.js';

const normalizeLabel = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getQuickFactPeriod = (event = {}) => {
  const beats = event.story?.beats ?? [];
  const quickFacts = beats
    .flatMap((beat) => beat.blocks ?? [])
    .find((block) => block.type === 'quick-facts');
  const item = quickFacts?.items?.find((fact) => {
    const label = normalizeLabel(fact.label);
    return label.includes('giai doan') || label.includes('thoi gian');
  });

  return item?.value || '';
};

/**
 * EraHero - Full-screen cinematic hero for era-timeline.
 */
export const EraHero = ({ event, heroScrolled }) => {
  const heroRef = useRef(null);
  useHeroAnimation(heroRef);

  const rangeText = getQuickFactPeriod(event) || formatHistoricalPeriod(event);
  const overview = event.overview || {};

  return (
    <header className="evt-hero" ref={heroRef} id="evt-hook">
      <div className="evt-hero__bg" aria-hidden="true">
        <img alt="" src={event.image ?? '/images/generated/parchment.png'} />
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
          <p>"{event.summary?.slice(0, 220) || ''}"</p>
        </blockquote>
        <dl className="evt-hero__facts">
          <div>
            <dt>Giai đoạn</dt>
            <dd>{rangeText || 'Nhiều thế kỷ'}</dd>
          </div>
          <div>
            <dt>Sự kiện</dt>
            <dd>{overview.totalEvents ?? '-'}</dd>
          </div>
          <div>
            <dt>Kéo dài</dt>
            <dd>{overview.totalYears ? `${overview.totalYears} năm` : '-'}</dd>
          </div>
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

export default EraHero;
