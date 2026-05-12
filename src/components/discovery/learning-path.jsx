import React from 'react';
import { TopicEntry } from './topic-entry.jsx';

export const LearningPath = () => (
  <section className="learning-path section-dark">
    <div className="discovery-inner">
      <p className="section-kicker">Khối lớp</p>
      <h2>Chọn lộ trình học</h2>
      <p className="section-lead">
        Mỗi lộ trình ưu tiên mức độ đọc phù hợp: từ câu chuyện dễ nhớ đến các
        bước phân tích nguyên nhân, diễn biến và hệ quả.
      </p>
      <div className="collection-strip">
        <TopicEntry description="Đọc theo nhân vật, địa danh và hình ảnh chính." label="Tiểu học" to="/khoi-lop/th" />
        <TopicEntry description="Nắm bối cảnh, diễn biến và mốc thời gian." label="THCS" to="/khoi-lop/thcs" />
        <TopicEntry description="Phân tích nguyên nhân, hệ quả và ý nghĩa lịch sử." label="THPT" to="/khoi-lop/thpt" />
      </div>
    </div>
  </section>
);

export default LearningPath;
