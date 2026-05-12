import React, { useEffect, useMemo, useRef, useState } from 'react';

const beatNotes = {
  climax: 'Khoảnh khắc đổi chiều, nơi lựa chọn của con người gặp thời cơ.',
  falling: 'Những gì còn lại sau biến cố: quyền lực, ký ức và cách nhìn đời sau.',
  hook: 'Một hình ảnh mở màn đủ mạnh để kéo người đọc vào câu chuyện.',
  rising: 'Mâu thuẫn dâng lên, buộc nhân vật và cộng đồng phải chọn cách hành động.',
  setup: 'Đặt lại địa điểm, thời gian, nhân vật và thế lực đang tác động.',
  takeaway: 'Điều sự kiện để lại cho cách hiểu lịch sử hôm nay.',
};

export const ScrollyStage = ({ beats, event }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const stepRefs = useRef([]);
  const activeBeat = beats[activeIndex] ?? beats[0];
  const actors = useMemo(() => (event.actors ?? []).join(', '), [event.actors]);
  const visualStyle = {
    '--scrolly-focus': `${24 + progress * 52}%`,
    '--scrolly-left': `${10 + progress * 58}%`,
    '--scrolly-rotation': `${-8 + progress * 16}deg`,
    '--scrolly-scale': 1.02 + progress * 0.08,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visible?.target?.dataset.index) {
          setActiveIndex(Number(visible.target.dataset.index));
        }
      },
      { rootMargin: '-28% 0px -42% 0px', threshold: [0.2, 0.45, 0.7] },
    );

    stepRefs.current.filter(Boolean).forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [beats]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setProgress(0);
      return undefined;
    }

    let frameId = 0;
    const updateProgress = () => {
      const step = stepRefs.current[activeIndex];
      if (!step) return;
      const rect = step.getBoundingClientRect();
      const range = window.innerHeight + rect.height;
      const nextProgress = 1 - ((rect.bottom + window.innerHeight * 0.12) / range);
      setProgress(Math.min(Math.max(nextProgress, 0), 1));
    };
    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [activeIndex]);

  return (
    <section className="scrolly-stage section-dark wow-effect" aria-label="Bản đồ cảm xúc câu chuyện">
      <div className="scrolly-stage__sticky" style={visualStyle}>
        <div className="scrolly-stage__plate">
          <img alt="" src={event.image ?? event.fallbackImage} />
          <div className="scrolly-stage__ink" aria-hidden="true" />
        </div>
        <div className="scrolly-stage__caption">
          <p className="section-kicker">Bản đồ cảm xúc</p>
          <h2>{activeBeat?.title}</h2>
          <p>{beatNotes[activeBeat?.type] ?? event.excerpt}</p>
          <dl>
            <div>
              <dt>Địa điểm</dt>
              <dd>{event.location ?? 'Chưa rõ'}</dd>
            </div>
            <div>
              <dt>Nhân vật</dt>
              <dd>{actors || 'Cộng đồng đương thời'}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="scrolly-stage__steps">
        {beats.map((beat, index) => (
          <article
            className={index === activeIndex ? 'is-active' : ''}
            data-index={index}
            key={beat.type}
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{beat.title}</h3>
            <p>{beatNotes[beat.type] ?? event.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ScrollyStage;
