import React from 'react';
import { Link } from 'react-router';
import { getAllEras, getEventsByEra } from '../../lib/event-queries.js';
import { TopicEntry } from './topic-entry.jsx';

export const EraRiver = () => (
  <section className="era-river section-dark" id="dong-chay">
    <div className="discovery-inner">
      <p className="section-kicker">Dòng chảy lịch sử</p>
      <h2>Dòng chảy lịch sử</h2>
      <div className="era-river__list">
        {getAllEras().map((era) => {
          const events = getEventsByEra(era.slug);

          return (
            <article className="era-card" key={era.id}>
              <div className="era-card__image">
                <img alt={`Minh họa ${era.name}`} loading="lazy" src={era.coverImage} />
              </div>
              <div className="era-card__content">
                <p>{era.yearRange}</p>
                <h3>{era.name}</h3>
                <p>{era.summary}</p>
                <ul>
                  {events.slice(0, 3).map((event) => (
                    <li key={event.id}>
                      <Link to={`/su-kien/${event.slug}`}>{event.title}</Link>
                    </li>
                  ))}
                </ul>
                <TopicEntry count={events.length} label="Khám phá thời kỳ" to={`/thoi-ky/${era.slug}`} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default EraRiver;
