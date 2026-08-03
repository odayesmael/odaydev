import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    n: "01",
    title: "Manufacturing & Industrial",
    body: "Hardening OT/IoT estates against ransomware, supply-chain compromise and operational sabotage — without slowing the production line.",
  },
  {
    n: "02",
    title: "Finance & Fintech",
    body: "Continuous threat modeling, transaction-fraud telemetry and regulator-grade controls built for high-velocity capital environments.",
  },
  {
    n: "03",
    title: "Healthcare & Energy",
    body: "Protecting patient data, clinical systems and grid-scale infrastructure where downtime is measured in lives, not lost revenue.",
  },
];

export function Industries() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelector(".ind-eyebrow"), {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      gsap.from(section.querySelector(".ind-headline"), {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      gsap.from(section.querySelector(".ind-sub"), {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      gsap.from(section.querySelectorAll(".ind-col"), {
        y: 30,
        opacity: 0,
        stagger: 0.18,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="industries-section" ref={ref}>
      <div className="ind-beam" aria-hidden />
      <div className="ind-inner">
        <div className="ind-eyebrow">
          <span className="ind-eyebrow-icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            </svg>
          </span>
          We are a boutique cyber security company
        </div>

        <h2 className="ind-headline">
          <span className="ind-light">We are</span>{" "}
          <span className="ind-icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="12" cy="12" r="10" strokeDasharray="2 3" />
              <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
            </svg>
          </span>{" "}
          <span className="ind-bright">a boutique cyber</span>
          <br />
          <span className="ind-bright">security company</span>
        </h2>

        <p className="ind-sub">
          At NULLSEC, our expertise extends across diverse sectors such as manufacturing, finance, healthcare and energy — meticulously addressing the distinct security requirements of each industry.
        </p>

        <div className="ind-grid">
          {ITEMS.map((c) => (
            <div className="ind-col" key={c.n}>
              <div className="ind-num">[ {c.n} ]</div>
              <h3 className="ind-title">{c.title}</h3>
              <p className="ind-body">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
