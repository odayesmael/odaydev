import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, featuredProjects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);


export function Projects() {
  const ref = useRef<HTMLElement>(null);

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
            <span className="pr-dot" />
            [ 03 / SELECTED WORK ]
          </div>
          <h2 className="pr-title">
            Projects I've<br />
            <em>shipped &amp; shaped.</em>
          </h2>
          <p className="pr-sub">
            A selection of corporate sites, platforms and online stores I've designed, built and maintained — from data-protection firms to e-commerce.
          </p>
        </div>

        <div className="pr-grid">
          {featuredProjects.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.slug} />
          ))}
        </div>

        <div className="pr-viewall-wrap">
          <Link to="/portfolio" className="pr-viewall">
            View all {projects.length} projects <span className="pr-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
