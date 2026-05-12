import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useTextReveal = (containerRef) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const lines = containerRef.current.querySelectorAll('.text-reveal-line');
      if (!lines.length) return;

      gsap.from(lines, {
        y: 120,
        opacity: 0,
        rotateX: -80,
        stagger: 0.08,
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
};

export const useImageParallax = (imageRef, intensity = 20) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: intensity,
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [imageRef, intensity]);
};

export const useCounterAnimation = (ref, targetValue) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: targetValue,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = Math.round(obj.val).toLocaleString('vi-VN');
          }
        },
      });
    });

    return () => ctx.revert();
  }, [ref, targetValue]);
};

export const useStaggerReveal = (containerRef, childSelector) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const children = containerRef.current.querySelectorAll(childSelector);
      gsap.from(children, {
        y: 48,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef, childSelector]);
};

export const useHorizontalScroll = (containerRef) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !containerRef.current) return;

    const container = containerRef.current;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    if (scrollWidth <= 0) return;

    const ctx = gsap.context(() => {
      gsap.to(container, {
        scrollLeft: scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 60%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [containerRef]);
};

export const usePinSection = (triggerRef, options = {}) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !triggerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: options.start ?? 'top top',
        end: options.end ?? '+=100%',
        pin: true,
        pinSpacing: options.pinSpacing ?? true,
      });
    });

    return () => ctx.revert();
  }, [triggerRef]);
};
