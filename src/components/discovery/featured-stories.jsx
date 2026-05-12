import React from 'react';
import { Link } from 'react-router';
import { formatHistoricalYear, getFeaturedEvents } from '../../lib/event-queries.js';

export const FeaturedStories = () => {
  const [cover, ...supporting] = getFeaturedEvents(3);

  return (
    <section className="featured-stories section-parchment">
      <div className="discovery-inner">
        <p className="section-kicker">Câu chuyện nổi bật</p>
        <h2>Câu chuyện nổi bật</h2>
        {cover && (
          <article className="featured-cover">
            <Link className="featured-cover__image" to={`/su-kien/${cover.slug}`}>
              <img alt={`Minh họa ${cover.title}`} loading="lazy" src={cover.image} />
            </Link>
            <div className="featured-cover__copy">
              <span>{formatHistoricalYear(cover.year)} · {cover.location}</span>
              <h3>{cover.title}</h3>
              <blockquote>{cover.excerpt}</blockquote>
              <Link to={`/su-kien/${cover.slug}`}>Đọc câu chuyện</Link>
            </div>
          </article>
        )}
        <div className="featured-support">
          {supporting.map((event) => (
            <Link className="featured-support__item" key={event.id} to={`/su-kien/${event.slug}`}>
              <img alt="" loading="lazy" src={event.image} />
              <span>{formatHistoricalYear(event.year)}</span>
              <strong>{event.title}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
