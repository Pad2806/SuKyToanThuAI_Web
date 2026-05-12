import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { EventListSection } from '../components/filters/event-list-section.jsx';
import { FilterSortBar } from '../components/filters/filter-sort-bar.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { getAllTopics, getFeaturedEvents } from '../lib/event-queries.js';
import { applyListingState, parseListingState } from '../lib/listing-state.js';

export const FeaturedIndexPage = () => {
  const [searchParams] = useSearchParams();
  const state = parseListingState(searchParams);
  const events = useMemo(() => applyListingState(getFeaturedEvents(), state), [state.grade, state.sort, state.topic, state.type]);

  return (
    <RouteCard
      eyebrow="Nổi bật"
      title="Những khoảnh khắc làm thay đổi lịch sử"
      coverImage="/images/generated/bach-dang.png"
      subtitle="Các biến cố có cao trào rõ, nhân vật nổi bật và dư âm đủ mạnh để kéo người đọc đi tiếp qua từng hồi kể."
    >
      <FilterSortBar topics={getAllTopics()} />
      <EventListSection events={events} variant="grid" />
    </RouteCard>
  );
};

export default FeaturedIndexPage;
