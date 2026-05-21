import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP-powered hero entrance animation.
 * Respects prefers-reduced-motion.
 */
export function useHeroAnimation(heroRef, disabled = false) {
  useEffect(() => {
    if (!heroRef.current || disabled) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const hero = heroRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo('.evt-hero__bg img', { scale: 1.15 }, { scale: 1, duration: 2.5, ease: 'power2.out' }, 0)
        .fromTo('.evt-hero__era', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 })
        .fromTo('.evt-hero__title', { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.85 }, '-=0.25')
        .fromTo('.evt-hero__divider', { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, '-=0.5')
        .fromTo('.evt-hero__quote', { y: 20, opacity: 0 }, { y: 0, opacity: 0.85, duration: 0.55 }, '-=0.3')
        .fromTo('.evt-hero__facts > div', { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 }, '-=0.3')
        .fromTo('.evt-hero__cta', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.15');

      gsap.to('.evt-hero__bg img', {
        scale: 1.25, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });

      gsap.to('.evt-hero__vignette', {
        opacity: 0.95,
        scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: true },
      });

      gsap.to('.evt-hero__inner', {
        y: -60, opacity: 0,
        scrollTrigger: { trigger: hero, start: '30% top', end: '70% top', scrub: true },
      });
    }, hero);

    return () => ctx.revert();
  }, [heroRef, disabled]);
}

/**
 * GSAP-powered section scroll animations.
 * Animates section headers and body blocks on scroll-into-view.
 */
export function useSectionAnimations(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.evt-section').forEach((section) => {
        // Mood background transition
        const moodColor = section.dataset.moodColor || 'var(--bg-dark)';
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => gsap.to(container, { backgroundColor: moodColor, duration: 1 }),
          onEnterBack: () => gsap.to(container, { backgroundColor: moodColor, duration: 1 })
        });

        const headers = section.querySelectorAll(
          '.evt-section__eyebrow, .evt-section__title, .evt-section__divider',
        );
        if (headers.length) {
          gsap.from(headers, {
            y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
          });
        }

        const blocks = section.querySelectorAll('.evt-section__body > *');
        if (blocks.length) {
          gsap.from(blocks, {
            y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 72%', toggleActions: 'play none none none' },
          });
        }
      });

      gsap.utils.toArray('.evt-section__divider').forEach((div) => {
        gsap.from(div, {
          scaleX: 0, duration: 1, ease: 'power3.inOut',
          scrollTrigger: { trigger: div, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}


