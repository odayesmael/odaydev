import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    n: "1.0",
    title: "Hyperautomation",
    accent: "10X Faster Incident Response",
    body: "We transform SOC operations through hyperautomation, leveraging best-of-breed next-generation SOAR platforms to automate incident responses and accelerate threat remediation.",
  },
  {
    n: "2.0",
    title: "SIEM augmentation",
    accent: "Unleash Your SIEM",
    body: "Leveraging two decades of SIEM expertise, deploying advanced analytics and custom detections tailored to your business requirements.",
  },
  {
    n: "3.0",
    title: "Threat Hunting",
    accent: "Hunt. Detect. Disrupt.",
    body: "Proactive, hypothesis-driven hunts across cloud, endpoint and identity telemetry — uncovering adversaries before they reach their objective.",
  },
  {
    n: "4.0",
    title: "24/7 Monitoring",
    accent: "Always-on Defense",
    body: "Continuous surveillance backed by elite human responders, blending AI triage with deep human expertise for round-the-clock coverage.",
  },
];

function ShieldIcon() {
  return (
    <svg viewBox="0 0 40 40" width="32" height="32" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="16" stroke="#5dff8a" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
      <path d="M14 20 l4 4 l8 -8" stroke="#5dff8a" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatWeOffer() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const section = ref.current!;
    const track = trackRef.current!;
    const pin = pinRef.current!;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      const ctx = gsap.context(() => {
        gsap.from(section.querySelector(".wwo-eyebrow"), {
          y: 20, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        });
        gsap.from(section.querySelector(".wwo-title"), {
          y: 30, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        });

        const getDistance = () => track.scrollWidth - track.clientWidth;

        const tween = gsap.to(track, {
          scrollLeft: () => getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + getDistance(),
            pin: true,
            scrub: 1.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.round(self.progress * (CARDS.length - 1));
              setPage(i);
            },
          },
        });

        return () => { tween.kill(); };
      }, section);
      return () => ctx.revert();
    });

    mm.add("(max-width: 900px)", () => {
      const onScroll = () => {
        const card = track.querySelector(".wwo-card") as HTMLElement | null;
        if (!card) return;
        const w = card.offsetWidth + 24;
        setPage(Math.round(track.scrollLeft / w));
      };
      track.addEventListener("scroll", onScroll, { passive: true });
      return () => track.removeEventListener("scroll", onScroll);
    });

    return () => mm.revert();
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".wwo-card") as HTMLElement | null;
    if (!card) return;

    if (window.matchMedia("(min-width: 901px)").matches) {
      const st = ScrollTrigger.getAll().find(
        (s) => s.pin === pinRef.current,
      );
      if (st) {
        const progress = i / (CARDS.length - 1);
        const target = st.start + (st.end - st.start) * progress;
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }
    }
    const w = card.offsetWidth + 24;
    track.scrollTo({ left: w * i, behavior: "smooth" });
  };

  return (
    <section className="wwo-section" ref={ref}>
      <div className="wwo-pin" ref={pinRef}>
        <div className="wwo-grid">
          <div className="wwo-left">
            <div className="wwo-eyebrow">[ &nbsp;OUR SERVICES&nbsp; ]</div>
            <h2 className="wwo-title">
              What we<br />offer
            </h2>
            <div className="wwo-keep">
              <span className="wwo-arrow">↳</span>
              <span><strong>Keep scrolling</strong> to learn more</span>
            </div>
          </div>

          <div className="wwo-track" ref={trackRef}>
            {CARDS.map((c) => (
              <article className="wwo-card" key={c.n}>
                <div className="wwo-card-head">
                  <ShieldIcon />
                  <span className="wwo-num">[ {c.n} ]</span>
                </div>
                <h3 className="wwo-card-title">{c.title}</h3>
                <p className="wwo-card-accent">{c.accent}</p>
                <p className="wwo-card-body">{c.body}</p>
                <div className="wwo-dots-bg" aria-hidden />
              </article>
            ))}
          </div>
        </div>

        <div className="wwo-pager">
          {CARDS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`wwo-dot ${i === page ? "is-on" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
