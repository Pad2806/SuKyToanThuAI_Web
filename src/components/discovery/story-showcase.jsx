import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedEvents } from '../../lib/event-queries.js';

gsap.registerPlugin(ScrollTrigger);

const methodSteps = [
  { num: '01', title: 'Khoảnh khắc', desc: 'Bạn đứng giữa chiến trường. Tiếng trống trận vọng lại. Mọi thứ bắt đầu từ một hình ảnh.' },
  { num: '02', title: 'Bối cảnh', desc: 'Ai đang đối đầu? Thời cuộc ra sao? Những mâu thuẫn nào đã âm ỉ suốt nhiều năm?' },
  { num: '03', title: 'Cao trào', desc: 'Khi mọi áp lực dồn lại — một quyết định, một trận đánh, một lời kêu gọi thay đổi tất cả.' },
  { num: '04', title: 'Bước ngoặt', desc: 'Khoảnh khắc lịch sử đổi chiều. Không ai biết trước — nhưng sau đó, mọi thứ khác đi.' },
  { num: '05', title: 'Hệ quả', desc: 'Biên giới thay đổi, quyền lực chuyển tay, và ký ức dân tộc được ghi thêm một trang.' },
  { num: '06', title: 'Bài học', desc: 'Sự kiện ấy nói gì với chúng ta hôm nay? Lịch sử không chỉ để nhớ — mà để hiểu.' },
];

const showcaseImages = [
  '/images/generated/hung-vuong.png',
  '/images/generated/bach-dang.png',
  '/images/generated/hai-ba-trung.png',
];

export const StoryShowcase = () => {
  const sectionRef = useRef(null);
  const [sample] = getFeaturedEvents(1);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.story-showcase__visual',
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo('.story-showcase__copy > *',
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      const steps = gsap.utils.toArray('.method-step');
      if (steps.length) {
        gsap.fromTo(steps,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: steps[0]?.parentElement || sectionRef.current, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="story-showcase section-dark" ref={sectionRef}>
      <div className="discovery-inner story-showcase__grid">
        <div className="story-showcase__visual">
          <div className="story-showcase__collage">
            {showcaseImages.map((src, i) => (
              <img
                key={i}
                alt=""
                loading="lazy"
                src={src}
                className={`story-showcase__collage-img story-showcase__collage-img--${i + 1}`}
              />
            ))}
          </div>
          <div className="story-showcase__frame" aria-hidden="true" />
          <div className="story-showcase__badge">
            <span>6</span>
            <small>Hồi kể</small>
          </div>
        </div>

        <div className="story-showcase__copy">
          <p className="section-kicker">Cách chúng tôi kể chuyện</p>
          <h2>Không phải bài học — mà là một hành trình</h2>
          <p className="section-lead">
            Mỗi sự kiện được kể như một bộ phim tài liệu:
            bạn sẽ đi từ khoảnh khắc mở đầu, qua cao trào, đến bài học cuối cùng.
            Không có bảng niên biểu khô khan — chỉ có mạch cảm xúc và sự thật lịch sử.
          </p>

          <div className="story-showcase__steps">
            {methodSteps.map((step) => (
              <article className="method-step" key={step.num}>
                <span className="method-step__num">{step.num}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {sample && (
            <Link className="btn-hero btn-hero--primary" to={`/su-kien/${sample.slug}`}>
              <span>Thử đọc một câu chuyện</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoryShowcase;
