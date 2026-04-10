import { useEffect, useRef } from "react";

// Lightweight canvas particles (no dependency). Respects reduced motion.
export default function ParticlesBackdrop({ className = "" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reducedMotion = !!media?.matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const styles = window.getComputedStyle(canvas);
    const particleRgb = (styles.getPropertyValue("--particle-color").trim() || "255,255,255");
    const linkRgb = (styles.getPropertyValue("--particle-link").trim() || "255,255,255");

    const state = {
      w: 0,
      h: 0,
      particles: [],
      last: performance.now(),
      mouse: { x: 0, y: 0, active: false },
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    const resize = () => {
      const parent = canvas.parentElement || document.body;
      const rect = parent.getBoundingClientRect();
      state.w = Math.max(1, Math.floor(rect.width));
      state.h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(state.w * DPR);
      canvas.height = Math.floor(state.h * DPR);
      canvas.style.width = `${state.w}px`;
      canvas.style.height = `${state.h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const area = state.w * state.h;
      const isSmall = state.w < 520;
      const target = Math.max(26, Math.min(90, Math.floor(area / (isSmall ? 22000 : 16000))));

      // Re-seed on resize for consistent density.
      state.particles = Array.from({ length: target }).map(() => ({
        x: rand(0, state.w),
        y: rand(0, state.h),
        r: rand(1.2, 2.8),
        vx: rand(-0.22, 0.22),
        vy: rand(-0.18, 0.18),
        hue: rand(215, 290),
        alpha: rand(0.28, 0.6),
      }));
    };

    const draw = (now) => {
      const dt = Math.min(48, now - state.last);
      state.last = now;

      ctx.clearRect(0, 0, state.w, state.h);

      // Soft vignette
      const g = ctx.createRadialGradient(
        state.w * 0.5,
        state.h * 0.45,
        0,
        state.w * 0.5,
        state.h * 0.45,
        Math.max(state.w, state.h) * 0.75,
      );
      g.addColorStop(0, "rgba(255,255,255,0.00)");
      g.addColorStop(1, "rgba(10,16,28,0.10)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, state.w, state.h);

      // Move + draw particles
      for (const p of state.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < -20) p.x = state.w + 20;
        if (p.x > state.w + 20) p.x = -20;
        if (p.y < -20) p.y = state.h + 20;
        if (p.y > state.h + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${particleRgb}, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Links
      const linkDist = Math.max(96, Math.min(160, Math.floor(Math.min(state.w, state.h) * 0.16)));
      for (let i = 0; i < state.particles.length; i++) {
        const a = state.particles[i];
        for (let j = i + 1; j < state.particles.length; j++) {
          const b = state.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > linkDist) continue;
          const t = 1 - d / linkDist;
          ctx.strokeStyle = `rgba(${linkRgb}, ${0.22 * t})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }


      if (state.mouse.active) {
        for (const p of state.particles) {
          const dx = p.x - state.mouse.x;
          const dy = p.y - state.mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > linkDist * 1.2) continue;
          const t = 1 - d / (linkDist * 1.2);
          ctx.strokeStyle = `rgba(${linkRgb}, ${0.35 * t})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(state.mouse.x, state.mouse.y);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    rafRef.current = requestAnimationFrame(draw);

    const handleMove = (evt) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = evt.clientX - rect.left;
      state.mouse.y = evt.clientY - rect.top;
      state.mouse.active = true;
    };

    const handleLeave = () => {
      state.mouse.active = false;
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={`particles-canvas ${className}`} aria-hidden="true" />;
}
