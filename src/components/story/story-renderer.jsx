import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { formatHistoricalYear } from '../../lib/event-queries.js';
import { warnWhenWowBudgetExceeded } from '../../lib/story-constraints.js';
import { TableOfContents } from '../meta/table-of-contents.jsx';
import { BeatSection } from './beat-section.jsx';
import { ReadingProgressBar } from './reading-progress-bar.jsx';
import { ScrollyStage } from './scrolly-stage.jsx';

export const StoryRenderer = ({ event }) => {
  const [activeBeat, setActiveBeat] = useState(event.story.beats[0]?.type ?? 'hook');
  const location = useLocation();

  useEffect(() => {
    warnWhenWowBudgetExceeded(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const sections = event.story.beats
      .map((beat) => document.getElementById(`beat-${beat.type}`))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id) {
          setActiveBeat(visible.target.id.replace('beat-', ''));
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [event.story.beats]);

  return (
    <article className="story-renderer">
      <ReadingProgressBar />
      <header className="story-hero section-dark wow-effect">
        <div className="story-hero__image" aria-hidden="true">
          <img alt="" src={event.image ?? event.fallbackImage} />
        </div>
        <div className="story-hero__inner">
          <Link className="story-hero__back" to="/">Về trang chủ</Link>
          <p className="section-kicker">{event.eraSlug}</p>
          <h1>{event.title}</h1>
          <p>{event.excerpt}</p>
          <dl className="story-hero__facts">
            <div>
              <dt>Năm</dt>
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
          </dl>
          <a className="story-hero__start" href="#beat-hook">Bắt đầu đọc</a>
        </div>
      </header>
      <TableOfContents activeBeat={activeBeat} beats={event.story.beats} />
      <ScrollyStage beats={event.story.beats} event={event} />
      {event.story.beats.map((beat, index) => (
        <BeatSection beat={beat} event={event} index={index} key={beat.type} />
      ))}
    </article>
  );
};

export default StoryRenderer;
