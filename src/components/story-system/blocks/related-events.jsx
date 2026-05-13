import React from 'react';
import { Link } from 'react-router';

/**
 * Related Events — renders links to other story events.
 * Data-driven: receives an array of event summaries from the parent.
 */
export const RelatedEvents = ({ events = [] }) => {
  if (events.length === 0) return null;

  return (
    <div className="evt-related">
      <h3 className="evt-related__title">Câu chuyện liên quan</h3>
      <div className="evt-related__grid">
        {events.map((event) => (
          <Link
            className="evt-related__card"
            key={event.slug}
            to={`/su-kien/${event.slug}`}
          >
            <span className="evt-related__year">{event.year}</span>
            <span className="evt-related__name">{event.title}</span>
            <span className="evt-related__arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedEvents;
