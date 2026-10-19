import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import { useMessages } from "@/i18n";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: String(new Set(projects.map((p) => p.category)).size), label: "Industries served" },
  { value: String(projects.length), label: "Projects shipped & maintained" },
  { value: "3", label: "Platforms — Web, iOS, Android" },
  { value: "3", label: "Working languages — EN, AR, TR" },
];

const GROUPS = [
  {
    n: "01",
    title: "Front-end",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML5 / CSS3",
      "GSAP",
      "Three.js",
    ],
  },
  {
    n: "02",
    title: "Back-end & CMS",
    items: [
      "PHP",
      "WordPress",
      "WooCommerce",
      "ACF / CPT UI",
      "Elementor",
      "Node.js",
      "MySQL",
      "REST APIs",
    ],
  },
  {
    n: "03",
    title: "Mobile apps",
    items: [
      "iOS & Android",
      "App Store releases",
      "Google Play",
      "In-app subscriptions",
      "AI features",
      "RTL & i18n",
    ],
  },
  {
    n: "04",
    title: "Design & UX",
    items: ["Figma", "UI design", "UX flows", "Responsive", "Accessibility", "Design systems"],
  },
  {
    n: "05",
    title: "SEO & Performance",
    items: ["Technical SEO", "Core Web Vitals", "Schema markup", "Analytics", "Multilingual SEO"],
  },
  {
    n: "06",
    title: "Hosting & Ops",
    items: ["Git & GitHub", "Vercel", "Cloudflare", "cPanel", "WHMCS", "Shopify"],
  },
];

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const t = useMessages();

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
      gsap.from(section.querySelectorAll(".sk-stat"), {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: section.querySelector(".sk-stats"), start: "top 85%" },
      });
      gsap.from(section.querySelectorAll(".sk-group"), {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section.querySelector(".sk-groups"), start: "top 85%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="skills-section" id="skills" ref={ref}>
      <div className="skills-inner">
        <div className="sk-head">
          <div className="sk-eyebrow">
            <span className="sk-dot" />[ {t.skills.eyebrow} ]
          </div>
          <h2 className="sk-title">
            {t.skills.title[0]}
            <br />
            <em>{t.skills.title[1]}</em>
          </h2>
          <p className="sk-sub">{t.skills.sub}</p>
        </div>

        <div className="sk-stats">
          {STATS.map((s, i) => (
            <div className="sk-stat" key={s.label}>
              <span className="sk-stat-value">{s.value}</span>
              <span className="sk-stat-label">{t.skills.stats[i]}</span>
            </div>
          ))}
        </div>

        <div className="sk-groups">
          {GROUPS.map((g, gi) => (
            <div className="sk-group" key={g.title}>
              <div className="sk-group-head">
                <span className="sk-group-num">[ {g.n} ]</span>
                <h3 className="sk-group-title">{t.skills.groups[gi]}</h3>
              </div>
              <ul className="sk-group-list">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
