import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { EventLinks, RouteCard } from '../components/shared/route-card.jsx';
import { StorytellingRenderer } from '../components/story/storytelling-renderer.jsx';
import { EventStoryPage } from '../components/story-system/event-story-page.jsx';
import { fetchStoryEvent, hasInteractiveData, fetchRelatedEvents } from '../lib/event-api.js';
import { getEventBySlug, getRelatedEvents } from '../lib/event-queries.js';
import { SuspenseLoader } from '../components/shared/suspense-loader.jsx';

/**
 * Event Detail Page — the route handler.
 *
 * Resolution strategy:
 * 1. Try `fetchStoryEvent(slug)` — checks all mock data files via dynamic import.
 * 2. If found and has interactive data → render <EventStoryPage data={...} />
 * 3. Otherwise fallback to the basic StorytellingRenderer.
 *
 * When the real API is ready, only `event-api.js` changes — this route stays the same.
 */
export const EventDetailPage = () => {
  const { eventSlug = '' } = useParams();
  const [storyEvent, setStoryEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchStoryEvent(eventSlug).then((data) => {
      if (cancelled) return;
      setStoryEvent(data);
      setTried(true);
      setLoading(false);

      if (data?.relatedEventSlugs?.length > 0) {
        fetchRelatedEvents(data.relatedEventSlugs).then((related) => {
          if (!cancelled) setRelatedEvents(related);
        });
      }
    });

    return () => { cancelled = true; };
  }, [eventSlug]);

  /* ── Loading state ── */
  if (loading) {
    return <SuspenseLoader label="Đang tải câu chuyện" />;
  }

  /* ── Interactive story page (new system) ── */
  if (storyEvent && hasInteractiveData(storyEvent)) {
    return <EventStoryPage data={storyEvent} relatedEvents={relatedEvents} />;
  }

  /* ── Fallback: basic event from static data ── */
  const basicEvent = import.meta.env.DEV ? getEventBySlug(eventSlug) : null;
  const basicRelated = basicEvent ? getRelatedEvents({ eventId: basicEvent.id }) : [];

  if (!basicEvent && tried) {
    return (
      <RouteCard eyebrow="Sự kiện" title="Không tìm thấy sự kiện">
        <p className="section-lead">Dữ liệu sự kiện chưa có trong hệ thống. Hãy quay lại dòng thời kỳ để chọn một câu chuyện khác.</p>
      </RouteCard>
    );
  }

  if (basicEvent) {
    return (
      <>
        <StorytellingRenderer event={basicEvent} />
        {basicRelated.length > 0 && (
          <RouteCard
            eyebrow="Liên quan"
            title="Câu chuyện liền mạch"
            subtitle="Những sự kiện gần cùng chủ đề hoặc cùng thời kỳ để tiếp tục đọc theo mạch lịch sử."
          >
            <EventLinks events={basicRelated} />
          </RouteCard>
        )}
      </>
    );
  }

  return null;
};

export default EventDetailPage;
