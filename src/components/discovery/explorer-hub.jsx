import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllEras } from '../../lib/event-queries.js';

gsap.registerPlugin(ScrollTrigger);

const gradeLinks = [
  { label: 'Tiểu học', desc: 'Nhân vật, hình ảnh', to: '/khoi-lop/th' },
  { label: 'THCS', desc: 'Bối cảnh, diễn biến', to: '/khoi-lop/thcs' },
  { label: 'THPT', desc: 'Phân tích, hệ quả', to: '/khoi-lop/thpt' },
];

export const ExplorerHub = () => {
  const sectionRef = useRef(null);
  const eras = getAllEras();

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const categories = gsap.utils.toArray('.explorer-category');
      const chips = gsap.utils.toArray('.explorer-chip');

      gsap.fromTo('.explorer-hub__header > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      if (categories.length) {
        gsap.fromTo(categories,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: categories[0]?.parentElement || sectionRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }

      if (chips.length) {
        gsap.fromTo(chips,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: chips[0]?.parentElement?.parentElement || sectionRef.current, start: 'top 92%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="explorer-hub section-dark" ref={sectionRef}>
      <div className="discovery-inner">
        <div className="explorer-hub__header">
          <p className="section-kicker">Khám phá theo cách của bạn</p>
          <h2>Bắt đầu từ đâu?</h2>
          <p className="section-lead">
            Chọn một cách tiếp cận phù hợp — theo cấp học hoặc theo thời kỳ lịch sử.
          </p>
        </div>

        <form action="/tim-kiem" className="explorer-hub__search">
          <div className="explorer-search-box">
            <svg className="explorer-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input id="home-search" name="q" placeholder="Tìm sự kiện, nhân vật, địa danh..." autoComplete="off" />
          </div>
        </form>

        <div className="explorer-hub__categories">
          {gradeLinks.map((grade) => (
            <Link to={grade.to} className="explorer-category" key={grade.to}>
              <strong>{grade.label}</strong>
              <span>{grade.desc}</span>
            </Link>
          ))}
        </div>

        <div className="explorer-hub__chips">
          <div className="explorer-chip-group">
            <p className="explorer-chip-label">Thời kỳ</p>
            <div className="explorer-chip-row">
              {eras.map((era) => (
                <Link key={era.id} to={`/thoi-ky/${era.slug}`} className="explorer-chip">{era.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplorerHub;
