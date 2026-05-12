import React from 'react';
import { Link } from 'react-router';

export const CallToAction = () => (
  <section className="call-to-action section-parchment">
    <div className="discovery-inner">
      <p className="section-kicker">Mở trang sử tiếp theo</p>
      <h2>Bắt đầu bằng một sự kiện, kết thúc bằng một mạch hiểu</h2>
      <p className="section-lead">
        Chọn một dấu mốc rồi đi qua toàn bộ câu chuyện: ai có mặt, điều gì
        căng lên, khoảnh khắc nào đổi chiều và vì sao sự kiện ấy còn đáng nhớ.
      </p>
      <Link className="topic-entry" to="/tim-kiem">Tìm kiếm sự kiện</Link>
    </div>
  </section>
);

export default CallToAction;
