import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const moodColors = {
  tense: '#c9a84c',
  rising: '#d4a843',
  preparation: '#4a8c5c',
  tension: '#b85c2f',
  climax: '#d4443e',
  victory: '#c9a84c',
};

const moodLabels = {
  tense: 'Không khí căng thẳng, hai bên bắt đầu áp sát chiến trường.',
  rising: 'Cục diện xoay chuyển, áp lực chiến lược dồn lên đối phương.',
  preparation: 'Giai đoạn chuẩn bị then chốt cho đòn quyết định.',
  tension: 'Thời cơ được kéo căng trước khi bẫy chính khép lại.',
  climax: 'Điểm bùng nổ của toàn bộ diễn biến.',
  victory: 'Kết quả trận đánh được định đoạt.',
};

const formatDate = (milestone) => {
  if (milestone.date) return milestone.date;
  if (milestone.year && milestone.month) return `${milestone.month}/${milestone.year}`;
  return milestone.year || milestone.month || '';
};

const normalizeFact = (fact) => {
  if (!fact) return null;
  if (typeof fact === 'string') return fact;
  if (fact.label && fact.value) return `${fact.label}: ${fact.value}`;
  return fact.value || fact.label || null;
};

const getMilestoneFacts = (milestone) => {
  const explicitFacts = [
    milestone.facts,
    milestone.keyFacts,
    milestone.keyPoints,
    milestone.points,
    milestone.bullets,
  ].find(Array.isArray);

  if (explicitFacts) {
    return explicitFacts.map(normalizeFact).filter(Boolean).slice(0, 4);
  }

  return [
    milestone.year && `Năm: ${milestone.year}`,
    milestone.month && `Mốc: ${milestone.month}`,
    milestone.location && `Địa điểm: ${milestone.location}`,
    milestone.mood && moodLabels[milestone.mood],
  ].filter(Boolean).slice(0, 3);
};

const getMilestoneDescription = (milestone) => {
  const summary = milestone.summary || '';
  const detail = milestone.longDescription || milestone.detail || milestone.description || '';
  if (summary && detail && summary !== detail) return `${summary}\n\n${detail}`;
  return detail || summary || '';
};

const splitTimelineText = (text) => String(text).split(/\n\n|\\n\\n/).filter(Boolean);

const getTimelineMode = () => {
  if (typeof window === 'undefined') return 'horizontal';
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return isMobile || reduced ? 'stacked' : 'horizontal';
};

const TacticalTimeline = ({ milestones, visual }) => (
  <div className="interactive-tl interactive-tl--tactical">
    <div className="interactive-tl__map">
      <img src={visual.mapImage} alt="Bản đồ diễn biến" loading="lazy" />
      <div className="tl-tactical-overlay__radar" aria-hidden="true" />
    </div>
    <div className="interactive-tl__items">
      {milestones.map((milestone, index) => (
        <article className="tl-milestone" key={milestone.id || index}>
          <span className="tl-milestone__date">{formatDate(milestone)}</span>
          <h3>{milestone.title}</h3>
          <p>{milestone.description}</p>
        </article>
      ))}
    </div>
  </div>
);

export const InteractiveTimeline = ({
  milestones,
  introImage = null,
  visual = null,
  scrollContainerRef = null,
}) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timelineMode, setTimelineMode] = useState(getTimelineMode);
  const frames = milestones ?? [];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateTimelineMode = () => setTimelineMode(getTimelineMode());

    updateTimelineMode();
    mobileQuery.addEventListener('change', updateTimelineMode);
    reducedQuery.addEventListener('change', updateTimelineMode);

    return () => {
      mobileQuery.removeEventListener('change', updateTimelineMode);
      reducedQuery.removeEventListener('change', updateTimelineMode);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || frames.length === 0) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    const scrollContainer = scrollContainerRef?.current || section.closest?.('.admin-preview-scroll') || null;
    const scrollTriggerScroller = scrollContainer ? { scroller: scrollContainer } : {};
    setActiveIndex(0);

    const ctx = gsap.context(() => {
      gsap.set(track, { clearProps: 'transform' });

      if (timelineMode === 'stacked') {
        gsap.utils.toArray(section.querySelectorAll('.filmstrip__frame')).forEach((el, index) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.55,
            delay: index * 0.05,
            scrollTrigger: {
              ...scrollTriggerScroller,
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });
        return;
      }

      const getViewportWidth = () => scrollContainer?.clientWidth || window.innerWidth;
      const getTotalScrollWidth = () => Math.max(track.scrollWidth - getViewportWidth(), 1);

      gsap.to(track, {
        x: () => -getTotalScrollWidth(),
        ease: 'none',
        scrollTrigger: {
          ...scrollTriggerScroller,
          id: 'filmstrip-scrub',
          trigger: section,
          start: 'top top',
          end: () => `+=${getTotalScrollWidth()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextIndex = Math.min(
              frames.length - 1,
              Math.floor(self.progress * frames.length),
            );
            setActiveIndex(nextIndex);
          },
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const rafId = window.requestAnimationFrame(refresh);
    const refreshTimeout = window.setTimeout(refresh, 250);
    const pendingImages = Array.from(section.querySelectorAll('img')).filter((image) => !image.complete);
    pendingImages.forEach((image) => image.addEventListener('load', refresh, { once: true }));

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(refreshTimeout);
      pendingImages.forEach((image) => image.removeEventListener('load', refresh));
      ctx.revert();
      gsap.set(track, { clearProps: 'transform' });
      ScrollTrigger.refresh();
    };
  }, [frames.length, scrollContainerRef, timelineMode]);

  if (!frames.length) return null;
  if (visual?.mapImage) return <TacticalTimeline milestones={frames} visual={visual} />;

  return (
    <div className={`filmstrip filmstrip--${timelineMode}`} ref={sectionRef}>
      <div className="filmstrip__counter" aria-hidden="true">
        <span className="filmstrip__counter-current">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className="filmstrip__counter-sep">/</span>
        <span className="filmstrip__counter-total">
          {String(frames.length).padStart(2, '0')}
        </span>
      </div>

      <div className="filmstrip__progress" aria-hidden="true">
        <div
          className="filmstrip__progress-fill"
          style={{ width: `${((activeIndex + 1) / frames.length) * 100}%` }}
        />
      </div>

      <div className="filmstrip__track" ref={trackRef}>
        {frames.map((milestone, index) => {
          const isActive = index === activeIndex;
          const isPassed = index < activeIndex;
          const image = milestone.image || introImage;
          const accent = moodColors[milestone.mood] ?? 'var(--gold)';
          const facts = getMilestoneFacts(milestone);
          const paragraphs = splitTimelineText(getMilestoneDescription(milestone));

          return (
            <article
              className={[
                'filmstrip__frame',
                isActive && 'filmstrip__frame--active',
                isPassed && 'filmstrip__frame--passed',
              ].filter(Boolean).join(' ')}
              key={milestone.id || index}
              style={{ '--frame-accent': accent }}
            >
              <div className="filmstrip__card filmstrip__card--milestone">
                <div className="filmstrip__bg-image tl-milestone__image">
                  {image && <img src={image} alt={milestone.title} loading="lazy" />}
                  <div className="filmstrip__bg-overlay" />
                </div>

                <div className="filmstrip__overlay-content">
                  <div className="filmstrip__card-header">
                    <span className="filmstrip__num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="filmstrip__date">{formatDate(milestone)}</span>
                  </div>
                  <h3 className="filmstrip__title">{milestone.title}</h3>
                  <div className="filmstrip__detail">
                    {paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>
                  {facts.length > 0 && (
                    <ul className="filmstrip__facts">
                      {facts.map((fact, factIndex) => (
                        <li key={factIndex}>{fact}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="filmstrip__mood-line" aria-hidden="true" style={{ background: accent }} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveTimeline;
