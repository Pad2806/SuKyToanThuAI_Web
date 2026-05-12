import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 4000, suffix: '+', label: 'Năm lịch sử' },
  { value: 18, suffix: '', label: 'Triều đại' },
  { value: 50, suffix: '+', label: 'Sự kiện quan trọng' },
  { value: 6, suffix: '', label: 'Hồi kể chuyện' },
];

export const StatsBanner = () => {
  const sectionRef = useRef(null);
  const counterRefs = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo('.stats-banner__item',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }

      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].value;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: reduced ? 0 : 2.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          onUpdate: () => {
            if (el) el.textContent = Math.round(obj.val).toLocaleString('vi-VN') + stats[i].suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="stats-banner" ref={sectionRef}>
      <div className="stats-banner__inner">
        {stats.map((stat, i) => (
          <div className="stats-banner__item" key={stat.label}>
            <span
              className="stats-banner__value"
              ref={(el) => { counterRefs.current[i] = el; }}
            >
              0
            </span>
            <span className="stats-banner__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBanner;
