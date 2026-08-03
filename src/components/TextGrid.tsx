import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec2 uMouse;        // 0..1, eased
  uniform float uTime;
  uniform float uIntro;       // 0..1 ripple-in
  uniform float uHoverBoost;  // 0..1

  void main() {
    vec2 uv = vUv;
    vec2 px = uv * uResolution;

    // Dot grid
    float spacing = 22.0;
    vec2 g = mod(px, spacing) - spacing * 0.5;
    float d = length(g);

    // Ripple-in from center
    vec2 c = uv - 0.5;
    c.x *= uResolution.x / uResolution.y;
    float r = length(c);
    float ripple = smoothstep(uIntro * 1.4 + 0.05, uIntro * 1.4 - 0.05, r);
    float introMask = mix(0.0, 1.0, clamp(uIntro * 1.6 - r * 0.6, 0.0, 1.0));

    float dotSize = 1.2 + ripple * 1.2;
    float dot = smoothstep(dotSize, dotSize - 0.8, d);

    // Cursor glow pool
    vec2 m = uMouse;
    m.x *= uResolution.x / uResolution.y;
    vec2 p = uv;
    p.x *= uResolution.x / uResolution.y;
    float md = length(p - m);
    float glow = exp(-md * 3.5) * (0.55 + uHoverBoost * 0.6);

    // Ambient soft pool (idle)
    float ambient = exp(-r * 2.2) * 0.25;

    vec3 green = vec3(0.29, 0.87, 0.50);
    vec3 col = green * (dot * 0.35 * introMask);
    col += green * (glow + ambient);

    // Soft vignette darkening edges
    col *= smoothstep(1.2, 0.2, r);

    float alpha = clamp(dot * 0.55 * introMask + glow + ambient, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function TextGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uHoverBoost: { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const resize = () => {
      const r = section.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      uniforms.uResolution.value.set(r.width, r.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      targetMouse.set((e.clientX - r.left) / r.width, 1.0 - (e.clientY - r.top) / r.height);
      hoverRef.current = 1;
    };
    const onLeave = () => { hoverRef.current = 0; };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    // Intro ripple + text fade
    gsap.to(uniforms.uIntro, {
      value: 1,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 80%" },
    });
    gsap.from(section.querySelectorAll(".tg-col"), {
      y: 30,
      opacity: 0,
      stagger: 0.18,
      duration: 0.9,
      delay: 0.4,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 80%" },
    });
    gsap.from(section.querySelector(".tg-eyebrow"), {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 80%" },
    });

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(targetMouse, 0.08);
      uniforms.uHoverBoost.value += (hoverRef.current - uniforms.uHoverBoost.value) * 0.06;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="text-grid-section" ref={sectionRef} id="approach">
      <canvas ref={canvasRef} className="text-grid-canvas" />
      <div className="text-grid-inner">
        <div className="tg-eyebrow">
          <span className="tg-eyebrow-icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            </svg>
          </span>
          Know me more — a web developer who ships
        </div>

        <div className="tg-grid">
          {[
            { n: "01", title: "9 years of experience", body: "Nearly a decade building and maintaining sites of every size — from single-page brochures to e-commerce and multi-site platforms handling real business traffic." },
            { n: "02", title: "Custom, not off-the-shelf", body: "Built to your brand and requirements on whichever stack fits the job — CMS, custom code or headless. Clean, maintainable front-end and back-end, never a bloated template." },
            { n: "03", title: "Fast & search-ready", body: "Performance, accessibility and SEO baked in from the first line, so your site loads quickly, ranks well and stays easy to grow over time." },
          ].map((c) => (
            <div className="tg-col" key={c.n}>
              <div className="tg-num">[ {c.n} ]</div>
              <h3 className="tg-title">
                <span className="tg-pulse" />
                {c.title}
              </h3>
              <p className="tg-body">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
