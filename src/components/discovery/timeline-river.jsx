import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllEras, getEventsByEra } from '../../lib/event-queries.js';
import { TimelineParticles } from './timeline-particles.jsx';

gsap.registerPlugin(ScrollTrigger);

const eraImages = {
  'era-van-lang-au-lac': '/images/generated/hung-vuong.png',
  'era-bac-thuoc': '/images/generated/hai-ba-trung.png',
  'era-dinh-le': '/images/generated/dinh-le-ly.png',
  'era-ly-tran': '/images/generated/ly-tran.png',
  'era-ho-le-so': '/images/generated/le-mac.png',
  'era-nam-bac-trieu': '/images/generated/trinh-nguyen.png',
  'era-nguyen': '/images/generated/nguyen.png',
  'era-hien-dai': '/images/generated/hien-dai.png',
};

const eraShortDescriptions = {
  'era-van-lang-au-lac': 'Buổi đầu dựng nước, nơi truyền thuyết và ký ức cộng đồng cùng mở ra một cội nguồn.',
  'era-bac-thuoc': 'Những thế kỷ thử lửa bản lĩnh tự chủ, khi khát vọng độc lập âm ỉ qua từng cuộc nổi dậy.',
  'era-dinh-le': 'Thời điểm đất nước gom lại quyền lực, dựng nền triều chính và bước vào kỷ nguyên tự chủ.',
  'era-ly-tran': 'Một giai đoạn rực rỡ của văn hiến, quân sự và tinh thần Đại Việt trước các thử thách lớn.',
  'era-ho-le-so': 'Những cải cách, biến động và phục hưng định hình lại trật tự quốc gia sau chiến tranh.',
  'era-nam-bac-trieu': 'Đất nước phân tranh, nhưng văn hóa, thương mại và lãnh thổ vẫn tiếp tục chuyển động.',
  'era-nguyen': 'Triều đại cuối cùng mở rộng cương vực, rồi đối diện làn sóng biến động từ thế giới hiện đại.',
  'era-hien-dai': 'Từ đấu tranh giành độc lập đến xây dựng đất nước, lịch sử bước vào nhịp sống mới.',
};

export const TimelineRiver = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const eras = getAllEras();

  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* Background map slow parallax */
      gsap.to('.timeline-river__bg img', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      /* Header entrance — staggered with dramatic clip reveal */
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.timeline-river__header',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      headerTl
        .from('.timeline-river__header .section-kicker', {
          y: 30, opacity: 0, duration: 0.6, ease: 'power3.out',
        })
        .from('.timeline-river__header h2', {
          y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)',
          duration: 1, ease: 'power4.out',
        }, '-=0.3')
        .to('.timeline-river__header h2', {
          clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut',
        }, '<')
        .from('.timeline-river__header .section-lead', {
          y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
        }, '-=0.4');

      /* Timeline line fill */
      gsap.to('.timeline-river__line-fill', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        },
      });

      /* Era blocks — dramatic entrance */
      gsap.utils.toArray('.timeline-era-block').forEach((block, i) => {
        const card = block.querySelector('.timeline-era-block__motion');
        const dot = block.querySelector('.timeline-era-block__dot');
        const isLeft = i % 2 === 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        /* Dot bursts in */
        tl.from(dot, {
          scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)',
        });

        tl.from(card, {
          x: isLeft ? -96 : 96,
          y: 18,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        }, '-=0.3');
      });

      /* Card image parallax */
      gsap.utils.toArray('.timeline-era-block__image img').forEach((img) => {
        gsap.to(img, {
          yPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="timeline-river section-dark" id="dong-chay" ref={containerRef}>
      <div className="timeline-river__bg" aria-hidden="true">
        <img alt="" src="/images/generated/parchment.png" />
      </div>
      <TimelineParticles containerRef={containerRef} />
      <div className="timeline-river__rule timeline-river__rule--top" aria-hidden="true" />

      <div className="timeline-river__header discovery-inner">
        <p className="section-kicker">Dòng chảy lịch sử</p>
        <h2>Hành trình ngàn năm dựng nước và giữ nước</h2>
        <p className="section-lead">
          Tám thời kỳ lịch sử — từ buổi bình minh của nền Văn Lang đến Việt Nam hiện đại,
          mỗi giai đoạn mang theo những bài học và nhân vật không thể nào quên.
        </p>
      </div>

      <div className="timeline-river__track" ref={trackRef}>
        <div className="timeline-river__line" aria-hidden="true">
          <div className="timeline-river__line-fill" />
        </div>

        {eras.map((era, i) => {
          const events = getEventsByEra(era.slug);
          const img = eraImages[era.id] || era.coverImage;
          const shortDescription = eraShortDescriptions[era.id] || era.summary;

          return (
            <article
              className={`timeline-era-block ${i % 2 === 0 ? 'timeline-era-block--left' : 'timeline-era-block--right'}`}
              key={era.id}
            >
              <div className="timeline-era-block__dot" aria-hidden="true">
                <strong>{String(i + 1).padStart(2, '0')}</strong>
                <span>{era.yearRange?.split(' — ')[0] || ''}</span>
              </div>

              <div className="timeline-era-block__motion">
                <div className="timeline-era-block__card">
                  <div className="timeline-era-block__glare" aria-hidden="true" />
                  <div className="timeline-era-block__image">
                    <img alt={`Minh họa ${era.name}`} loading="lazy" src={img} />
                    <div className="timeline-era-block__overlay" />
                    <div className="timeline-era-block__image-copy">
                      <span>{era.yearRange}</span>
                      <strong>{era.name}</strong>
                      <p>{shortDescription}</p>
                    </div>
                    <div className="timeline-era-block__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                  </div>
                  <div className="timeline-era-block__content">
                    <div className="timeline-era-block__meta">
                      <span className="timeline-era-block__years">{era.yearRange}</span>
                      <span>{events.length} dấu mốc</span>
                    </div>
                    <h3>{era.name}</h3>
                    <p>{era.summary}</p>
                    {events.length > 0 && (
                      <ul className="timeline-era-block__events" aria-label={`Dấu mốc tiêu biểu thời kỳ ${era.name}`}>
                        {events.slice(0, 3).map((event) => (
                          <li key={event.id}>
                            <Link to={`/su-kien/${event.slug}`}>
                              <span className="event-year">{event.year < 0 ? `${Math.abs(event.year)} TCN` : event.year}</span>
                              <span>{event.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link to={`/thoi-ky/${era.slug}`} className="timeline-era-block__cta">
                      Khám phá thời kỳ
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="timeline-river__rule timeline-river__rule--bottom" aria-hidden="true" />
    </section>
  );
};

export default TimelineRiver;
