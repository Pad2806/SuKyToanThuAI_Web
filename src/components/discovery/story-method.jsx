import React from 'react';
import { Link } from 'react-router';
import { getFeaturedEvents } from '../../lib/event-queries.js';

const methodSteps = [
  ['Khoảnh khắc', 'Mở bằng hình ảnh hoặc câu nói khiến người đọc muốn biết điều gì vừa xảy ra.'],
  ['Bối cảnh', 'Gỡ từng lớp: thời gian, địa điểm, nhân vật, thế lực và đời sống đương thời.'],
  ['Thử thách', 'Đặt mâu thuẫn vào trung tâm để thấy vì sao sự kiện không thể đứng yên.'],
  ['Bước ngoặt', 'Theo dõi quyết định hoặc thế trận làm lịch sử đổi hướng.'],
  ['Hệ quả', 'Nhìn những thay đổi sau biến cố: quyền lực, lãnh thổ, ký ức, bài học.'],
  ['Bài học', 'Kết nối sự kiện với cách hiểu bản sắc, tự chủ và trách nhiệm hôm nay.'],
];

export const StoryMethod = () => {
  const [sample] = getFeaturedEvents(1);

  return (
    <section className="story-method section-dark">
      <div className="discovery-inner story-method__grid">
        <div className="story-method__visual" aria-hidden="true">
          {sample && <img alt="" loading="lazy" src={sample.image} />}
          <div />
        </div>
        <div className="story-method__copy">
          <p className="section-kicker">Cách một sự kiện được kể</p>
          <h2>Mỗi dấu mốc là một hành trình có nhịp, không phải một đoạn ghi nhớ</h2>
          <p className="section-lead">
            Trang chi tiết được dựng như một cuộn sử: người đọc đi qua sáu hồi,
            mỗi hồi có vai trò riêng để hiểu sự kiện bằng cả mạch cảm xúc và
            cấu trúc lịch sử.
          </p>
          <div className="story-method__steps">
            {methodSteps.map(([title, description], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
          {sample && <Link className="topic-entry" to={`/su-kien/${sample.slug}`}>Thử đọc một câu chuyện</Link>}
        </div>
      </div>
    </section>
  );
};

export default StoryMethod;
