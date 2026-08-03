import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DotDnaMark() {
  // Angular arrow mark reused for the corner CTA
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <path d="M5 5 L19 19" />
      <path d="M19 5 L12 12" />
      <path d="M5 19 L9 15" />
      <circle cx="20" cy="4" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---------- Per-service line-art glyphs (match the neon wire aesthetic) ---------- */

function DesignGlyph() {
  return (
    <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeWidth="1" className="bento-glyph-svg">
      <rect x="40" y="36" width="160" height="128" rx="8" opacity="0.5" />
      <line x1="40" y1="64" x2="200" y2="64" opacity="0.4" />
      <circle cx="52" cy="50" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="62" cy="50" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="72" cy="50" r="2.5" fill="currentColor" stroke="none" />
      <rect x="56" y="82" width="60" height="60" rx="6" opacity="0.35" />
      <line x1="132" y1="86" x2="184" y2="86" opacity="0.4" />
      <line x1="132" y1="104" x2="184" y2="104" opacity="0.3" />
      <line x1="132" y1="122" x2="164" y2="122" opacity="0.3" />
      <circle cx="120" cy="100" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DevGlyph() {
  return (
    <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeWidth="1.4" className="bento-glyph-svg" strokeLinecap="round" strokeLinejoin="round">
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx="120" cy="100" r={20 + i * 10} opacity={0.06 + i * 0.02} strokeWidth="1" />
      ))}
      <path d="M96 78 L72 100 L96 122" />
      <path d="M144 78 L168 100 L144 122" />
      <line x1="130" y1="72" x2="110" y2="128" opacity="0.7" />
    </svg>
  );
}

function SeoGlyph() {
  return (
    <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeWidth="1.2" className="bento-glyph-svg" strokeLinecap="round">
      <line x1="52" y1="150" x2="200" y2="150" opacity="0.4" />
      <rect x="66" y="112" width="18" height="38" rx="3" opacity="0.4" />
      <rect x="100" y="88" width="18" height="62" rx="3" opacity="0.5" />
      <rect x="134" y="64" width="18" height="86" rx="3" opacity="0.6" />
      <path d="M60 120 L110 92 L150 66 L188 44" opacity="0.8" />
      <path d="M170 44 L188 44 L188 62" opacity="0.8" />
      <circle cx="150" cy="66" r="16" opacity="0.6" />
      <line x1="162" y1="78" x2="176" y2="92" opacity="0.6" />
    </svg>
  );
}

function UxGlyph() {
  return (
    <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeWidth="1.2" className="bento-glyph-svg" strokeLinecap="round" strokeLinejoin="round">
      <rect x="52" y="48" width="96" height="120" rx="10" opacity="0.35" />
      <rect x="92" y="70" width="96" height="90" rx="10" opacity="0.6" />
      <line x1="108" y1="94" x2="172" y2="94" opacity="0.4" />
      <line x1="108" y1="112" x2="172" y2="112" opacity="0.3" />
      <line x1="108" y1="130" x2="148" y2="130" opacity="0.3" />
      <path d="M150 128 L150 168 L160 158 L168 174 L174 170 L166 155 L180 155 Z" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

const SERVICES = [
  {
    n: "1.0",
    title: "Web Design",
    Glyph: DesignGlyph,
    body: "Brand-driven, pixel-perfect interfaces. From wireframes to polished, fully responsive layouts that feel right on every screen.",
    tags: ["Figma", "Responsive", "Brand"],
  },
  {
    n: "2.0",
    title: "Web Development",
    Glyph: DevGlyph,
    body: "Corporate sites, web apps, online stores and custom platforms — hand-coded, standards-compliant, built to scale and easy to maintain.",
    tags: ["JavaScript", "PHP", "WordPress", "API"],
  },
  {
    n: "3.0",
    title: "SEO Optimization",
    Glyph: SeoGlyph,
    body: "On-page SEO, Core Web Vitals and clean semantic markup so your site loads fast and ranks where your customers are searching.",
    tags: ["On-page", "Speed", "Analytics"],
  },
  {
    n: "4.0",
    title: "UI / UX Design",
    Glyph: UxGlyph,
    body: "Intuitive user journeys and interaction design grounded in real usability — interfaces people understand without having to think.",
    tags: ["UX", "Prototyping", "Accessibility"],
  },
];

export function Services() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bento-header > *", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".bento-header", start: "top 85%" },
      });
      gsap.from(".bento-card", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".bento-grid", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="services-bento" id="services" ref={ref}>
      <div className="bento-header">
        <div className="bento-eyebrow">
          <span className="bento-dot" />
          [ 02 / SERVICES ]
        </div>
        <h2 className="bento-title">
          What I <br />
          <em>do best.</em>
        </h2>
        <p className="bento-sub">
          A focused set of services covering the full lifecycle of a website — design, build, optimise and refine.
        </p>
      </div>

      <div className="bento-grid bento-grid-services">
        {SERVICES.map((s, i) => {
          const Glyph = s.Glyph;
          return (
            <article className={`bento-card${i === 1 ? " is-active" : ""}`} key={s.n}>
              <div className="bento-card-head">
                <span className="bento-num">[ {s.n} ]</span>
                <button className="bento-cta" aria-label={`${s.title} details`}>
                  <DotDnaMark />
                </button>
              </div>
              <div className="bento-glyph">
                <Glyph />
              </div>
              <div className="bento-card-foot">
                <h3 className="bento-title-row">
                  <span className="bento-pulse-dot" />
                  {s.title}
                </h3>
                <p>{s.body}</p>
                <ul className="bento-tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
