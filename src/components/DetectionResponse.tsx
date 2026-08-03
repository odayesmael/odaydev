import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ParticleHand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Build a vertical blob of particles roughly resembling a clenched hand silhouette
    type P = { x: number; y: number; r: number; a: number; sp: number; ph: number };
    const particles: P[] = [];
    const N = 1400;
    for (let i = 0; i < N; i++) {
      // Sample within an ellipse, biased toward center for density
      const u = Math.random();
      const v = Math.random();
      const r = Math.sqrt(u);
      const ang = v * Math.PI * 2;
      // Hand-ish: wider in the middle, slight bumps at top (knuckles)
      let nx = Math.cos(ang) * r;
      let ny = Math.sin(ang) * r;
      // Vertical squash + small lobes at top
      const lobe = Math.sin(nx * 6) * 0.08 * Math.max(0, -ny);
      ny += lobe;
      // Reject points outside a hand-ish mask
      const mask =
        Math.pow(nx / 0.55, 2) + Math.pow((ny + 0.05) / 0.75, 2) <= 1;
      if (!mask) {
        i--;
        continue;
      }
      particles.push({
        x: nx,
        y: ny,
        r: 0.6 + Math.random() * 1.4,
        a: 0.25 + Math.random() * 0.75,
        sp: 0.2 + Math.random() * 0.8,
        ph: Math.random() * Math.PI * 2,
      });
    }

    const draw = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.55;
      const scale = Math.min(w, h) * 0.42;

      // Soft glow halo
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.6);
      grad.addColorStop(0, "rgba(74, 222, 128, 0.18)");
      grad.addColorStop(0.5, "rgba(34, 197, 94, 0.06)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Dotted ring (radar-like)
      ctx.strokeStyle = "rgba(120, 220, 140, 0.28)";
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([2 * dpr, 6 * dpr]);
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 1.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Particles
      for (const p of particles) {
        const flick = 0.5 + 0.5 * Math.sin(t * 0.002 * p.sp + p.ph);
        const jitterX = Math.sin(t * 0.001 * p.sp + p.ph) * 0.004;
        const jitterY = Math.cos(t * 0.0012 * p.sp + p.ph * 1.3) * 0.004;
        const x = cx + (p.x + jitterX) * scale;
        const y = cy + (p.y + jitterY) * scale;
        const alpha = p.a * (0.5 + 0.5 * flick);
        ctx.fillStyle = `rgba(120, 255, 140, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="dr-canvas" aria-hidden />;
}

export function DetectionResponse() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelector(".dr-eyebrow"), {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      gsap.from(section.querySelectorAll(".dr-headline .dr-line"), {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%" },
      });
      gsap.from(section.querySelector(".dr-canvas-wrap"), {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%" },
      });
      gsap.from(section.querySelectorAll(".dr-foot > *"), {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 70%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="dr-section" ref={ref} id="detection-response">
      <div className="dr-eyebrow">[ &nbsp;OUR SERVICES&nbsp; ]</div>

      <div className="dr-stage">
        <h2 className="dr-headline">
          <span className="dr-line">Detection and</span>
          <span className="dr-line">Response</span>
        </h2>

        <div className="dr-canvas-wrap">
          <ParticleHand />
        </div>
      </div>

      <div className="dr-divider" />

      <div className="dr-foot">
        <div className="dr-scroll">
          <span className="dr-scroll-arrow">↓</span>
          <span>
            <strong>Scroll</strong> to learn more
          </span>
        </div>
        <p className="dr-foot-text">
          We amplify your threat visibility and employ automated incident response
          to safeguard your resources, standing, and activities.
        </p>
      </div>
    </section>
  );
}
