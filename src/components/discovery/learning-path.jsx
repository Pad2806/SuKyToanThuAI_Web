import React from 'react';
import { Link } from 'react-router';

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
        <Link className="topic-entry" to="/khoi-lop/th"><strong>Tiểu học</strong><span>Đọc theo nhân vật, địa danh và hình ảnh chính.</span></Link>
        <Link className="topic-entry" to="/khoi-lop/thcs"><strong>THCS</strong><span>Nắm bối cảnh, diễn biến và mốc thời gian.</span></Link>
        <Link className="topic-entry" to="/khoi-lop/thpt"><strong>THPT</strong><span>Phân tích nguyên nhân, hệ quả và ý nghĩa lịch sử.</span></Link>
      </div>
    </div>
  </section>
);

export default LearningPath;
