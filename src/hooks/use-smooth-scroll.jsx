import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export const useSmoothScroll = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (lenisInstance) {
      lenisRef.current = lenisInstance;
      return;
    }

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    lenisInstance = lenis;
    lenisRef.current = lenis;
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return lenisRef;
};

export const useScrollReveal = (selector, options = {}) => {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((el, i) => {
        gsap.from(el, {
          y: options.y ?? 60,
          opacity: 0,
          duration: options.duration ?? 0.9,
          delay: options.stagger ? i * (options.stagger ?? 0.12) : 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: options.start ?? 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    return () => ctx.revert();
  }, [selector]);
};

export const useParallax = (ref, speed = 0.3) => {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, speed]);
};

export default useSmoothScroll;
