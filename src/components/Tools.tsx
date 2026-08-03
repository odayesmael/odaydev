import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOOLS = [
  "Claude",
  "Cursor",
  "GitHub Copilot",
  "Lovable",
  "Antigravity",
  "v0",
  "Windsurf",
  "ChatGPT",
  "Gemini",
  "Bolt",
  "Perplexity",
  "Midjourney",
  "cPanel",
  "WHMCS",
  "Git",
];

/** AI-assisted workflow & tooling strip — sits above the services grid. */
export function Tools() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelector(".sk-tools-label"), {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 88%" },
      });
      gsap.from(section.querySelectorAll(".sk-chip"), {
        y: 16,
        opacity: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 88%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="tools-section" ref={ref}>
      <div className="tools-inner">
        <div className="sk-tools-label">
          <span className="sk-dot" />
          [ AI-ASSISTED WORKFLOW &amp; TOOLS ]
        </div>
        <div className="sk-chips">
          {TOOLS.map((t) => (
            <span className="sk-chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
