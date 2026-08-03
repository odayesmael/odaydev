import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Neural-network "brain" — a point cloud shaped into a brain-ish ellipsoid,
 * wired together with nearest-neighbour edges and a bright radiating core.
 *
 * Node motion is simulated on the CPU with a spring system so the cursor
 * displaces nodes like a finger through water — they push away, ripple, and
 * settle back. Edges are rebuilt from the same positions each frame so the
 * whole mesh moves as one fluid body.
 */
export function HeroSphere() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // ---------- Scene / Camera / Renderer ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // ---------- Node cloud (anatomical brain) ----------
    const palette = [
      new THREE.Color(0x4ade80), // green-bright (brand)
      new THREE.Color(0x22c55e), // green-mid
      new THREE.Color(0x86efac), // light green
      new THREE.Color(0x16a34a), // deep green
      new THREE.Color(0xd6ffe0), // pale mint
      new THREE.Color(0xffffff), // white (sparse highlights)
    ];
    const pickColor = () => {
      const r = Math.random();
      if (r < 0.36) return palette[0];
      if (r < 0.62) return palette[1];
      if (r < 0.8) return palette[2];
      if (r < 0.91) return palette[3];
      if (r < 0.97) return palette[4];
      return palette[5];
    };
    const deepGreen = new THREE.Color(0x16a34a);
    const midGreen = new THREE.Color(0x22c55e);
    const paleMint = new THREE.Color(0xd6ffe0);
    // Sparse warm accents — "firing" neurons. Coral rather than pure red so they
    // read as energy, not as an error state, and stay readable for red/green CVD.
    const accentRed = new THREE.Color(0xff4d5e);
    const accentWarm = new THREE.Color(0xff8a6b);

    // Lateral profile: long front-to-back (x), shorter top-to-bottom (y), narrow across (z)
    const RX = 2.0;
    const RY = 1.35;
    const RZ = 1.42;

    type Raw = { x: number; y: number; z: number; s: number; c: THREE.Color };
    const raw: Raw[] = [];

    // Glowing core (index 0)
    raw.push({ x: 0, y: 0.06, z: 0.22, s: 0.5, c: new THREE.Color(0xdcffe4) });

    // --- Cerebrum: folded cortex shell carved by the major fissures ---
    const CEREBRUM = 640;
    for (let i = 0; i < CEREBRUM; i++) {
      const uy = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const sxy = Math.sqrt(1 - uy * uy);
      const ux = sxy * Math.cos(th);
      const uz = sxy * Math.sin(th);

      const ang = Math.atan2(uy, ux);
      let shape = 1;
      shape *= uy < 0 ? 1 - 0.34 * Math.pow(-uy, 1.3) : 1; // flat underside
      shape *= 1 + 0.05 * Math.cos(ang) + 0.03 * Math.cos(2 * ang); // frontal + occipital fullness
      shape += 0.05 * Math.sin(6.5 * ang + 3.2 * uz) + 0.03 * Math.sin(9 * uz + 2 * ang); // gyri

      const rr = Math.random() < 0.86 ? 0.93 + Math.random() * 0.07 : 0.55 + Math.random() * 0.3;
      let x = RX * ux * shape * rr;
      let y = RY * uy * shape * rr;
      let z = RZ * uz * shape * rr;

      // Lateral (Sylvian) fissure — the deep groove above the temporal lobe
      const fy = -0.34 * RY + 0.16 * x;
      const dfy = Math.abs(y - fy);
      if (dfy < 0.2 && x > -1.2) {
        const k = 1 - dfy / 0.2;
        x *= 1 - 0.07 * k;
        y *= 1 - 0.06 * k;
        z *= 1 - 0.3 * k;
      }

      // Central sulcus — diagonal groove running down across the top
      const px = x - 0.25 * RX;
      const py = y - 0.95 * RY;
      const cross = Math.abs(px * -0.922 - py * -0.387);
      if (cross < 0.14 && y > -0.1 * RY) {
        const k = 1 - cross / 0.14;
        z *= 1 - 0.28 * k;
        x *= 1 - 0.04 * k;
      }

      // Longitudinal fissure — midline valley splitting the two hemispheres
      if (Math.abs(z) < 0.3 && y > 0.2 * RY) {
        const k = 1 - Math.abs(z) / 0.3;
        y -= 0.16 * k * RY;
      }

      // Temporal lobe hangs below the lateral fissure
      if (y < fy && x > -0.9) y -= 0.06;

      // Accent chance rises close to the core, so the warm nodes cluster where
      // the burst fires instead of speckling the whole cortex evenly.
      const dcx = x;
      const dcy = y - 0.06;
      const dcz = z - 0.22;
      const dCore = Math.sqrt(dcx * dcx + dcy * dcy + dcz * dcz);
      const isAccent = Math.random() < 0.03 + 0.09 * Math.max(0, 1 - dCore / 1.4);

      raw.push({
        x,
        y,
        z,
        s: 0.085 + Math.random() * 0.07 + (Math.random() < 0.09 ? 0.13 : 0) + (isAccent ? 0.04 : 0),
        c: isAccent ? (Math.random() < 0.55 ? accentRed : accentWarm) : pickColor(),
      });
    }

    // --- Cerebellum: dense, finely-foliated cluster at the lower back ---
    const CEREBELLUM = 130;
    for (let i = 0; i < CEREBELLUM; i++) {
      const uy = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s2 = Math.sqrt(1 - uy * uy);
      const rr = 0.8 + Math.random() * 0.2;
      const folia = 1 + 0.09 * Math.sin(uy * 22); // parallel folds
      raw.push({
        x: -0.78 * RX + 0.46 * s2 * Math.cos(th) * rr * folia,
        y: -0.72 * RY + 0.32 * uy * rr,
        z: 0.62 * s2 * Math.sin(th) * rr * folia,
        s: 0.06 + Math.random() * 0.045,
        c: Math.random() < 0.5 ? deepGreen : midGreen,
      });
    }

    // --- Brain stem descending from the base ---
    const STEM = 46;
    for (let i = 0; i < STEM; i++) {
      const t2 = i / STEM;
      const cx = -0.3 * RX + t2 * 0.14 * RX;
      const cy = -0.66 * RY - t2 * 0.55 * RY;
      const rad = 0.17 * (1 - t2 * 0.35);
      const a = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random());
      raw.push({
        x: cx + Math.cos(a) * rad * rr,
        y: cy + (Math.random() - 0.5) * 0.05,
        z: Math.sin(a) * rad * rr,
        s: 0.085 + Math.random() * 0.05,
        c: Math.random() < 0.5 ? paleMint : midGreen,
      });
    }

    // --- Sparse interior so the volume doesn't read as a hollow shell ---
    const INNER = 90;
    for (let i = 0; i < INNER; i++) {
      const uy = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s2 = Math.sqrt(1 - uy * uy);
      const rr = Math.pow(Math.random(), 0.6) * 0.7;
      raw.push({
        x: RX * s2 * Math.cos(th) * rr,
        y: RY * uy * rr * 0.8,
        z: RZ * s2 * Math.sin(th) * rr,
        s: 0.06 + Math.random() * 0.05,
        c: pickColor(),
      });
    }

    const NODES = raw.length;
    const basePos = new Float32Array(NODES * 3); // rest positions
    const positions = new Float32Array(NODES * 3); // live positions
    const vel = new Float32Array(NODES * 3);
    const colors = new Float32Array(NODES * 3);
    const sizes = new Float32Array(NODES);
    const seeds = new Float32Array(NODES);

    for (let i = 0; i < NODES; i++) {
      const n = raw[i];
      const o = i * 3;
      basePos[o] = n.x;
      basePos[o + 1] = n.y;
      basePos[o + 2] = n.z;
      colors[o] = n.c.r;
      colors[o + 1] = n.c.g;
      colors[o + 2] = n.c.b;
      sizes[i] = n.s;
      seeds[i] = Math.random();
    }
    positions.set(basePos);

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", posAttr);
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uScatter: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    };

    const nodeMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uScatter;
        uniform float uPixelRatio;
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aSeed;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float pulse = 0.85 + 0.2 * sin(uTime * 1.4 + aSeed * 10.0);
          gl_PointSize = aSize * uPixelRatio * pulse * (300.0 / -mv.z);
          vColor = aColor;
          vAlpha = 1.0 - smoothstep(0.35, 1.0, uScatter);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.42, 0.05, d);
          float rim = smoothstep(0.5, 0.3, d);
          vec3 col = vColor * (0.55 + core * 1.1);
          float alpha = (core * 0.85 + rim * 0.35) * vAlpha;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const points = new THREE.Points(geometry, nodeMat);
    group.add(points);

    // ---------- Edges (nearest-neighbour web) ----------
    const K = 3;
    const edgeKeys = new Set<number>();
    const edgePairs: number[] = [];
    for (let i = 1; i < NODES; i++) {
      const ix = basePos[i * 3];
      const iy = basePos[i * 3 + 1];
      const iz = basePos[i * 3 + 2];
      const best: { j: number; d: number }[] = [];
      for (let j = 1; j < NODES; j++) {
        if (j === i) continue;
        const dx = ix - basePos[j * 3];
        const dy = iy - basePos[j * 3 + 1];
        const dz = iz - basePos[j * 3 + 2];
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
        const a = Math.min(i, b.j);
        const c = Math.max(i, b.j);
        const key = a * 100000 + c;
        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edgePairs.push(a, c);
        }
      }
    }

    const edgeCount = edgePairs.length / 2;
    const linePos = new Float32Array(edgeCount * 2 * 3);
    const lineCol = new Float32Array(edgeCount * 2 * 3);
    const cool = new THREE.Color(0x22c55e);
    for (let e = 0; e < edgeCount; e++) {
      for (let s = 0; s < 2; s++) {
        const n = edgePairs[e * 2 + s];
        const o = (e * 2 + s) * 3;
        lineCol[o] = colors[n * 3] * 0.3 + cool.r * 0.25;
        lineCol[o + 1] = colors[n * 3 + 1] * 0.3 + cool.g * 0.25;
        lineCol[o + 2] = colors[n * 3 + 2] * 0.3 + cool.b * 0.25;
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    const lineAttr = new THREE.BufferAttribute(linePos, 3);
    lineAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute("position", lineAttr);
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // ---------- Radiating core burst ----------
    const rays: number[] = [];
    for (let i = 1; i < NODES; i++) {
      if (Math.random() < 0.035) rays.push(i);
    }
    const burstPos = new Float32Array(rays.length * 2 * 3);
    const burstCol = new Float32Array(rays.length * 2 * 3);
    const warmA = new THREE.Color(0xe9ffef);
    const warmB = new THREE.Color(0x4ade80);
    for (let r = 0; r < rays.length; r++) {
      let o = r * 2 * 3;
      burstCol[o] = warmA.r; burstCol[o + 1] = warmA.g; burstCol[o + 2] = warmA.b;
      o += 3;
      burstCol[o] = warmB.r; burstCol[o + 1] = warmB.g; burstCol[o + 2] = warmB.b;
    }
    const burstGeo = new THREE.BufferGeometry();
    const burstAttr = new THREE.BufferAttribute(burstPos, 3);
    burstAttr.setUsage(THREE.DynamicDrawUsage);
    burstGeo.setAttribute("position", burstAttr);
    burstGeo.setAttribute("color", new THREE.BufferAttribute(burstCol, 3));
    const burstMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const burst = new THREE.LineSegments(burstGeo, burstMat);
    group.add(burst);

    // ---------- Pointer → world point on the brain's plane ----------
    const mouseNDC = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitWorld = new THREE.Vector3();
    const mouseLocal = new THREE.Vector3(0, 0, 0);
    let pointerInside = false;
    let hover = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerInside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouseNDC.x = (x / rect.width) * 2 - 1;
      mouseNDC.y = -(y / rect.height) * 2 + 1;
    };
    const onPointerLeave = () => {
      pointerInside = false;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    // ---------- Scroll fade / scatter ----------
    const scatterObj = { v: 0 };
    const scrollTrigger = ScrollTrigger.create({
      trigger: mount,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        scatterObj.v = self.progress;
      },
    });

    // ---------- Fluid simulation constants ----------
    const STIFFNESS = 26;    // pull back to rest position
    const DAMPING = 4.4;     // viscosity — higher = thicker fluid
    const PUSH_RADIUS = 1.15;
    const PUSH_FORCE = 26;

    // Slow right↔left sway instead of a continuous spin
    const SWAY_SPEED = 0.22; // ~28s for a full right → left → right cycle
    const SWAY_ANGLE = 0.6;  // ±34° turn
    const SWAY_SHIFT = 0.18; // slight lateral travel so it visibly moves across

    // ---------- Animation loop ----------
    const clock = new THREE.Clock();
    let parX = 0;
    let parY = 0;
    let raf = 0;

    const animate = () => {
      // getDelta() also advances elapsedTime — read it after, never getElapsedTime()
      const dt = Math.min(0.033, clock.getDelta());
      const t = clock.elapsedTime;
      uniforms.uTime.value = t;
      uniforms.uScatter.value += (scatterObj.v - uniforms.uScatter.value) * 0.1;
      const sc = uniforms.uScatter.value;

      // --- Slow side-to-side sway (no continuous spin) / parallax ---
      const sway = Math.sin(t * SWAY_SPEED);
      parY += (mouseNDC.x * 0.3 - parY) * 0.035;
      parX += (mouseNDC.y * 0.2 - parX) * 0.035;
      group.rotation.y = sway * SWAY_ANGLE + parY;
      group.rotation.x = parX + Math.sin(t * 0.18) * 0.04;
      group.position.x = sway * SWAY_SHIFT;
      const breathe = 1 + Math.sin(t * 0.7) * 0.025;
      group.scale.setScalar(breathe + sc * 0.25);

      // --- Cursor position in the brain's local space ---
      hover += ((pointerInside ? 1 : 0) - hover) * 0.08;
      if (hover > 0.001) {
        raycaster.setFromCamera(mouseNDC, camera);
        if (raycaster.ray.intersectPlane(plane, hitWorld)) {
          group.updateMatrixWorld();
          mouseLocal.copy(hitWorld);
          group.worldToLocal(mouseLocal);
        }
      }

      // --- Spring + cursor displacement (the "liquid" part) ---
      const r2 = PUSH_RADIUS * PUSH_RADIUS;
      for (let i = 0; i < NODES; i++) {
        const o = i * 3;

        // Rest target with a gentle idle drift so it never looks frozen
        const sd = seeds[i] * 6.2831;
        const bx = basePos[o] + Math.sin(t * 0.6 + sd) * 0.018;
        const by = basePos[o + 1] + Math.cos(t * 0.5 + sd * 1.3) * 0.018;
        const bz = basePos[o + 2] + Math.sin(t * 0.55 + sd * 0.7) * 0.018;

        // Spring back toward rest
        let ax = (bx - positions[o]) * STIFFNESS;
        let ay = (by - positions[o + 1]) * STIFFNESS;
        let az = (bz - positions[o + 2]) * STIFFNESS;

        // Cursor pushes nodes away like a finger through water
        if (hover > 0.001) {
          const dx = positions[o] - mouseLocal.x;
          const dy = positions[o + 1] - mouseLocal.y;
          const dz = positions[o + 2] - mouseLocal.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < r2) {
            const d = Math.sqrt(d2) + 0.0001;
            const falloff = 1 - d2 / r2;
            const f = (falloff * falloff * PUSH_FORCE * hover) / d;
            ax += dx * f;
            ay += dy * f;
            az += dz * f;
            // Swirl so the displacement curls instead of just pushing out
            const sw = falloff * 5.0 * hover;
            ax += -dy * sw;
            ay += dx * sw;
          }
        }

        // Viscous damping
        ax -= vel[o] * DAMPING;
        ay -= vel[o + 1] * DAMPING;
        az -= vel[o + 2] * DAMPING;

        vel[o] += ax * dt;
        vel[o + 1] += ay * dt;
        vel[o + 2] += az * dt;

        positions[o] += vel[o] * dt;
        positions[o + 1] += vel[o + 1] * dt;
        positions[o + 2] += vel[o + 2] * dt;

        // Scroll scatter — blow the mesh apart as the hero leaves
        if (sc > 0.001) {
          const px = positions[o];
          const py = positions[o + 1];
          const pz = positions[o + 2];
          const len = Math.sqrt(px * px + py * py + pz * pz) + 0.0001;
          const push = sc * (1.1 + seeds[i] * 1.6);
          positions[o] += (px / len) * push;
          positions[o + 1] += (py / len) * push + sc * (0.4 + seeds[i] * 0.9);
          positions[o + 2] += (pz / len) * push;
        }
      }
      posAttr.needsUpdate = true;

      // --- Rebuild edges from the live node positions ---
      for (let e = 0; e < edgeCount; e++) {
        for (let s = 0; s < 2; s++) {
          const n = edgePairs[e * 2 + s] * 3;
          const o = (e * 2 + s) * 3;
          linePos[o] = positions[n];
          linePos[o + 1] = positions[n + 1];
          linePos[o + 2] = positions[n + 2];
        }
      }
      lineAttr.needsUpdate = true;

      for (let r = 0; r < rays.length; r++) {
        const n = rays[r] * 3;
        let o = r * 2 * 3;
        burstPos[o] = positions[0];
        burstPos[o + 1] = positions[1];
        burstPos[o + 2] = positions[2];
        o += 3;
        burstPos[o] = positions[n];
        burstPos[o + 1] = positions[n + 1];
        burstPos[o + 2] = positions[n + 2];
      }
      burstAttr.needsUpdate = true;

      const fade = 1 - Math.min(1, sc * 1.2);
      lineMat.opacity = 0.22 * fade;
      burstMat.opacity = (0.35 + 0.15 * Math.sin(t * 1.4)) * fade;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // ---------- Resize ----------
    const onResize = () => {
      const W = mount.clientWidth;
      const H = mount.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      scrollTrigger.kill();
      renderer.dispose();
      geometry.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      burstGeo.dispose();
      burstMat.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" />;
}
