import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CharacterGrid } from './character-card.jsx';
import { InteractiveTimeline } from './interactive-timeline.jsx';
import { ClimaxScene } from './climax-scene.jsx';
import { AftermathSummary } from './aftermath-summary.jsx';
import { HistoricalTakeaway } from './historical-takeaway.jsx';
import { KnowledgeQuiz } from './knowledge-quiz.jsx';
import { StoryProgressIndicator } from './story-progress-indicator.jsx';
import { ReadingProgressBar } from '../story/reading-progress-bar.jsx';
import { formatHistoricalPeriod } from '../../lib/event-queries.js';

gsap.registerPlugin(ScrollTrigger);

const sectionDefs = [
  { id: 'evt-hook', label: 'Mở màn', numeral: 'I', icon: '◉' },
  { id: 'evt-setup', label: 'Bối cảnh', numeral: 'II', icon: '◈' },
  { id: 'evt-rising', label: 'Diễn biến', numeral: 'III', icon: '△' },
  { id: 'evt-climax', label: 'Cao trào', numeral: 'IV', icon: '✦' },
  { id: 'evt-aftermath', label: 'Hệ quả', numeral: 'V', icon: '◇' },
  { id: 'evt-takeaway', label: 'Bài học', numeral: 'VI', icon: '☉' },
];

export const EventDetailStorytelling = ({ event }) => {
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [heroScrolled, setHeroScrolled] = useState(false);

  /* ── Hero entrance animation ── */
  useEffect(() => {
    if (!heroRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo('.evt-hero__era', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo('.evt-hero__title', { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.4 }, '-=0.3')
        .fromTo('.evt-hero__divider', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.7')
        .fromTo('.evt-hero__quote', { y: 30, opacity: 0 }, { y: 0, opacity: 0.85, duration: 0.8 }, '-=0.4')
        .fromTo('.evt-hero__facts > div', { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.7 }, '-=0.4')
        .fromTo('.evt-hero__cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.2');

      /* Parallax on hero image */
      gsap.to('.evt-hero__bg img', {
        scale: 1.25, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });

      /* Vignette intensifies on scroll */
      gsap.to('.evt-hero__vignette', {
        opacity: 0.95,
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: true },
      });

      /* Hero content fades out on scroll */
      gsap.to('.evt-hero__inner', {
        y: -60, opacity: 0,
        scrollTrigger: { trigger: heroRef.current, start: '30% top', end: '70% top', scrub: true },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* ── Section scroll animations ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.evt-section').forEach((section) => {
        const headers = section.querySelectorAll('.evt-section__eyebrow, .evt-section__title, .evt-section__divider');
        gsap.from(headers, {
          y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
        });

        const blocks = section.querySelectorAll('.evt-section__body > *');
        gsap.from(blocks, {
          y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 72%', toggleActions: 'play none none none' },
        });
      });

      gsap.utils.toArray('.evt-section__divider').forEach((div) => {
        gsap.from(div, {
          scaleX: 0, duration: 1, ease: 'power3.inOut',
          scrollTrigger: { trigger: div, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ── Active section tracking ── */
  useEffect(() => {
    const sectionEls = sectionDefs
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          const idx = sectionDefs.findIndex((s) => s.id === visible.target.id);
          if (idx >= 0) setActiveSectionIndex(idx);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sectionEls.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* ── Hero scroll detection ── */
  useEffect(() => {
    const handleScroll = () => {
      setHeroScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, []);

  const beats = event.story?.beats ?? [];
  const hookBeat = beats.find((b) => b.type === 'hook');
  const setupBeat = beats.find((b) => b.type === 'setup');
  const risingBeat = beats.find((b) => b.type === 'rising');
  const climaxBeat = beats.find((b) => b.type === 'climax');
  const fallingBeat = beats.find((b) => b.type === 'falling');
  const takeawayBeat = beats.find((b) => b.type === 'takeaway');

  return (
    <article className="evt-story" ref={containerRef}>
      <ReadingProgressBar />

      {/* ── Story Progress Indicator (desktop side) ── */}
      <StoryProgressIndicator sections={sectionDefs} />

      {/* ═══════════════════════════════════════
          1. HOOK — Full-screen Cinematic Hero
          ═══════════════════════════════════════ */}
      <header className="evt-hero" ref={heroRef} id="evt-hook">
        <div className="evt-hero__bg" aria-hidden="true">
          <img alt="" src={event.image ?? '/images/generated/parchment.png'} />
          <div className="evt-hero__vignette" />
          <div className="evt-hero__grain" />
        </div>
        <div className="evt-hero__inner">
          <Link className="evt-hero__back" to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Về trang chủ
          </Link>
          <span className="evt-hero__era">{event.eraSlug?.replaceAll('-', ' ')}</span>
          <h1 className="evt-hero__title">{event.title}</h1>
          <div className="evt-hero__divider" aria-hidden="true" />
          <blockquote className="evt-hero__quote">
            <p>"{event.excerpt}"</p>
          </blockquote>
          <dl className="evt-hero__facts">
            <div>
              <dt>Thời gian</dt>
              <dd>{formatHistoricalPeriod(event)}</dd>
            </div>
            <div>
              <dt>Địa điểm</dt>
              <dd>{event.location ?? 'Chưa rõ'}</dd>
            </div>
            <div>
              <dt>Nhân vật</dt>
              <dd>{(event.actors ?? []).join(', ')}</dd>
            </div>
            {event.opponent && (
              <div>
                <dt>Đối thủ</dt>
                <dd>{event.opponent}</dd>
              </div>
            )}
          </dl>
          <a className="evt-hero__cta" href="#evt-setup">
            <span>Bắt đầu khám phá</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
        {/* Scroll indicator */}
        <div className={`evt-hero__scroll-hint ${heroScrolled ? 'is-hidden' : ''}`} aria-hidden="true">
          <div className="evt-hero__scroll-line" />
        </div>
      </header>

      {/* ── Sticky TOC ── */}
      <nav className="evt-toc" aria-label="Mục lục câu chuyện">
        <div className="evt-toc__track">
          {sectionDefs.map((s, i) => (
            <button
              className={`evt-toc__item ${i === activeSectionIndex ? 'is-active' : ''}`}
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              type="button"
            >
              <span className="evt-toc__numeral">{s.numeral}</span>
              <span className="evt-toc__label">{s.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          2. SETUP — Context & Characters
          ═══════════════════════════════════════ */}
      <section className="evt-section evt-section--light" id="evt-setup">
        <div className="evt-section__shell">
          <div className="evt-section__header">
            <div className="evt-section__eyebrow">
              <span className="evt-section__numeral">II</span>
              <span className="evt-section__eyebrow-text">Bối cảnh</span>
            </div>
            <h2 className="evt-section__title">{setupBeat?.title ?? 'Bối Cảnh'}</h2>
            <div className="evt-section__divider" aria-hidden="true" />
          </div>
          <div className="evt-section__body">
            {setupBeat?.blocks?.filter((b) => b.type === 'text').map((b, i) => (
              <p key={i} className="evt-text-block">{b.body}</p>
            ))}

            {/* Quick Facts */}
            {setupBeat?.blocks?.find((b) => b.type === 'quick-facts') && (() => {
              const qf = setupBeat.blocks.find((b) => b.type === 'quick-facts');
              return (
                <div className="evt-quick-facts">
                  <h4 className="evt-quick-facts__title">{qf.title}</h4>
                  <dl className="evt-quick-facts__grid">
                    {qf.items.map((item, i) => (
                      <div key={i}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })()}

            {/* Character Cards */}
            {event.characters?.length > 0 && (
              <CharacterGrid characters={event.characters} />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. RISING ACTION — Interactive Timeline
          ═══════════════════════════════════════ */}
      <section className="evt-section evt-section--dark" id="evt-rising">
        <div className="evt-section__shell">
          <div className="evt-section__header">
            <div className="evt-section__eyebrow">
              <span className="evt-section__numeral">III</span>
              <span className="evt-section__eyebrow-text">Diễn biến</span>
            </div>
            <h2 className="evt-section__title">{risingBeat?.title ?? 'Diễn Biến'}</h2>
            <div className="evt-section__divider" aria-hidden="true" />
          </div>
          <div className="evt-section__body">
            {risingBeat?.blocks?.filter((b) => b.type === 'text').map((b, i) => (
              <p key={i} className="evt-text-block">{b.body}</p>
            ))}

            {/* Interactive Timeline */}
            {event.timeline?.length > 0 && (
              <InteractiveTimeline milestones={event.timeline} />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. CLIMAX — WOW Moment
          ═══════════════════════════════════════ */}
      <section className="evt-section evt-section--climax" id="evt-climax">
        <div className="evt-section__shell evt-section__shell--wide">
          <div className="evt-section__header">
            <div className="evt-section__eyebrow">
              <span className="evt-section__numeral">IV</span>
              <span className="evt-section__eyebrow-text">Cao trào</span>
            </div>
            <h2 className="evt-section__title">{climaxBeat?.title ?? 'Cao Trào'}</h2>
            <div className="evt-section__divider" aria-hidden="true" />
          </div>
          <div className="evt-section__body">
            {climaxBeat?.blocks?.filter((b) => b.type === 'text').map((b, i) => (
              <p key={i} className="evt-text-block">{b.body}</p>
            ))}

            {/* Climax Interactive Scene */}
            {event.climaxScene && (
              <ClimaxScene scene={event.climaxScene} />
            )}

            {/* Climax quote */}
            {climaxBeat?.blocks?.find((b) => b.type === 'quote') && (() => {
              const q = climaxBeat.blocks.find((b) => b.type === 'quote');
              return (
                <blockquote className="evt-climax-quote">
                  <p>"{q.quote}"</p>
                  {q.source && <cite>— {q.source}</cite>}
                </blockquote>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. AFTERMATH
          ═══════════════════════════════════════ */}
      <section className="evt-section evt-section--light" id="evt-aftermath">
        <div className="evt-section__shell">
          <div className="evt-section__header">
            <div className="evt-section__eyebrow">
              <span className="evt-section__numeral">V</span>
              <span className="evt-section__eyebrow-text">Hệ quả</span>
            </div>
            <h2 className="evt-section__title">{fallingBeat?.title ?? 'Hệ Quả'}</h2>
            <div className="evt-section__divider" aria-hidden="true" />
          </div>
          <div className="evt-section__body">
            {fallingBeat?.blocks?.filter((b) => b.type === 'text').map((b, i) => (
              <p key={i} className="evt-text-block">{b.body}</p>
            ))}

            {event.aftermath && (
              <AftermathSummary aftermath={event.aftermath} />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. TAKEAWAY — Summary + Quiz
          ═══════════════════════════════════════ */}
      <section className="evt-section evt-section--dark" id="evt-takeaway">
        <div className="evt-section__shell">
          <div className="evt-section__header">
            <div className="evt-section__eyebrow">
              <span className="evt-section__numeral">VI</span>
              <span className="evt-section__eyebrow-text">Bài học</span>
            </div>
            <h2 className="evt-section__title">{takeawayBeat?.title ?? 'Bài Học'}</h2>
            <div className="evt-section__divider" aria-hidden="true" />
          </div>
          <div className="evt-section__body">
            {event.takeaway && (
              <HistoricalTakeaway takeaway={event.takeaway} />
            )}

            {event.quiz?.length > 0 && (
              <KnowledgeQuiz questions={event.quiz} />
            )}

            {/* End CTA */}
            <div className="evt-end-cta">
              <span className="evt-end-cta__ornament" aria-hidden="true">✦</span>
              <p className="evt-end-cta__text">Kết thúc câu chuyện</p>
              <Link to="/" className="evt-end-cta__link">Khám phá thêm câu chuyện lịch sử →</Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default EventDetailStorytelling;
