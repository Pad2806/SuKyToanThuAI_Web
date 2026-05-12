import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroSlides = [
  {
    image: '/images/generated/hero-banner.png',
    tagline: 'Hành trình ngàn năm',
    heading: 'Lịch sử Việt Nam',
    sub: 'qua từng câu chuyện sống động',
  },
  {
    image: '/images/generated/bach-dang.png',
    tagline: 'Chiến công hiển hách',
    heading: 'Những trận đánh',
    sub: 'thay đổi vận mệnh dân tộc',
  },
  {
    image: '/images/generated/hai-ba-trung.png',
    tagline: 'Tinh thần bất khuất',
    heading: 'Những con người',
    sub: 'viết nên trang sử vẻ vang',
  },
];

export const HeroCinematic = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const slide = heroSlides[active];

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current.children,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
      );
    });
    return () => ctx.revert();
  }, [active]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.hero-cinematic__bg-image', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-cinematic" ref={sectionRef} id="hero-cinematic">
      {heroSlides.map((s, i) => (
        <div
          className={`hero-cinematic__bg ${i === active ? 'is-active' : ''}`}
          key={i}
          aria-hidden="true"
        >
          <img className="hero-cinematic__bg-image" alt="" src={s.image} />
        </div>
      ))}
      <div className="hero-cinematic__vignette" aria-hidden="true" />
      <div className="hero-cinematic__grain" aria-hidden="true" />

      <div className="hero-cinematic__content" ref={titleRef}>
        <span className="hero-cinematic__kicker">{slide.tagline}</span>
        <h1 className="hero-cinematic__title">
          {slide.heading}
          <br />
          <span className="hero-cinematic__title-accent">{slide.sub}</span>
        </h1>
        <p className="hero-cinematic__desc">
          Khám phá hành trình dựng nước và giữ nước của dân tộc Việt Nam qua các thời kỳ,
          từ thời Vua Hùng đến hiện đại — kể bằng câu chuyện, hình ảnh và dữ liệu.
        </p>
      </div>

      <div className="hero-cinematic__bottom">
        <div className="hero-cinematic__actions">
          <Link to="/thoi-ky/van-lang-au-lac" className="btn-hero btn-hero--primary">
            <span>Khám phá ngay</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#dong-chay" className="btn-hero btn-hero--ghost">
            <span>Dòng thời gian</span>
          </a>
        </div>
        <div className="hero-cinematic__slider-dots" aria-label="Chuyển slide">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="hero-cinematic__scroll-cue" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-mouse__wheel" />
        </div>
        <span>Cuộn để khám phá</span>
      </div>
    </section>
  );
};

export default HeroCinematic;
