import React from 'react';
import { useParams } from 'react-router';
import { EventLinks, RouteCard } from '../components/shared/route-card.jsx';
import { StorytellingRenderer } from '../components/story/storytelling-renderer.jsx';
import { EventDetailStorytelling } from '../components/story-interactive/event-detail-storytelling.jsx';
import { getEventBySlug, getRelatedEvents } from '../lib/event-queries.js';
import { bachDang1288 } from '../data/mock/bach-dang-1288.js';


/**
 * Checks if an event has the rich interactive data (characters, timeline, climaxScene, quiz).
 * If so, renders the new 6-part storytelling page; otherwise falls back to the original renderer.
 */
const hasInteractiveData = (event) =>
  event?.characters?.length > 0 && event?.timeline?.length > 0 && event?.quiz?.length > 0;

export const EventDetailPage = () => {
  const { eventSlug = '' } = useParams();

  // Try the rich interactive event first
  let event = null;
  let useInteractive = false;

  if (eventSlug === bachDang1288.slug) {
    event = bachDang1288;
    useInteractive = true;
  } else {
    event = getEventBySlug(eventSlug);
  }

  const relatedEvents = event ? getRelatedEvents({ eventId: event.id }) : [];



  if (!event) {
    return (
      <RouteCard eyebrow="Sự kiện" title="Không tìm thấy sự kiện">
        <p className="section-lead">Dữ liệu sự kiện chưa có trong hệ thống. Hãy quay lại dòng thời kỳ để chọn một câu chuyện khác.</p>
      </RouteCard>
    );
  }

  if (useInteractive && hasInteractiveData(event)) {
    return <EventDetailStorytelling event={event} />;
  }

  return (
    <>
      <StorytellingRenderer event={event} />
      {relatedEvents.length > 0 && (
        <RouteCard
          eyebrow="Liên quan"
          title="Câu chuyện liền mạch"
          subtitle="Những sự kiện gần cùng chủ đề hoặc cùng thời kỳ để tiếp tục đọc theo mạch lịch sử."
        >
          <EventLinks events={relatedEvents} />
        </RouteCard>
      )}
    </>
  );
};

export default EventDetailPage;
