import React, { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { EventListSection } from '../components/filters/event-list-section.jsx';
import { FilterSortBar } from '../components/filters/filter-sort-bar.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { getAdjacentEras, getAllTopics, getEraBySlug, getEventsByEra } from '../lib/event-queries.js';
import { applyListingState, parseListingState } from '../lib/listing-state.js';

const eraImages = {
  'era-van-lang-au-lac': '/images/generated/hung-vuong.png',
  'era-bac-thuoc': '/images/generated/hai-ba-trung.png',
  'era-dinh-le': '/images/generated/dinh-le-ly.png',
  'era-ly-tran': '/images/generated/ly-tran.png',
  'era-ho-le-so': '/images/generated/le-mac.png',
  'era-nam-bac-trieu': '/images/generated/trinh-nguyen.png',
  'era-nguyen': '/images/generated/nguyen.png',
  'era-hien-dai': '/images/generated/hien-dai.png',
};

export const EraDetailPage = () => {
  const { eraSlug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const era = getEraBySlug(eraSlug);
  const adjacent = getAdjacentEras(eraSlug);
  const state = parseListingState(searchParams);
  const events = useMemo(() => applyListingState(getEventsByEra(eraSlug), state), [eraSlug, state.grade, state.sort, state.topic, state.type]);

  const coverImage = era ? eraImages[era.id] || era.coverImage : null;

  return (
    <RouteCard
      eyebrow={era?.yearRange ?? 'Thời kỳ'}
      title={era?.name ?? 'Không tìm thấy thời kỳ'}
      coverImage={coverImage}
      subtitle={era?.summary}
    >
      <FilterSortBar topics={getAllTopics()} />
      <EventListSection events={events} variant="grid" />
      <nav aria-label="Thời kỳ lân cận" className="adjacent-nav">
        {adjacent.previous && (
          <Link to={`/thoi-ky/${adjacent.previous.slug}`} className="adjacent-nav__link">
            <div className="adjacent-nav__bg" aria-hidden="true">
              {eraImages[adjacent.previous.id] && (
                <img src={eraImages[adjacent.previous.id]} alt="" loading="lazy" />
              )}
            </div>
            <div className="adjacent-nav__content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <div>
                <small>Thời kỳ trước</small>
                <span>{adjacent.previous.name}</span>
              </div>
            </div>
          </Link>
        )}
        {!adjacent.previous && <div className="adjacent-nav__empty" />}
        {adjacent.next && (
          <Link to={`/thoi-ky/${adjacent.next.slug}`} className="adjacent-nav__link adjacent-nav__link--next">
            <div className="adjacent-nav__bg" aria-hidden="true">
              {eraImages[adjacent.next.id] && (
                <img src={eraImages[adjacent.next.id]} alt="" loading="lazy" />
              )}
            </div>
            <div className="adjacent-nav__content">
              <div>
                <small>Thời kỳ tiếp theo</small>
                <span>{adjacent.next.name}</span>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </Link>
        )}
      </nav>
    </RouteCard>
  );
};

export default EraDetailPage;
