import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMessages } from "@/i18n";
import { LocaleLink } from "./LocaleLink";

gsap.registerPlugin(ScrollTrigger);

const REPO = "https://github.com/odayesmael/app-builder-guide";

/** Stack names — proper nouns, the same in every language. */
const CHIPS = ["Expo", "React Native", "Supabase", "RevenueCat", "App Store", "Google Play"];

/** Home-page spotlight for the open-source Claude skill. */
export function SkillSpotlight() {
  const ref = useRef<HTMLElement>(null);
  const t = useMessages().skill;

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".sks-reveal"), {
        y: 32,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%" },
      });
      gsap.from(section.querySelector(".sks-terminal"), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="skill-spotlight" id="skill" ref={ref} aria-labelledby="sks-title">
      <div className="sks-card">
        <div className="sks-copy">
          <div className="as-eyebrow sks-reveal">
            <span className="as-dot" />[ {t.eyebrow} ]
          </div>

          <h2 className="sks-title sks-reveal" id="sks-title">
            {t.title[0]} <em>{t.title[1]}</em>
          </h2>

          <p className="sks-body sks-reveal">{t.homeBody}</p>

          <ul className="as-chips sks-reveal">
            {CHIPS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <div className="as-actions sks-reveal">
            <LocaleLink to="/skill" className="as-btn as-btn-primary">
              {t.homeCta} <span aria-hidden>→</span>
            </LocaleLink>
            <a className="as-btn" href={REPO} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        {/* A terminal standing in for the install, decorative only. */}
        <div className="sks-terminal" aria-hidden>
          <div className="sks-term-bar">
            <span className="sks-dot sks-dot-r" />
            <span className="sks-dot sks-dot-y" />
            <span className="sks-dot sks-dot-g" />
            <span className="sks-term-path">~/.claude/skills</span>
          </div>
          <pre className="sks-term-body" dir="ltr">
            <span className="sks-line">
              <span className="sks-prompt">$</span> git clone {REPO}
            </span>
            <span className="sks-line sks-dim">Cloning into 'mobile-app-playbook'…</span>
            <span className="sks-line sks-ok">✓ SKILL.md + 12 references</span>
            <span className="sks-line sks-spacer" />
            <span className="sks-line">
              <span className="sks-prompt sks-prompt-ai">›</span> I want to build an app for…
            </span>
            <span className="sks-line sks-dim sks-caret">Reading the playbook</span>
          </pre>
        </div>
      </div>
    </section>
  );
}
