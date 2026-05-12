import React from 'react';
import { Link } from 'react-router';
import { formatHistoricalYear, getFeaturedEvents } from '../../lib/event-queries.js';

export const HookHero = () => {
  const [leadStory] = getFeaturedEvents(1);

  return (
    <section className="hook-hero section-dark wow-effect">
      <div className="hook-hero__image" aria-hidden="true">
        {leadStory && <img alt="" src={leadStory.image} />}
      </div>
      <div className="hook-hero__inner">
        <div className="hook-hero__copy">
          <p className="section-kicker">Sử ký kể chuyện</p>
          <h1>Mở lịch sử như một cuốn trường thiên đang chuyển động</h1>
          <p>
            Mỗi sự kiện được dựng thành hành trình sáu hồi: bối cảnh, mâu thuẫn,
            bước ngoặt và điều còn ở lại trong ký ức Việt.
          </p>
          <div className="hero-actions">
            {leadStory && <Link to={`/su-kien/${leadStory.slug}`}>Đọc câu chuyện mở đầu</Link>}
            <a href="#dong-chay">Theo dòng thời gian</a>
          </div>
        </div>
        {leadStory && (
          <Link className="hero-story-card" to={`/su-kien/${leadStory.slug}`}>
            <span>{formatHistoricalYear(leadStory.year)}</span>
            <h2>{leadStory.title}</h2>
            <p>{leadStory.excerpt}</p>
            <small>Vào trải nghiệm đọc 6 hồi</small>
          </Link>
        )}
      </div>
      <div className="hero-scroll-cue" aria-hidden="true">
        Cuộn để mở dòng sử
      </div>
    </section>
  );
};

export default HookHero;
