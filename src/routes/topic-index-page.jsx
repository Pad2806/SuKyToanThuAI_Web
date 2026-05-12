import React from 'react';
import { Link } from 'react-router';
import { RouteCard } from '../components/shared/route-card.jsx';
import { getAllTopics, getEventsByTopic } from '../lib/event-queries.js';

const topicDescriptions = {
  'nha-nuoc-so-khai': 'Từ truyền thuyết đến thực tế, hành trình xây dựng nhà nước từ thuở hồng hoang.',
  'khang-chien-chong-xam-luoc': 'Ngàn năm đấu tranh, bảo vệ từng tấc đất, giữ gìn chủ quyền dân tộc.',
  'van-hoa-va-doi-song': 'Phong tục, tín ngưỡng và đời sống tinh thần qua các thời kỳ lịch sử.',
};

export const TopicIndexPage = () => {
  const topics = getAllTopics();

  return (
    <RouteCard
      eyebrow="Chủ đề"
      title="Những mạch đọc xuyên suốt"
      coverImage="/images/generated/co-loa.png"
      subtitle="Mỗi chủ đề là một đường dẫn qua nhiều thời kỳ, giúp người đọc thấy cùng một câu hỏi lịch sử đổi hình ra sao."
    >
      <div className="topic-cards-grid">
        {topics.map((topic) => {
          const eventCount = getEventsByTopic(topic.slug).length;
          return (
            <Link to={`/chu-de/${topic.slug}`} className="topic-card" key={topic.slug}>
              <div className="topic-card__header">
                <span className="topic-card__count">{eventCount}</span>
                <small>sự kiện</small>
              </div>
              <h3>{topic.name}</h3>
              <p>{topicDescriptions[topic.slug] || topic.description || ''}</p>
              <span className="topic-card__cta">
                Khám phá chủ đề
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </Link>
          );
        })}
      </div>
    </RouteCard>
  );
};

export default TopicIndexPage;
