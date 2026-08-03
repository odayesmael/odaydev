import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Twin miniature neural brains floating either side of the contact CTA —
 * the same anatomy and palette as the hero, at a fraction of the node count.
 * They scatter and their edges dissolve when the CTA button is hovered.
 */
function Orb({ tint, hoverSignal }: { tint: "green" | "amber"; hoverSignal: { current: number } }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // ---------- Small neural brain (same anatomy as the hero, fewer nodes) ----------
    const green = [
      new THREE.Color(0x4ade80),
      new THREE.Color(0x22c55e),
      new THREE.Color(0x86efac),
      new THREE.Color(0x16a34a),
      new THREE.Color(0xd6ffe0),
    ];
    const accent = tint === "amber" ? new THREE.Color(0xff8a6b) : new THREE.Color(0xff4d5e);
    const pick = () => green[Math.floor(Math.random() * green.length)];

    const RX = 1.5;
    const RY = 1.0;
    const RZ = 1.06;

    type Raw = { x: number; y: number; z: number; s: number; c: THREE.Color };
    const raw: Raw[] = [];

    // Core
    raw.push({ x: 0, y: 0.04, z: 0.16, s: 0.3, c: new THREE.Color(0xdcffe4) });

    // Cerebrum
    for (let i = 0; i < 210; i++) {
      const uy = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const sxy = Math.sqrt(1 - uy * uy);
      const ux = sxy * Math.cos(th);
      const uz = sxy * Math.sin(th);

      const ang = Math.atan2(uy, ux);
      let shape = uy < 0 ? 1 - 0.34 * Math.pow(-uy, 1.3) : 1;
      shape *= 1 + 0.05 * Math.cos(ang) + 0.03 * Math.cos(2 * ang);
      shape += 0.05 * Math.sin(6.5 * ang + 3.2 * uz);

      const rr = 0.93 + Math.random() * 0.07;
      let x = RX * ux * shape * rr;
      let y = RY * uy * shape * rr;
      let z = RZ * uz * shape * rr;

      const fy = -0.34 * RY + 0.16 * x;
      const dfy = Math.abs(y - fy);
      if (dfy < 0.16 && x > -0.9) {
        const k = 1 - dfy / 0.16;
        y *= 1 - 0.06 * k;
        z *= 1 - 0.3 * k;
      }
      if (Math.abs(z) < 0.22 && y > 0.2 * RY) {
        y -= 0.14 * (1 - Math.abs(z) / 0.22) * RY;
      }

      raw.push({
        x,
        y,
        z,
        s: 0.055 + Math.random() * 0.05,
        c: Math.random() < 0.06 ? accent : pick(),
      });
    }

    // Cerebellum
    for (let i = 0; i < 44; i++) {
      const uy = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s2 = Math.sqrt(1 - uy * uy);
      const rr = 0.8 + Math.random() * 0.2;
      const folia = 1 + 0.09 * Math.sin(uy * 22);
      raw.push({
        x: -0.78 * RX + 0.44 * s2 * Math.cos(th) * rr * folia,
        y: -0.72 * RY + 0.3 * uy * rr,
        z: 0.5 * s2 * Math.sin(th) * rr * folia,
        s: 0.042 + Math.random() * 0.03,
        c: green[Math.random() < 0.5 ? 3 : 1],
      });
    }

    // Brain stem
    for (let i = 0; i < 16; i++) {
      const t2 = i / 16;
      const a = Math.random() * Math.PI * 2;
      const rad = 0.15 * (1 - t2 * 0.35);
      raw.push({
        x: -0.3 * RX + t2 * 0.14 * RX + Math.cos(a) * rad,
        y: -0.66 * RY - t2 * 0.5 * RY,
        z: Math.sin(a) * rad,
        s: 0.055 + Math.random() * 0.03,
        c: green[Math.random() < 0.5 ? 4 : 1],
      });
    }

    const COUNT = raw.length;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    const scatter = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const n = raw[i];
      const o = i * 3;
      positions[o] = n.x;
      positions[o + 1] = n.y;
      positions[o + 2] = n.z;
      colors[o] = n.c.r;
      colors[o + 1] = n.c.g;
      colors[o + 2] = n.c.b;
      sizes[i] = n.s;
      seeds[i] = Math.random();

      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const mag = 1.5 + Math.random() * 2.8;
      scatter[o] = Math.sin(ph) * Math.cos(th) * mag;
      scatter[o + 1] = Math.cos(ph) * mag;
      scatter[o + 2] = Math.sin(ph) * Math.sin(th) * mag;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));

    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uHover: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uHover;
        attribute vec3 aColor;
        attribute float aSeed;
        attribute float aSize;
        attribute vec3 aScatter;
        varying vec3 vColor;
        varying float vHover;

        void main() {
          vec3 pos = position;
          float t = uTime * 0.6;
          pos += normalize(pos + 0.0001) * sin(t + aSeed * 6.283) * 0.03;

          float h = clamp(uHover, 0.0, 1.0);
          float eased = h * h * (3.0 - 2.0 * h);
          pos += (aScatter + vec3(
            sin(uTime * 1.4 + aSeed * 20.0) * 0.3,
            cos(uTime * 1.1 + aSeed * 17.0) * 0.3,
            sin(uTime * 1.6 + aSeed * 11.0) * 0.3
          )) * eased;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float pulse = 0.85 + 0.2 * sin(uTime * 1.4 + aSeed * 10.0);
          gl_PointSize = aSize * uPixelRatio * pulse * (300.0 / -mv.z);
          vColor = aColor;
          vHover = eased;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vHover;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.42, 0.05, d);
          float rim = smoothstep(0.5, 0.3, d);
          vec3 col = vColor * (0.55 + core * 1.1);
          gl_FragColor = vec4(col, (core * 0.85 + rim * 0.35) * (1.0 - vHover * 0.55));
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    // ---------- Nearest-neighbour edges ----------
    const K = 3;
    const seen = new Set<number>();
    const pairs: number[] = [];
    for (let i = 1; i < COUNT; i++) {
      const best: { j: number; d: number }[] = [];
      for (let j = 1; j < COUNT; j++) {
        if (j === i) continue;
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (best.length < K) {
          best.push({ j, d });
          best.sort((a, b) => a.d - b.d);
        } else if (d < best[K - 1].d) {
          best[K - 1] = { j, d };
          best.sort((a, b) => a.d - b.d);
        }
      }
      for (const b of best) {
        const lo = Math.min(i, b.j);
        const hi = Math.max(i, b.j);
        const key = lo * 10000 + hi;
        if (!seen.has(key)) {
          seen.add(key);
          pairs.push(lo, hi);
        }
      }
    }

    const edgeCount = pairs.length / 2;
    const linePos = new Float32Array(edgeCount * 2 * 3);
    for (let e = 0; e < edgeCount * 2; e++) {
      const n = pairs[e] * 3;
      linePos[e * 3] = positions[n];
      linePos[e * 3 + 1] = positions[n + 1];
      linePos[e * 3 + 2] = positions[n + 2];
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uHover.value += (hoverSignal.current - uniforms.uHover.value) * 0.06;
      const t = uniforms.uTime.value;
      // Same slow right-to-left sway as the hero brain
      group.rotation.y = Math.sin(t * 0.22) * 0.6;
      group.rotation.x = Math.sin(t * 0.18) * 0.05;
      // Edges dissolve as the points scatter on hover
      lineMat.opacity = 0.22 * (1 - uniforms.uHover.value);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const W = mount.clientWidth;
      const H = mount.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [tint, hoverSignal]);

  return <div ref={mountRef} className={`contact-orb contact-orb-${tint}`} />;
}

export function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  const hoverSignal = useRef(0);

  useEffect(() => {
    const section = ref.current!;
    const onEnter = () => { hoverSignal.current = 1; };
    const onLeave = () => { hoverSignal.current = 0; };
    const trigger = section.querySelector(".cta-button") as HTMLElement | null;
    const target = trigger ?? section;
    target.addEventListener("mouseenter", onEnter);
    target.addEventListener("mouseleave", onLeave);

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".cta-reveal"), {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    }, section);
    return () => {
      ctx.revert();
      target.removeEventListener("mouseenter", onEnter);
      target.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="contact-cta-section" id="contact" ref={ref}>
      <div className="cta-arc" aria-hidden />
      <Orb tint="green" hoverSignal={hoverSignal} />
      <Orb tint="amber" hoverSignal={hoverSignal} />

      <div className="cta-content">
        <h2 className="cta-title cta-reveal">
          Let&apos;s build
          <br />
          something{" "}
          <span className="cta-icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="12" cy="12" r="10" strokeDasharray="2 3" />
              <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
            </svg>
          </span>
        </h2>
        <p className="cta-sub cta-reveal">
          Have a website or web app in mind, or a site that needs care and speed? Available for freelance work and long-term collaborations.
        </p>
        <a className="cta-button cta-reveal" href="mailto:odaiesmael303@gmail.com">
          Hire me <span className="cta-button-dot" />
        </a>

        <div className="cta-details cta-reveal">
          <a className="cta-detail" href="mailto:odaiesmael303@gmail.com">
            <span className="cta-detail-label">[ EMAIL ]</span>
            <span className="cta-detail-value">odaiesmael303@gmail.com</span>
          </a>
          <div className="cta-detail">
            <span className="cta-detail-label">[ LOCATION ]</span>
            <span className="cta-detail-value">Netherlands</span>
          </div>
        </div>
      </div>
    </section>
  );
}
