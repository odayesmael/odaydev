import { useEffect, useRef } from "react";

/**
 * Animated space starfield background — slowly drifting dots with subtle twinkle.
 * Renders into a full-bleed canvas; intended to be placed inside a `position: relative` wrapper.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;

    type Star = {
      x: number;
      y: number;
      z: number; // depth (0..1) — affects size + speed
      r: number;
      vx: number;
      vy: number;
      tw: number; // twinkle phase
      tws: number; // twinkle speed
      hue: number; // 0 = green-white, 1 = pure white
    };

    let stars: Star[] = [];

    const resize = () => {
      const parent = canvas.parentElement!;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Higher density + faster upward drift
      const target = Math.min(1100, Math.floor((width * height) / 1600));
      stars = new Array(target).fill(0).map(() => {
        const z = Math.pow(Math.random(), 1.6); // bias toward distant
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.3 + z * 1.6,
          vx: (Math.random() - 0.5) * 0.06 * (0.4 + z),
          vy: -(0.35 + z * 0.9), // faster upward drift
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.4,
          hue: Math.random(),
        };
      });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.tw += s.tws * dt;

        // Wrap around
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
        if (s.x < -2) s.x = width + 2;
        else if (s.x > width + 2) s.x = -2;

        const twinkle = 0.55 + 0.45 * Math.sin(s.tw);
        const alpha = (0.25 + s.z * 0.7) * twinkle;

        // Greenish vs white tint
        const g = 255;
        const r = s.hue > 0.7 ? 255 : 180 + Math.floor(s.hue * 60);
        const b = s.hue > 0.7 ? 255 : 180 + Math.floor(s.hue * 50);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo for the bigger ones
        if (s.z > 0.75) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(120,255,170,${alpha * 0.18})`;
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden />;
}
