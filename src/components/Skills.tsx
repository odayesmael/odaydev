import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { name: "WordPress", pct: 94 },
  { name: "CSS3", pct: 96 },
  { name: "Web Design", pct: 90 },
  { name: "HTML5", pct: 90 },
  { name: "SEO", pct: 88 },
  { name: "JavaScript", pct: 77 },
];

export function Skills() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".sk-head > *"), {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });

      gsap.from(section.querySelectorAll(".sk-row"), {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: section.querySelector(".sk-list"), start: "top 82%" },
      });

      // Animate each bar fill + counting number when it scrolls in
      section.querySelectorAll<HTMLElement>(".sk-row").forEach((row) => {
        const fill = row.querySelector<HTMLElement>(".sk-fill")!;
        const value = row.querySelector<HTMLElement>(".sk-val")!;
        const pct = Number(row.dataset.pct || "0");
        const counter = { v: 0 };

        gsap.to(fill, {
          width: `${pct}%`,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
        gsap.to(counter, {
          v: pct,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%" },
          onUpdate: () => {
            value.textContent = `${Math.round(counter.v)}%`;
          },
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="skills-section" id="skills" ref={ref}>
      <div className="skills-inner">
        <div className="sk-head">
          <div className="sk-eyebrow">
            <span className="sk-dot" />
            [ 03 / SKILLS ]
          </div>
          <h2 className="sk-title">
            Tools I trust,<br />
            <em>sharpened over 9 years.</em>
          </h2>
          <p className="sk-sub">
            Front-end craft, back-end logic and the platforms in between — everything I need to take any kind of site from blank canvas to launch.
          </p>
        </div>

        <div className="sk-list">
          {SKILLS.map((s) => (
            <div className="sk-row" key={s.name} data-pct={s.pct}>
              <div className="sk-row-top">
                <span className="sk-name">{s.name}</span>
                <span className="sk-val">0%</span>
              </div>
              <div className="sk-bar">
                <span className="sk-fill" style={{ width: 0 }} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
