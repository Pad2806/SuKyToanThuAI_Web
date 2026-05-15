import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { EventListSection } from '../components/filters/event-list-section.jsx';
import { FilterSortBar } from '../components/filters/filter-sort-bar.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { getFeaturedEvents, loadFeaturedEvents } from '../lib/event-queries.js';
import { applyListingState, parseListingState } from '../lib/listing-state.js';

export const FeaturedIndexPage = () => {
  const [searchParams] = useSearchParams();
  const [featuredEvents, setFeaturedEvents] = useState(() => getFeaturedEvents());
  const [loading, setLoading] = useState(false);
  const state = parseListingState(searchParams);
  const events = useMemo(() => applyListingState(featuredEvents, state), [featuredEvents, state.grade, state.sort, state.topic, state.type]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadFeaturedEvents().then((loaded) => {
      if (!cancelled) setFeaturedEvents(loaded);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <RouteCard
      eyebrow="Nổi bật"
      title="Những khoảnh khắc làm thay đổi lịch sử"
      coverImage="/images/generated/bach-dang.png"
      subtitle="Các biến cố có cao trào rõ, nhân vật nổi bật và dư âm đủ mạnh để kéo người đọc đi tiếp qua từng hồi kể."
    >
      <FilterSortBar />
      <EventListSection events={events} loading={loading} variant="grid" />
    </RouteCard>
  );
};

export default FeaturedIndexPage;
