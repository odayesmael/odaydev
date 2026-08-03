import { useEffect, useRef } from "react";

/**
 * Ambient binary stream behind the hero.
 *
 * Deliberately restrained: sparse columns, slow fall, low alpha, and a radial
 * mask (in CSS) that hides it behind the headline and brain — so it reads as a
 * quiet "this thing is code" texture framing the content, not Matrix rain.
 */
export function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const FONT = 12;
    const COL_W = 24;

    let width = 0;
    let height = 0;
    let raf = 0;

    type Col = { x: number; y: number; speed: number; chars: string[]; len: number };
    let cols: Col[] = [];

    const resize = () => {
      const parent = canvas.parentElement!;
      // Fall back to the viewport if the parent hasn't been laid out yet,
      // otherwise the canvas sizes to 0 and nothing ever draws.
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.ceil(width / COL_W);
      cols = [];
      for (let i = 0; i < count; i++) {
        if (Math.random() > 0.5) continue; // sparse — roughly half the columns
        const len = 8 + Math.floor(Math.random() * 16);
        cols.push({
          x: i * COL_W + COL_W * 0.5,
          y: Math.random() * height,
          speed: 14 + Math.random() * 24, // px/sec — slow drift
          chars: Array.from({ length: len }, () => (Math.random() < 0.5 ? "0" : "1")),
          len,
        });
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    window.addEventListener("resize", resize);

    let last = performance.now();
    let flip = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `${FONT}px "Space Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";

      flip += dt;
      const mutate = flip > 0.12;
      if (mutate) flip = 0;

      for (const c of cols) {
        c.y += c.speed * dt;
        if (c.y - c.len * FONT > height) c.y = -Math.random() * height * 0.4;

        if (mutate && Math.random() < 0.3) {
          c.chars[Math.floor(Math.random() * c.len)] = Math.random() < 0.5 ? "0" : "1";
        }

        for (let i = 0; i < c.len; i++) {
          const y = c.y - i * FONT;
          if (y < -FONT || y > height + FONT) continue;
          const f = 1 - i / c.len;
          if (i === 0) {
            ctx.fillStyle = "rgba(200, 255, 215, 0.30)";
          } else {
            ctx.fillStyle = `rgba(74, 222, 128, ${0.17 * f * f})`;
          }
          ctx.fillText(c.chars[i], c.x, y);
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="binary-rain-canvas" aria-hidden />;
}
