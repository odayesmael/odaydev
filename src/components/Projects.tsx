import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, featuredProjects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { LocaleLink } from "./LocaleLink";
import { fmt, useMessages } from "@/i18n";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const t = useMessages();

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".pr-head > *"), {
        y: 26,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 82%" },
      });
      gsap.from(section.querySelectorAll(".pr-card"), {
        y: 50,
        opacity: 0,
        stagger: 0.08,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: section.querySelector(".pr-grid"), start: "top 82%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="projects-section" id="work" ref={ref}>
      <div className="pr-inner">
        <div className="pr-head">
          <div className="pr-eyebrow">
            <span className="pr-dot" />[ {t.projects.eyebrow} ]
          </div>
          <h2 className="pr-title">
            {t.projects.title[0]}
            <br />
            <em>{t.projects.title[1]}</em>
          </h2>
          <p className="pr-sub">{t.projects.sub}</p>
        </div>

        <div className="pr-grid">
          {featuredProjects.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.slug} />
          ))}
        </div>

        <div className="pr-viewall-wrap">
          <LocaleLink to="/portfolio" className="pr-viewall">
            {fmt(t.projects.viewAll, { n: projects.length })} <span className="pr-arrow">→</span>
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
