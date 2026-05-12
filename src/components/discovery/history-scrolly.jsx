import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllEras, getEventsByEra } from '../../lib/event-queries.js';

gsap.registerPlugin(ScrollTrigger);

const eraTimelineImages = {
  'era-van-lang-au-lac': '/images/generated/hung-vuong.png',
  'era-bac-thuoc': '/images/generated/hai-ba-trung.png',
  'era-dinh-le': '/images/generated/dinh-le-ly.png',
  'era-ly-tran': '/images/generated/ly-tran.png',
  'era-ho-le-so': '/images/generated/le-mac.png',
  'era-nam-bac-trieu': '/images/generated/trinh-nguyen.png',
  'era-nguyen': '/images/generated/nguyen.png',
  'era-hien-dai': '/images/generated/hien-dai.png',
};

const eraHighlights = {
  'era-van-lang-au-lac': 'Trống đồng Đông Sơn • 18 đời Hùng Vương • Kinh đô Phong Châu',
  'era-bac-thuoc': 'Hai Bà Trưng • Bà Triệu • Ngô Quyền • Chiến thắng Bạch Đằng 938',
  'era-dinh-le': 'Dẹp loạn 12 sứ quân • Đại Cồ Việt • Lê Hoàn phá Tống',
  'era-ly-tran': 'Chiếu dời đô • Thăng Long • Hội nghị Diên Hồng • Hào khí Đông A',
  'era-ho-le-so': 'Thành nhà Hồ • Khởi nghĩa Lam Sơn • Bình Ngô đại cáo • Hồng Đức',
  'era-nam-bac-trieu': 'Sông Gianh • Đàng Trong - Đàng Ngoài • Chữ Quốc Ngữ • Phố Hiến',
  'era-nguyen': 'Gia Long thống nhất • Hoàng Sa - Trường Sa • Văn Thánh Miếu',
  'era-hien-dai': 'Cách mạng tháng Tám • Điện Biên Phủ • Đổi Mới',
};

function formatHistoricalYear(year) {
  if (!year) return '';
  return year < 0 ? `${Math.abs(year)} TCN` : year.toString();
}



export const HistoryScrolly = () => {
  const containerRef = useRef(null);
  const eras = getAllEras();

  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      
      // Animate sections as they scroll into view
      gsap.utils.toArray('.scrolly-panel').forEach(panel => {
        
        // 1. Cinematic Background Reveal — GPU-friendly scale + opacity only
        const bgImg = panel.querySelector('.scrolly-bg-wrapper img');
        if (bgImg) {
          gsap.fromTo(bgImg,
            { scale: 1.15, opacity: 0.4 },
            { 
              scale: 1.05, 
              opacity: 1, 
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top 90%',
                end: 'top 20%',
                scrub: 0.6
              }
            }
          );
        }

        // 2. Content Reveal — GPU-friendly: opacity + translateY only (no filter:blur!)
        const contentElements = panel.querySelectorAll('.scrolly-content > *:not(.scrolly-era__year-big)');
        
        if (contentElements.length) {
          gsap.fromTo(contentElements,
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0,
              stagger: 0.1, 
              duration: 1, 
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 55%', 
                toggleActions: 'play none none reverse'
              }
            }
          );
        }

        // 3. Year number fade
        const year = panel.querySelector('.scrolly-era__year-big');
        if (year) {
           gsap.fromTo(year, 
             { opacity: 0 }, 
             { opacity: 1, duration: 1.5, ease: 'power2.out',
               scrollTrigger: {
                 trigger: panel,
                 start: 'top 50%',
                 toggleActions: 'play none none reverse'
               }
             }
           );
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="history-scrolly" ref={containerRef}>
      
      {/* ═══ Intro Panel ═══ */}
      <section className="scrolly-panel scrolly-intro">
        <div className="scrolly-bg-wrapper" aria-hidden="true">
          <img src="/images/generated/hero-banner.png" alt="" />
          <div className="scrolly-bg-overlay" />
          <div className="scrolly-grain" />
        </div>
        
        <div className="scrolly-content">
          <span className="scrolly-intro__kicker">Sử Ký AI — Hành trình ngàn năm</span>
          <h1 className="scrolly-intro__title">
            Lịch Sử Việt Nam<br />
            <span className="scrolly-intro__accent">Bằng Hình &amp; Chuyện Kể</span>
          </h1>
          <p className="scrolly-intro__desc">
            Cuộn để trải nghiệm hành trình dựng nước và giữ nước của dân tộc Việt Nam,
            qua từng thời kỳ lịch sử. Không còn giới hạn khung hình, hãy để câu chuyện dẫn lối.
          </p>
        </div>
      </section>

      {/* ═══ Era Panels ═══ */}
      {eras.map((era, i) => {
        const events = getEventsByEra(era.slug);
        const img = eraTimelineImages[era.id] || era.coverImage;
        const highlight = eraHighlights[era.id] || '';

        return (
          <section className="scrolly-panel scrolly-era" key={era.id} id={`era-${era.slug}`}>
            
            <div className="scrolly-bg-wrapper" aria-hidden="true">
              <img src={img} alt="" loading="lazy" />
              <div className="scrolly-bg-overlay" />
              <div className="scrolly-grain" />
            </div>

            <div className="scrolly-content">
              <div className="scrolly-era__year-big" aria-hidden="true">
                {era.yearRange?.split(/\s*[-–—]\s*/)[0] || ''}
              </div>

              <span className="scrolly-era__kicker">
                Thời kỳ {String(i + 1).padStart(2, '0')} / {String(eras.length).padStart(2, '0')}
              </span>

              <h2 className="scrolly-era__title">{era.name}</h2>

              <p className="scrolly-era__period">{era.yearRange}</p>

              <p className="scrolly-era__desc">{era.summary}</p>

              {highlight && <p className="scrolly-era__highlights">{highlight}</p>}

              <div className="scrolly-era__divider" aria-hidden="true" />

              {events.length > 0 && (
                <div className="scrolly-era__events">
                  <h3 className="scrolly-era__events-label">Các dấu mốc tiêu biểu</h3>
                  <div className="scrolly-era__events-grid">
                    {/* Native vertical scroll means we can show all events! No need to slice. */}
                    {events.map((event) => (
                      <Link to={`/su-kien/${event.slug}`} className="scrolly-event" key={event.id}>
                        <div className="scrolly-event__image">
                          <img alt="" loading="lazy" src={event.image || '/images/generated/parchment.png'} />
                          <div className="scrolly-event__img-overlay" />
                        </div>
                        <div className="scrolly-event__body">
                          <span className="scrolly-event__year">{formatHistoricalYear(event.year)}</span>
                          <h4>{event.title}</h4>
                          <p>{event.excerpt || event.summary}</p>
                          <span className="scrolly-event__read">
                            Đọc câu chuyện
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link to={`/thoi-ky/${era.slug}`} className="scrolly-era__cta">
                <span>Khám phá toàn bộ {era.name}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HistoryScrolly;
