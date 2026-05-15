import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { EventListSection } from '../components/filters/event-list-section.jsx';
import { FilterSortBar } from '../components/filters/filter-sort-bar.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { loadSearchEvents, searchEvents } from '../lib/event-queries.js';
import { applyListingState, parseListingState } from '../lib/listing-state.js';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const state = parseListingState(searchParams);
  const [results, setResults] = useState(() => searchEvents({ q }));
  const [loading, setLoading] = useState(false);
  const events = useMemo(() => applyListingState(results, state), [results, state.grade, state.sort, state.topic, state.type]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadSearchEvents({ q, filters: { grade: state.grade, type: state.type } }).then((loaded) => {
      if (!cancelled) setResults(loaded);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [q, state.grade, state.type]);

  return (
    <RouteCard
      eyebrow="Tìm kiếm"
      title="Lần theo một dấu mốc"
      subtitle="Gõ tên nhân vật, sự kiện, triều đại hoặc một địa danh để mở ra những lát cắt liên quan trong dòng sử."
    >
      <form action="/tim-kiem" className="route-search-form">
        <div className="search-input-wrap">
          <svg className="search-input-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input aria-label="Từ khoá tìm kiếm" defaultValue={q} name="q" placeholder="Bạch Đằng, Hai Bà Trưng, Tây Sơn..." />
        </div>
        <button type="submit">
          Tìm kiếm
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </form>
      {q && <p className="search-results-count">{events.length} kết quả cho "{q}"</p>}
      <FilterSortBar />
      <EventListSection events={events} loading={loading} variant="grid" />
    </RouteCard>
  );
};

export default SearchPage;
