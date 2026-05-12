import React from 'react';
import { Link } from 'react-router';
import { formatHistoricalYear } from '../../lib/event-queries.js';

const cardImages = {
  'event-hung-vuong': '/images/generated/hung-vuong.png',
  'event-co-loa': '/images/generated/co-loa.png',
  'event-hai-ba-trung': '/images/generated/hai-ba-trung.png',
  'event-bach-dang': '/images/generated/bach-dang.png',
  'event-ba-trieu': '/images/generated/hai-ba-trung.png',
  'event-son-tinh-thuy-tinh': '/images/generated/hung-vuong.png',
};

const getEventImage = (event) =>
  cardImages[event.id] || event.image || '/images/generated/parchment.png';

export const EventListSection = ({ error, events, loading, onRetry, variant = 'timeline' }) => {
  if (loading) {
    return (
      <div className="event-list-section is-loading">
        <div className="loading-pulse" />
        <p>Đang tải dòng sự kiện...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-list-section is-error">
        <p>Đã xảy ra lỗi khi tải dữ liệu.</p>
        <button onClick={onRetry} type="button">Thử lại</button>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="event-list-section is-empty">
        <p>Chưa có sự kiện nào cho bộ lọc này.</p>
        <Link to="/" className="route-link-cta">Khám phá dòng thời gian</Link>
      </div>
    );
  }

  return (
    <section className={`event-list-section event-list-section--${variant}`}>
      {events.map((event) => (
        <article className="event-card" key={event.id}>
          <Link to={`/su-kien/${event.slug}`}>
            <div className="event-card__image">
              <img alt={event.title} loading="lazy" src={getEventImage(event)} />
            </div>
            <div className="event-card__body">
              <div className="event-card__meta">
                <span className="event-card__year">{formatHistoricalYear(event.year)}</span>
                {event.location && <span className="event-card__location">{event.location}</span>}
              </div>
              <h3>{event.title}</h3>
              <p>{event.excerpt}</p>
              <div className="event-card__footer">
                <small>{event.gradeTags?.join(' · ')}</small>
                <span className="event-card__cta">
                  Mở hồi kể
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
};

export default EventListSection;
