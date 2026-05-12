import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { EventListSection } from '../components/filters/event-list-section.jsx';
import { FilterSortBar } from '../components/filters/filter-sort-bar.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { getAllTopics, getEventsByTopic } from '../lib/event-queries.js';
import { applyListingState, parseListingState } from '../lib/listing-state.js';

const topicImages = {
  'nha-nuoc-so-khai': '/images/generated/hung-vuong.png',
  'khang-chien-chong-xam-luoc': '/images/generated/bach-dang.png',
  'van-hoa-va-doi-song': '/images/generated/co-loa.png',
};

export const TopicDetailPage = () => {
  const { topicSlug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const topic = getAllTopics().find((item) => item.slug === topicSlug);
  const state = parseListingState(searchParams);
  const events = useMemo(() => applyListingState(getEventsByTopic(topicSlug), state), [topicSlug, state.grade, state.sort, state.type]);

  return (
    <RouteCard
      eyebrow="Chủ đề"
      title={topic?.name ?? 'Không tìm thấy chủ đề'}
      coverImage={topicImages[topicSlug] || '/images/generated/hero-banner.png'}
      subtitle={topic?.description ?? 'Dữ liệu chủ đề chưa có trong hệ thống.'}
    >
      <FilterSortBar topics={getAllTopics()} />
      <EventListSection events={events} variant="grid" />
    </RouteCard>
  );
};

export default TopicDetailPage;
