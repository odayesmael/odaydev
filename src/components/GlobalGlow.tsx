import { useEffect, useRef } from "react";
import * as THREE from "three";

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
  uniform vec2 uMouse;     // 0..1, eased
  uniform float uTime;

  void main() {
    vec2 px = vUv * uResolution;

    // Dot matrix
    float spacing = 26.0;
    vec2 g = mod(px, spacing) - spacing * 0.5;
    float d = length(g);
    float dot = smoothstep(1.1, 0.3, d);

    // Aspect-corrected mouse glow pool
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vUv;       p.x *= aspect;
    vec2 m = uMouse;    m.x *= aspect;
    float md = length(p - m);

    float glow = exp(-md * 2.6) * 0.55;
    float halo = exp(-md * 0.9) * 0.10;

    vec3 green = vec3(0.29, 0.87, 0.50);
    vec3 deepGreen = vec3(0.01, 0.06, 0.03);

    // Dark green vignette — corners fall into deep green/black
    vec2 vc = vUv - 0.5;
    float vd = length(vc);
    float vignette = smoothstep(0.35, 0.95, vd);

    vec3 col = green * (dot * 0.18);
    col += green * (glow + halo);
    // Mix toward deep green at the edges
    col = mix(col, deepGreen, vignette * 0.85);

    float alpha = clamp(dot * 0.22 + glow + halo + vignette * 0.55, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function GlobalGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
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

    const target = new THREE.Vector2(0.5, 0.5);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      target.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, 0.06); // elastic damping
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="global-glow-canvas" aria-hidden />;
}
