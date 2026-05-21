import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Battle template — GSAP hero entrance animation.
 * Independent copy from story-system for full isolation.
 */
export function useHeroAnimation(heroRef) {
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

      gsap.to('.evt-hero__bg img', {
        scale: 1.25, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });

      gsap.to('.evt-hero__vignette', {
        opacity: 0.95,
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: true },
      });

      gsap.to('.evt-hero__inner', {
        y: -60, opacity: 0,
        scrollTrigger: { trigger: heroRef.current, start: '30% top', end: '70% top', scrub: true },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [heroRef]);
}

/**
 * Battle template — GSAP section scroll animations.
 */
export function useSectionAnimations(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.evt-section').forEach((section) => {
        const headers = section.querySelectorAll(
          '.evt-section__eyebrow, .evt-section__title, .evt-section__divider',
        );
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
  }, [containerRef]);
}
