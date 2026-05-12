import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatHistoricalYear } from '../../lib/event-queries.js';
import { getRenderableBlocks } from '../../lib/story-constraints.js';
import { useBlockRenderer } from '../../hooks/use-block-renderer.jsx';
import { EventMetaPanel } from '../meta/event-meta-panel.jsx';
import { ReadingProgressBar } from './reading-progress-bar.jsx';

gsap.registerPlugin(ScrollTrigger);

const beatLabels = {
  hook: { label: 'Hồi mở màn', numeral: 'I', icon: '◉' },
  setup: { label: 'Hồi đặt cảnh', numeral: 'II', icon: '◈' },
  rising: { label: 'Hồi căng lên', numeral: 'III', icon: '△' },
  climax: { label: 'Hồi quyết định', numeral: 'IV', icon: '✦' },
  falling: { label: 'Hồi lắng lại', numeral: 'V', icon: '◇' },
  takeaway: { label: 'Hồi còn lại', numeral: 'VI', icon: '☉' },
};

export const StorytellingRenderer = ({ event }) => {
  const [activeBeat, setActiveBeat] = useState(event.story.beats[0]?.type ?? 'hook');
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  /* ── Hero entrance animation ── */
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo('.st-hero__era', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo('.st-hero__title', { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.4 }, '-=0.3')
        .fromTo('.st-hero__divider', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.7')
        .fromTo('.st-hero__excerpt', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
        .fromTo('.st-hero__facts > div', { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.7 }, '-=0.4')
        .fromTo('.st-hero__start', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.2');

      /* Hero parallax zoom on scroll */
      gsap.to('.st-hero__bg img', {
        scale: 1.25, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });

      gsap.to('.st-hero__vignette', {
        opacity: 0.85,
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: true },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Beat scroll animations ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* Cinematic beat entrance */
      gsap.utils.toArray('.st-beat').forEach((beat) => {
        /* Eyebrow + title entrance */
        const header = beat.querySelectorAll('.st-beat__eyebrow, .st-beat__title');
        gsap.from(header, {
          y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: beat, start: 'top 85%', toggleActions: 'play none none none' },
        });

        /* Content blocks staggered reveal */
        const blocks = beat.querySelectorAll('.st-beat__content > *');
        gsap.from(blocks, {
          y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: beat, start: 'top 72%', toggleActions: 'play none none none' },
        });
      });

      /* Image parallax in beats */
      gsap.utils.toArray('.st-beat__image-zone img').forEach((img) => {
        gsap.fromTo(img,
          { yPercent: -8 },
          {
            yPercent: 8, ease: 'none',
            scrollTrigger: { trigger: img.closest('.st-beat__image-zone'), start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          });
      });

      /* Full-bleed image reveals with clip-path */
      gsap.utils.toArray('.st-beat__image-zone').forEach((zone) => {
        gsap.from(zone, {
          clipPath: 'inset(12% 8% 12% 8%)',
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: zone, start: 'top 82%', toggleActions: 'play none none none' },
        });
      });

      /* Rail numbers dramatic entrance */
      gsap.utils.toArray('.st-beat__rail-num').forEach((num) => {
        gsap.from(num, {
          y: 100, opacity: 0, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: num, start: 'top 95%', toggleActions: 'play none none none' },
        });
      });

      /* Dividers wipe in */
      gsap.utils.toArray('.st-beat__divider').forEach((div) => {
        gsap.from(div, {
          scaleX: 0, duration: 1, ease: 'power3.inOut',
          scrollTrigger: { trigger: div, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });

      /* Quote blocks entrance */
      gsap.utils.toArray('.quote-block').forEach((q) => {
        gsap.from(q, {
          x: -40, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: q, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });

      /* Image blocks — reveal from bottom */
      gsap.utils.toArray('.image-block').forEach((img) => {
        gsap.from(img, {
          y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: img, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [event.story.beats]);

  /* ── Active beat tracking for sticky nav ── */
  useEffect(() => {
    const sections = event.story.beats
      .map((b) => document.getElementById(`st-beat-${b.type}`))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) setActiveBeat(visible.target.id.replace('st-beat-', ''));
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [event.story.beats]);

  /* ── Spatial Narrative (Map Pan/Zoom) & Mood Sync ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const mapImage = document.querySelector('.st-map-image');
      const mapOverlay = document.querySelector('.st-map-overlay');

      const beatMapTransforms = {
        hook: { scale: 1.05, xPercent: 0, yPercent: 0 },
        setup: { scale: 1.3, xPercent: -5, yPercent: -5 },
        rising: { scale: 1.6, xPercent: 8, yPercent: 5 },
        climax: { scale: 2.1, xPercent: -12, yPercent: 12 },
        falling: { scale: 1.4, xPercent: 5, yPercent: -8 },
        takeaway: { scale: 1.1, xPercent: 0, yPercent: 0 },
      };

      gsap.utils.toArray('.st-beat').forEach((beat) => {
        const mood = beat.dataset.mood || 'light';
        const type = beat.id.replace('st-beat-', '');
        const transform = beatMapTransforms[type] || beatMapTransforms.hook;

        // Colors have 85% opacity to let the map bleed through
        const colorMap = {
          dark: 'rgba(10, 10, 10, 0.88)',
          light: 'rgba(235, 230, 215, 0.92)',
          intense: 'rgba(43, 17, 17, 0.88)',
          golden: 'rgba(38, 33, 18, 0.88)',
        };

        ScrollTrigger.create({
          trigger: beat,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => applySpatialShift(colorMap[mood], transform),
          onEnterBack: () => applySpatialShift(colorMap[mood], transform),
        });
      });

      function applySpatialShift(overlayColor, transform) {
        // Shift mood tint
        gsap.to(mapOverlay, { backgroundColor: overlayColor, duration: 1.5, ease: 'power2.inOut' });
        
        // Pan and Zoom the map
        if (mapImage) {
          gsap.to(mapImage, { 
            scale: transform.scale, 
            xPercent: transform.xPercent, 
            yPercent: transform.yPercent, 
            duration: 3, 
            ease: 'power2.inOut',
            overwrite: 'auto'
          });
        }
      }
    }, containerRef);
    return () => ctx.revert();
  }, [event.story.beats]);

  /* ── Sticky TOC click handler ── */
  const handleBeatClick = useCallback((beatType) => {
    const el = document.getElementById(`st-beat-${beatType}`);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, []);

  return (
    <article className="st-renderer" ref={containerRef}>
      {/* ── Option A: Fixed Map Viewport ── */}
      <div className="st-map-viewport" aria-hidden="true">
        {/* We use the event hero image as the "Map" if no specific map is available */}
        <img className="st-map-image" alt="" src={event.image ?? event.fallbackImage ?? '/images/generated/hero-banner.png'} />
        <div className="st-map-overlay" />
      </div>

      <ReadingProgressBar />

      {/* ── Full-screen Hero ── */}
      <header className="st-hero section-dark" ref={heroRef}>
        <div className="st-hero__bg" aria-hidden="true">
          <img alt="" src={event.image ?? event.fallbackImage ?? '/images/generated/hero-banner.png'} />
          <div className="st-hero__vignette" />
        </div>
        <div className="st-hero__inner">
          <Link className="st-hero__back" to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Về trang chủ
          </Link>
          <span className="st-hero__era">{event.eraSlug}</span>
          <h1 className="st-hero__title">{event.title}</h1>
          <div className="st-hero__divider" aria-hidden="true" />
          <p className="st-hero__excerpt">{event.excerpt}</p>
          <dl className="st-hero__facts">
            <div>
              <dt>Năm</dt>
              <dd>{formatHistoricalYear(event.year)}</dd>
            </div>
            <div>
              <dt>Địa điểm</dt>
              <dd>{event.location ?? 'Chưa rõ'}</dd>
            </div>
            <div>
              <dt>Nhân vật</dt>
              <dd>{(event.actors ?? []).join(', ') || 'Cộng đồng đương thời'}</dd>
            </div>
          </dl>
          <a className="st-hero__start btn-hero btn-hero--primary" href="#st-beat-hook">
            <span>Bắt đầu đọc</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </a>
        </div>
      </header>

      {/* ── Sticky Table of Contents ── */}
      <StickyBeatNav activeBeat={activeBeat} beats={event.story.beats} onSelect={handleBeatClick} />

      {/* ── Beat Sections ── */}
      {event.story.beats.map((beat, index) => (
        <StorytellingBeat beat={beat} event={event} index={index} key={beat.type} totalBeats={event.story.beats.length} />
      ))}

      {/* ── End Mark ── */}
      <div className="st-endmark section-dark">
        <div className="st-endmark__inner">
          <span className="st-endmark__ornament" aria-hidden="true">✦</span>
          <p>Kết thúc câu chuyện</p>
          <Link to="/" className="st-endmark__link">Khám phá thêm câu chuyện lịch sử</Link>
        </div>
      </div>
    </article>
  );
};

/* ── Sticky Beat Navigation ── */
const StickyBeatNav = ({ activeBeat, beats, onSelect }) => (
  <nav className="st-toc section-dark" aria-label="Mục lục câu chuyện">
    <div className="st-toc__track">
      {beats.map((beat) => {
        const info = beatLabels[beat.type] ?? { label: beat.title, numeral: '—' };
        const isActive = beat.type === activeBeat;
        return (
          <button
            className={`st-toc__item ${isActive ? 'is-active' : ''}`}
            key={beat.type}
            onClick={() => onSelect(beat.type)}
            type="button"
          >
            <span className="st-toc__numeral">{info.numeral}</span>
            <span className="st-toc__label">{info.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

/* ── Single Beat Section ── */
const StorytellingBeat = ({ beat, event, index, totalBeats }) => {
  const renderBlock = useBlockRenderer(event);
  const renderableBlocks = getRenderableBlocks(beat, event);
  const hasMetaOverride = renderableBlocks.some((b) => b.type === 'event-meta');
  const isSetup = beat.type === 'setup';
  const isDark = beat.type === 'climax' || beat.type === 'takeaway';
  const label = beatLabels[beat.type] ?? { label: 'Hồi kể chuyện', numeral: '—', icon: '◉' };

  /* Separate image blocks for the hero zone vs. inline content */
  const firstImage = renderableBlocks.find((b) => b.type === 'image');
  const hasHeroImage = !!firstImage && (beat.type === 'hook' || beat.type === 'rising' || beat.type === 'falling');
  const contentBlocks = hasHeroImage
    ? renderableBlocks.filter((b) => b !== firstImage)
    : renderableBlocks;

  return (
    <section
      className={`st-beat ${isDark ? 'st-beat--dark section-dark' : 'st-beat--light'}`}
      id={`st-beat-${beat.type}`}
    >
      {/* Full-width hero image zone for select beats */}
      {hasHeroImage && (
        <div className="st-beat__image-zone">
          <img
            alt={firstImage.alt ?? firstImage.caption ?? ''}
            loading="lazy"
            src={firstImage.image ?? firstImage.fallbackImage}
          />
          <div className="st-beat__image-overlay" aria-hidden="true" />
          {firstImage.caption && (
            <span className="st-beat__image-caption">{firstImage.caption}</span>
          )}
        </div>
      )}

      <div className="st-beat__shell">
        <aside className="st-beat__rail" aria-hidden="true">
          <span className="st-beat__rail-num">{String(index + 1).padStart(2, '0')}</span>
          <div className="st-beat__rail-line" />
        </aside>
        <div className="st-beat__inner">
          <div className="st-beat__eyebrow">
            <span className="st-beat__numeral">{label.numeral}</span>
            <span className="st-beat__eyebrow-text">{label.label}</span>
          </div>
          <h2 className="st-beat__title">{beat.title}</h2>
          <div className="st-beat__divider" aria-hidden="true" />
          {isSetup && !hasMetaOverride && <EventMetaPanel event={event} />}
          <div className="st-beat__content">
            {contentBlocks.map(renderBlock)}
          </div>
        </div>
      </div>

      {/* Beat transition ornament */}
      {index < totalBeats - 1 && (
        <div className="st-beat__transition" aria-hidden="true">
          <span className="st-beat__transition-dot" />
          <span className="st-beat__transition-line" />
          <span className="st-beat__transition-dot" />
        </div>
      )}
    </section>
  );
};

export default StorytellingRenderer;
