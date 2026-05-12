import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatHistoricalYear, getFeaturedEvents } from '../../lib/event-queries.js';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedCarousel = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const featured = getFeaturedEvents();

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.featured-carousel__header > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      const cards = gsap.utils.toArray('.featured-card');
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: trackRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="featured-carousel section-dark" ref={sectionRef}>
      <div className="discovery-inner">
        <div className="featured-carousel__header">
          <p className="section-kicker">Câu chuyện nổi bật</p>
          <h2>Những khoảnh khắc làm thay đổi lịch sử</h2>
          <p className="section-lead">
            Mỗi sự kiện dưới đây là một bước ngoặt — nơi số phận dân tộc
            được quyết định bởi một trận đánh, một lời tuyên bố, hay một cuộc nổi dậy.
          </p>
        </div>

        <div className="featured-carousel__track" ref={trackRef}>
          {featured.map((event, i) => {
            const cardImages = {
              'event-hung-vuong': '/images/generated/hung-vuong.png',
              'event-co-loa': '/images/generated/co-loa.png',
              'event-hai-ba-trung': '/images/generated/hai-ba-trung.png',
              'event-bach-dang': '/images/generated/bach-dang.png',
            };
            const imgSrc = cardImages[event.id] || event.image || '/images/generated/parchment.png';

            return (
              <Link
                to={`/su-kien/${event.slug}`}
                className={`featured-card ${hoveredIndex !== null && hoveredIndex !== i ? 'is-dimmed' : ''}`}
                key={event.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="featured-card__image">
                  <img
                    alt={`Minh họa ${event.title}`}
                    loading="lazy"
                    src={imgSrc}
                  />
                  <div className="featured-card__overlay" />
                  <span className="featured-card__number">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="featured-card__body">
                  <div className="featured-card__meta">
                    <span className="featured-card__year">{formatHistoricalYear(event.year)}</span>
                    {event.location && <span className="featured-card__location">{event.location}</span>}
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.excerpt}</p>
                  <span className="featured-card__cta">
                    Đọc câu chuyện
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
