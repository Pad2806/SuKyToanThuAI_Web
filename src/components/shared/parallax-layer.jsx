import React, { useEffect, useRef } from 'react';

export const ParallaxLayer = ({ children, strength = 20 }) => {
  const ref = useRef(null);

  useEffect(() => {
    let frameId = 0;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      node.style.transform = `translateY(${-progress * strength}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [strength]);

  return <div ref={ref}>{children}</div>;
};

export default ParallaxLayer;
