import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const featured = projects.slice(0, 9);

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
            [ 04 / SELECTED WORK ]
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
          {featured.map((p, i) => (
            <a
              className="pr-card"
              key={p.domain}
              data-num={String(i + 1).padStart(2, "0")}
              href={p.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="pr-card-top">
                <span className="pr-num">[ {String(i + 1).padStart(2, "0")} ]</span>
                <span className="pr-cat">{p.category}</span>
              </div>

              <div className="pr-card-body">
                <h3 className="pr-name">{p.title}</h3>
                <p className="pr-desc">{p.body}</p>
              </div>

              <ul className="pr-tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              <div className="pr-card-foot">
                <span className="pr-domain">{p.domain}</span>
                <span className="pr-visit">
                  Visit <span className="pr-arrow">↗</span>
                </span>
              </div>
            </a>
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
