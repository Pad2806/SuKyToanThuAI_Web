import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllEras } from '../../lib/event-queries.js';

gsap.registerPlugin(ScrollTrigger);

const gradeLinks = [
  { label: 'Tiểu học', desc: 'Nhân vật, địa danh và hình ảnh lịch sử', to: '/khoi-lop/th' },
  { label: 'THCS', desc: 'Bối cảnh, diễn biến và mốc thời gian', to: '/khoi-lop/thcs' },
  { label: 'THPT', desc: 'Phân tích nguyên nhân, hệ quả và ý nghĩa', to: '/khoi-lop/thpt' },
];

export const FinalCta = () => {
  const sectionRef = useRef(null);
  const eras = getAllEras();

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.final-cta__hero > *',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      const explorerEls = gsap.utils.toArray('.final-cta__explore > *');
      if (explorerEls.length) {
        gsap.fromTo(explorerEls,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: '.final-cta__explore', start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="final-cta section-dark" ref={sectionRef}>
      <div className="final-cta__bg" aria-hidden="true">
        <img alt="" src="/images/generated/hero-banner.png" />
      </div>

      <div className="final-cta__inner discovery-inner">
        {/* Hero CTA */}
        <div className="final-cta__hero">
          <p className="section-kicker">Mở trang sử tiếp theo</p>
          <h2>Bắt đầu bằng một sự kiện, kết thúc bằng một mạch hiểu</h2>
          <p className="section-lead">
            Chọn một dấu mốc rồi đi qua toàn bộ câu chuyện: ai có mặt, điều gì
            căng lên, khoảnh khắc nào đổi chiều và vì sao sự kiện ấy còn đáng nhớ.
          </p>
          <div className="final-cta__buttons">
            <Link className="btn-hero btn-hero--primary" to="/tim-kiem">
              <span>Tìm kiếm sự kiện</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </Link>
          </div>
        </div>

        {/* Explorer merged section */}
        <div className="final-cta__explore">
          <div className="final-cta__search">
            <form action="/tim-kiem">
              <div className="explorer-search-box">
                <svg className="explorer-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input id="footer-search" name="q" placeholder="Tìm sự kiện, nhân vật, địa danh..." autoComplete="off" />
              </div>
            </form>
          </div>

          <div className="final-cta__categories">
            {gradeLinks.map((grade) => (
              <Link to={grade.to} className="explorer-category" key={grade.to}>
                <strong>{grade.label}</strong>
                <span>{grade.desc}</span>
              </Link>
            ))}
          </div>

          <div className="final-cta__chips">
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
      </div>
    </section>
  );
};

export default FinalCta;
