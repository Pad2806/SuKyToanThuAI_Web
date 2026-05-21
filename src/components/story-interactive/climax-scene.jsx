import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const getTooltipPlacement = (hotspot) => {
  const isRightEdge = hotspot.x > 68;
  const isLeftEdge = hotspot.x < 32;
  const isLowerHalf = hotspot.y > 50;

  return {
    left: isRightEdge ? 'auto' : `${hotspot.x}%`,
    right: isRightEdge ? `${100 - hotspot.x}%` : 'auto',
    top: isLowerHalf ? 'auto' : `${Math.min(hotspot.y + 7, 78)}%`,
    bottom: isLowerHalf ? `${Math.min(100 - hotspot.y + 7, 78)}%` : 'auto',
    transform: isLeftEdge || isRightEdge ? 'none' : 'translateX(-50%)',
  };
};

export const ClimaxScene = ({ scene }) => {
  const [activePhase, setActivePhase] = useState(0);
  const containerRef = useRef(null);
  const phases = scene?.phases ?? [];

  useEffect(() => {
    if (!containerRef.current || phases.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.climax-block').forEach((block, index) => {
        ScrollTrigger.create({
          trigger: block,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActivePhase(index),
          onEnterBack: () => setActivePhase(index),
        });

        gsap.fromTo(block, {
          y: 40,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [phases]);

  if (!scene || phases.length === 0) return null;

  return (
    <div className="climax-reveal" ref={containerRef}>
      <div className="climax-reveal__header">
        <h3 className="climax-reveal__title">{scene.title}</h3>
        {(scene.summary || scene.description) && (
          <p className="climax-reveal__lead">{scene.summary || scene.description}</p>
        )}
        {scene.quote && <blockquote className="climax-reveal__quote">{scene.quote}</blockquote>}
        <p className="climax-reveal__subtitle">{phases.length} giai đoạn then chốt</p>
      </div>

      <div className="climax-reveal__phases">
        {phases.map((phase, index) => {
          const phaseImage = scene.phaseImages?.[index] || scene.backgroundImage;
          const isReverse = index % 2 === 1;

          return (
            <article
              className={[
                'climax-block',
                index === activePhase && 'climax-block--active',
                isReverse && 'climax-block--reverse',
              ].filter(Boolean).join(' ')}
              key={phase.id || index}
            >
              <div className="climax-block__image-panel">
                <div className="climax-block__image-wrapper">
                  {(!phaseImage || phaseImage.includes('generated-climax')) ? (
                    <div className="climax-block__image-placeholder">
                      Cần duyệt ảnh cao trào {index + 1}
                    </div>
                  ) : (
                    <>
                      <img src={phaseImage} alt={phase.label} loading="lazy" />
                      <div className="climax-block__image-overlay" />
                    </>
                  )}
                </div>
              </div>

              <div className="climax-block__content">
                <div className="climax-block__header-row">
                  <span className="climax-block__num">{String(index + 1).padStart(2, '0')}</span>
                  <h4 className="climax-block__label">{phase.label}</h4>
                </div>
                <p className="climax-block__summary">{phase.summary}</p>
                <div className="climax-block__body">
                  {(phase.description || '').split(/\n\n|\\n\\n/).map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
                {phase.keyDetail && (
                  <aside className="climax-block__detail">
                    <span className="climax-block__detail-tag">Chi tiết quan trọng</span>
                    <p>{phase.keyDetail}</p>
                  </aside>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export const TacticalMap = ({ scene, fullscreen = false, showHeading = true }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [pinnedHotspot, setPinnedHotspot] = useState(null);
  const hotspots = scene?.hotspots ?? [];
  const currentHotspotId = pinnedHotspot || activeHotspot;
  const currentHotspot = hotspots.find((hotspot) => hotspot.id === currentHotspotId);
  const mapImage = scene?.mapImage || scene?.backgroundImage;

  if (!mapImage || hotspots.length === 0) return null;

  return (
    <div className={`climax-map ${fullscreen ? 'climax-map--fullscreen' : ''}`}>
      {showHeading && <h4 className="climax-map__heading">Bản đồ chiến thuật</h4>}
      <div className="climax-map__viewport">
        <img
          src={mapImage}
          alt={`Bản đồ ${scene.title}`}
          className="climax-map__img"
          width="1600"
          height="1000"
          loading="lazy"
        />
        {hotspots.map((hotspot) => (
          <button
            className={`climax-map__hotspot ${currentHotspotId === hotspot.id ? 'is-active' : ''}`}
            aria-expanded={currentHotspotId === hotspot.id}
            key={hotspot.id}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onClick={() => setPinnedHotspot(pinnedHotspot === hotspot.id ? null : hotspot.id)}
            onMouseEnter={() => setActiveHotspot(hotspot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
            type="button"
            aria-label={hotspot.label}
          >
            <span className="climax-map__pulse" aria-hidden="true" />
            <span className="climax-map__dot" />
            <span className="climax-map__sr-only">
              {hotspot.description} {hotspot.role || hotspot.tacticalRole || ''}
            </span>
          </button>
        ))}

        {currentHotspot && (
          <div
            className="climax-map__tooltip"
            style={getTooltipPlacement(currentHotspot)}
          >
            <strong>{currentHotspot.label}</strong>
            <p>{currentHotspot.description}</p>
            {(currentHotspot.role || currentHotspot.tacticalRole) && (
              <p className="climax-map__role">
                <span>Vai trò:</span> {currentHotspot.role || currentHotspot.tacticalRole}
              </p>
            )}
            <button
              className="climax-map__tooltip-close"
              onClick={(event) => {
                event.stopPropagation();
                setPinnedHotspot(null);
                setActiveHotspot(null);
              }}
              type="button"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimaxScene;
