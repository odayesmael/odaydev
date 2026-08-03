import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: "Real-Time Asset Insights",
    body: "Obtain instant visibility into your assets and technologies. Monitor your technology coverage across assets. Determine the trustworthiness of your assets data.",
  },
  {
    title: "Assets never sleep",
    body: "Track historical events and asset changes. Get notified of any variation or anomalies across your asset inventory landscape.",
  },
  {
    title: "Dynamic, On-Demand Reporting",
    body: "Access a wide range of pre-defined reports on critical areas like endpoint security and compliance — or craft bespoke reports tailored to your unique requirements.",
  },
];

const KNOW_ITEMS = [
  {
    n: "1.0",
    title: "Security incident",
    body: "Boost your security incident investigations by gaining full visibility into your asset landscape.",
  },
  {
    n: "2.0",
    title: "Instant Compliance",
    body: "Minimize time to inventory, secure, and comply across regulated environments.",
  },
  {
    n: "3.0",
    title: "AI-Powered Data Precision",
    body: "Experience unparalleled asset data accuracy with AssetAtlas's AI-driven reconciliation, categorization, and enrichment.",
  },
];

export function ProductPage() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(".pp-eyebrow", {
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".pp-hero", start: "top 85%" },
      });
      gsap.from(".pp-title-word", {
        y: 80, opacity: 0, stagger: 0.15, duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: ".pp-hero", start: "top 80%" },
      });
      gsap.from(".pp-sub, .pp-cta", {
        y: 24, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".pp-hero", start: "top 70%" },
      });
      gsap.from(".pp-feat-card", {
        y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".pp-features", start: "top 80%" },
      });
      gsap.from(".pp-know-row", {
        y: 24, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".pp-know", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pp-root" ref={ref}>
      {/* HERO */}
      <div className="pp-hero">
        <div className="pp-hero-glow" aria-hidden />
        <div className="pp-eyebrow">[ &nbsp;O U R&nbsp;&nbsp;P R O D U C T&nbsp; ]</div>
        <h1 className="pp-title">
          <span className="pp-title-word">Asset</span>{" "}
          <span className="pp-title-word pp-title-accent">Atlas</span>
        </h1>
        <p className="pp-sub">
          Reduce your attack surface, eliminate shadow IT, and stay compliant with a
          comprehensive, unified view of your digital assets.
        </p>
        <a href="#contact" className="pp-cta">
          Start Free Trial <span className="pp-cta-dot" />
        </a>
      </div>

      {/* FEATURES */}
      <div className="pp-features">
        {FEATURES.map((f, i) => (
          <article className="pp-feat-card" key={f.title}>
            <span className="pp-feat-num">[ {(i + 1).toString().padStart(2, "0")} ]</span>
            <h3 className="pp-feat-title">{f.title}</h3>
            <p className="pp-feat-body">{f.body}</p>
            <span className="pp-feat-arrow" aria-hidden>↗</span>
          </article>
        ))}
      </div>

      {/* KNOW IT ALL */}
      <div className="pp-know">
        <div className="pp-know-head">
          <div className="pp-eyebrow">[ &nbsp;ASSETATLAS&nbsp; ]</div>
          <h2 className="pp-know-title">
            Know it all,<br />secure it all
          </h2>
          <p className="pp-know-lead">
            AI-powered data precision: experience unparalleled asset data accuracy
            with AssetAtlas's AI-driven reconciliation, categorization, and enrichment.
          </p>
        </div>

        <ul className="pp-know-list">
          {KNOW_ITEMS.map((it) => (
            <li className="pp-know-row" key={it.n}>
              <div className="pp-know-num">[ {it.n} ]</div>
              <h3 className="pp-know-row-title">{it.title}</h3>
              <p className="pp-know-row-body">{it.body}</p>
              <span className="pp-know-arrow" aria-hidden>↗</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
