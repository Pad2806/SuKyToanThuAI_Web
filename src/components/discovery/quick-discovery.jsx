import React from 'react';
import { Link } from 'react-router';
import { getAllEras } from '../../lib/event-queries.js';

const gradeLinks = [
  { label: 'Tiểu học', to: '/khoi-lop/th' },
  { label: 'THCS', to: '/khoi-lop/thcs' },
  { label: 'THPT', to: '/khoi-lop/thpt' },
];

export const QuickDiscovery = () => {
  const eras = getAllEras().slice(0, 7);

  return (
    <section className="quick-discovery section-parchment">
      <div className="quick-discovery__intro discovery-inner">
        <div>
          <p className="section-kicker">Bắt đầu từ một dấu hỏi</p>
          <h2>Muốn đọc theo triều đại hay khối lớp?</h2>
        </div>
        <form action="/tim-kiem" className="quick-discovery__search">
          <label htmlFor="home-search">Tìm sự kiện, nhân vật, địa danh</label>
          <input id="home-search" name="q" placeholder="Ví dụ: Bạch Đằng, Cổ Loa, Hai Bà Trưng..." />
        </form>
      </div>
      <div className="discovery-inner quick-discovery__groups">
        <div>
          <p className="chip-label">Thời kỳ</p>
          <div className="chip-row">
            {eras.map((era) => <Link key={era.id} to={`/thoi-ky/${era.slug}`}>{era.name}</Link>)}
          </div>
        </div>
        <div>
          <p className="chip-label">Khối lớp</p>
          <div className="chip-row">
            {gradeLinks.map((grade) => <Link key={grade.to} to={grade.to}>{grade.label}</Link>)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickDiscovery;
