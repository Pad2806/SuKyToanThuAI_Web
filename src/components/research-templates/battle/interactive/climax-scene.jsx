import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveImageUrl } from '../../../../lib/fallback-image.js';

gsap.registerPlugin(ScrollTrigger);

export const ClimaxScene = ({ scene }) => {
  const phases = Array.isArray(scene?.phases) ? scene.phases.filter(Boolean) : [];
  const hotspots = Array.isArray(scene?.hotspots) ? scene.hotspots : [];
  const fallbackImage = resolveImageUrl(scene?.backgroundImage, scene?.title);
  const [activePhase, setActivePhase] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  /* ── Scroll-triggered entrance ── */
  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.climax-scene__viewport', {
        scale: 0.92, opacity: 0, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', toggleActions: 'play none none none' },
      });
      gsap.from('.climax-scene__phases', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 60%', toggleActions: 'play none none none' },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ── Phase transition animation ── */
  const handlePhaseChange = useCallback((index) => {
    if (index === activePhase || transitioning) return;
    setTransitioning(true);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setActivePhase(index);
      setActiveHotspot(null);
      setTransitioning(false);
      return;
    }

    const img = imageRef.current;
    if (img) {
      gsap.to(img, {
        opacity: 0, scale: 1.05, duration: 0.4, ease: 'power2.in',
        onComplete: () => {
          setActivePhase(index);
          setActiveHotspot(null);
          gsap.fromTo(img,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', onComplete: () => setTransitioning(false) },
          );
        },
      });
    } else {
      setActivePhase(index);
      setActiveHotspot(null);
      setTransitioning(false);
    }
  }, [activePhase, transitioning]);

  if (!phases.length) return null;

  const currentPhase = phases[activePhase] ?? phases[0];
  const phaseImage = resolveImageUrl(currentPhase?.image, currentPhase?.label) || fallbackImage;
  const mapImage = resolveImageUrl(scene?.backgroundImage, scene?.title) || phaseImage || fallbackImage;

  return (
    <div className="climax-scene wow-effect" ref={containerRef}>
      <h3 className="climax-scene__title">{scene.title}</h3>

      {/* ── Cinematic Image Viewport ── */}
      <div className="climax-scene__viewport">
        <div className="climax-scene__img-wrap" ref={imageRef}>
          <img
            src={phaseImage}
            alt={currentPhase?.label ?? 'Minh họa trận chiến'}
            className="climax-scene__img"
          />
          {/* Vignette overlay */}
          <div className="climax-scene__vignette" aria-hidden="true" />
          {/* Phase label overlay */}
          <div className="climax-scene__phase-overlay" aria-hidden="true">
            <span className="climax-scene__phase-num">{String(activePhase + 1).padStart(2, '0')}</span>
            <span className="climax-scene__phase-name">{currentPhase?.label}</span>
          </div>
        </div>
      </div>

      {/* ── Phase Navigation ── */}
      <div className="climax-scene__phases">
        {phases.map((phase, i) => (
          <button
            className={`climax-phase-btn ${i === activePhase ? 'is-active' : ''}`}
            key={phase.id || phase.label || i}
            onClick={() => handlePhaseChange(i)}
            type="button"
            disabled={transitioning}
          >
            <span className="climax-phase-btn__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="climax-phase-btn__label">{phase.label}</span>
          </button>
        ))}
      </div>

      {/* ── Phase Detail Content ── */}
      <div className="climax-scene__phase-content" key={currentPhase.id || currentPhase.label}>
        <p className="climax-scene__phase-summary">{currentPhase.summary}</p>
        <div className="climax-scene__phase-body">
          {(currentPhase.description || currentPhase.summary || '').split('\\n\\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {currentPhase.keyDetail && (
          <aside className="climax-scene__key-detail">
            <span className="climax-scene__key-detail-label">Chi tiết quan trọng</span>
            <p>{currentPhase.keyDetail}</p>
          </aside>
        )}
      </div>

      {/* ── Tactical Map with Hotspots ── */}
      <div className="climax-scene__map-container">
        <div className="climax-scene__map">
          <img src={mapImage} alt={`Bản đồ ${scene.title}`} className="climax-scene__map-img" />
          {hotspots.map((hs) => (
            <button
              className={`climax-hotspot ${activeHotspot === hs.id ? 'is-active' : ''}`}
              key={hs.id}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
              type="button"
              aria-label={hs.label}
            >
              <span className="climax-hotspot__pulse" aria-hidden="true" />
              <span className="climax-hotspot__dot" />
            </button>
          ))}
          {activeHotspot && (() => {
            const hs = hotspots.find((h) => h.id === activeHotspot);
            if (!hs) return null;
            const tLeft = hs.x > 60 ? 'auto' : `${hs.x}%`;
            const tRight = hs.x > 60 ? `${100 - hs.x}%` : 'auto';
            return (
              <div className="climax-tooltip" style={{ left: tLeft, right: tRight, top: `${Math.min(hs.y + 6, 80)}%` }}>
                <strong className="climax-tooltip__label">{hs.label}</strong>
                <p className="climax-tooltip__desc">{hs.description}</p>
                <button className="climax-tooltip__close" onClick={(e) => { e.stopPropagation(); setActiveHotspot(null); }} type="button" aria-label="Đóng">✕</button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ClimaxScene;
