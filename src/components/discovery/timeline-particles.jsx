import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 120;
const GLOW_PARTICLES = 8;

class Particle {
  constructor(canvasW, canvasH, lineX) {
    this.reset(canvasW, canvasH, lineX, true);
  }

  reset(canvasW, canvasH, lineX, initial = false) {
    this.x = lineX + (Math.random() - 0.5) * 60;
    this.y = initial ? Math.random() * canvasH : -10 - Math.random() * 80;
    this.baseX = this.x;
    this.size = 1 + Math.random() * 2.5;
    this.speedY = 0.3 + Math.random() * 0.8;
    this.drift = (Math.random() - 0.5) * 0.4;
    this.wobbleAmp = 8 + Math.random() * 20;
    this.wobbleFreq = 0.005 + Math.random() * 0.008;
    this.phase = Math.random() * Math.PI * 2;
    this.opacity = 0.15 + Math.random() * 0.6;
    this.fadeIn = 0;
    this.life = 0;
    this.maxLife = canvasH + 200;
    this.canvasH = canvasH;
  }

  update(time, scrollProgress) {
    this.life++;
    this.fadeIn = Math.min(this.fadeIn + 0.02, 1);
    const wobble = Math.sin(time * this.wobbleFreq + this.phase) * this.wobbleAmp;
    this.x = this.baseX + wobble + this.drift * this.life;
    this.y += this.speedY * (0.6 + scrollProgress * 1.5);

    if (this.y > this.canvasH + 20) return true;
    return false;
  }

  draw(ctx) {
    const alpha = this.opacity * this.fadeIn;
    if (alpha < 0.01) return;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 168, 76, ${alpha})`;
    ctx.fill();
  }
}

class GlowParticle {
  constructor(canvasW, canvasH, lineX) {
    this.reset(canvasW, canvasH, lineX, true);
  }

  reset(canvasW, canvasH, lineX, initial = false) {
    this.x = lineX + (Math.random() - 0.5) * 30;
    this.y = initial ? Math.random() * canvasH : -20;
    this.size = 3 + Math.random() * 5;
    this.speedY = 0.15 + Math.random() * 0.35;
    this.phase = Math.random() * Math.PI * 2;
    this.opacity = 0.05 + Math.random() * 0.15;
    this.canvasH = canvasH;
  }

  update(time, scrollProgress) {
    this.y += this.speedY * (0.5 + scrollProgress);
    this.x += Math.sin(time * 0.003 + this.phase) * 0.3;
    if (this.y > this.canvasH + 30) return true;
    return false;
  }

  draw(ctx) {
    if (this.opacity < 0.01) return;
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    gradient.addColorStop(0, `rgba(201, 168, 76, ${this.opacity * 0.8})`);
    gradient.addColorStop(0.5, `rgba(201, 168, 76, ${this.opacity * 0.3})`);
    gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

export const TimelineParticles = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const glowRef = useRef([]);
  const animRef = useRef(0);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef?.current;
    if (!canvas || !container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let lineX = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      lineX = w / 2;

      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => new Particle(w, h, lineX));
      glowRef.current = Array.from({ length: GLOW_PARTICLES }, () => new GlowParticle(w, h, lineX));
    };

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      const total = rect.height + viewH;
      const scrolled = viewH - rect.top;
      scrollProgressRef.current = Math.max(0, Math.min(1, scrolled / total));
    };

    const animate = (time) => {
      ctx.clearRect(0, 0, w, h);
      const sp = scrollProgressRef.current;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        if (p.update(time, sp)) p.reset(w, h, lineX);
        p.draw(ctx);
      }

      for (let i = 0; i < glowRef.current.length; i++) {
        const g = glowRef.current[i];
        if (g.update(time, sp)) g.reset(w, h, lineX);
        g.draw(ctx);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    resize();
    onScroll();
    animRef.current = requestAnimationFrame(animate);

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="timeline-river__particles"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default TimelineParticles;
