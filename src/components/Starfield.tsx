import { useEffect, useRef } from "react";

/**
 * Animated space starfield background — slowly drifting dots with subtle twinkle.
 * The canvas is viewport-sized and sticks to the top of its wrapper (it must be the
 * wrapper's first child), so a tall page never allocates a page-tall canvas.
 * Animation pauses while the wrapper is off screen.
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
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Higher density + faster upward drift
      const target = Math.min(700, Math.floor((width * height) / 1800));
      stars = new Array(target).fill(0).map(() => {
        const z = Math.pow(Math.random(), 1.6); // bias toward distant
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.3 + z * 1.6,
          vx: (Math.random() - 0.5) * 0.02 * (0.4 + z),
          vy: -(0.06 + z * 0.16), // slow, calm upward drift
          tw: Math.random() * Math.PI * 2,
          tws: 0.25 + Math.random() * 0.5, // gentle twinkle
          hue: Math.random(),
        };
      });
    };

    resize();
    let lastW = width;
    let lastH = height;
    const onResize = () => {
      const w = canvas.parentElement!.clientWidth;
      // Ignore height-only jitter from mobile browser toolbars
      if (w !== lastW || Math.abs(window.innerHeight - lastH) > 120) {
        resize();
        lastW = width;
        lastH = height;
      }
    };
    window.addEventListener("resize", onResize);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas.parentElement!);

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Shooting stars: an occasional streak across the sky, never more than two at once.
    type Meteor = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      ttl: number;
      len: number;
    };
    const meteors: Meteor[] = [];
    const nextGap = () => 5 + Math.random() * 9; // seconds between meteors
    let untilNext = 2.5 + Math.random() * 3;
    const spawnMeteor = () => {
      const angle = ((200 + Math.random() * 22) * Math.PI) / 180; // heading down and to the left
      const speed = 650 + Math.random() * 450; // px per second
      meteors.push({
        x: width * (0.35 + Math.random() * 0.75),
        y: height * (Math.random() * 0.45) - 40,
        vx: Math.cos(angle) * speed, // negative: moves left
        vy: -Math.sin(angle) * speed, // positive: moves down
        life: 0,
        ttl: 0.7 + Math.random() * 0.6,
        len: 110 + Math.random() * 120,
      });
    };
    const drawMeteors = (dt: number) => {
      untilNext -= dt;
      if (untilNext <= 0 && meteors.length < 2) {
        spawnMeteor();
        untilNext = nextGap();
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const t = m.life / m.ttl;
        if (t >= 1) {
          meteors.splice(i, 1);
          continue;
        }
        // Fade in fast, fade out slowly
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const speed = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / speed) * m.len;
        const ty = m.y - (m.vy / speed) * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(235,255,240,${0.55 * fade})`);
        grad.addColorStop(0.25, `rgba(140,255,180,${0.22 * fade})`);
        grad.addColorStop(1, "rgba(74,222,128,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        // Bright head
        ctx.beginPath();
        ctx.fillStyle = `rgba(240,255,245,${0.6 * fade})`;
        ctx.arc(m.x, m.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

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

        const twinkle = 0.7 + 0.3 * Math.sin(s.tw);
        const alpha = (0.1 + s.z * 0.35) * twinkle; // kept faint so it never competes with text

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
          ctx.fillStyle = `rgba(120,255,170,${alpha * 0.12})`;
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduceMotion) drawMeteors(dt);

      if (visible && !reduceMotion) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden />;
}
