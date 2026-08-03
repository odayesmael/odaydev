import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { GlobalGlow } from "@/components/GlobalGlow";
import { projects } from "@/data/projects";
import logoMark from "@/assets/oday-mark.svg";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioRoute,
  head: () => ({
    meta: [
      { title: "Portfolio — Oday Ismail" },
      {
        name: "description",
        content:
          "The full portfolio of Oday Ismail — corporate websites, platforms, web apps and online stores designed, built and maintained end to end.",
      },
      { property: "og:title", content: "Portfolio — Oday Ismail" },
      {
        property: "og:description",
        content: "Corporate websites, platforms, web apps and online stores built end to end.",
      },
    ],
  }),
});

function PortfolioRoute() {
  const [active, setActive] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, []);

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  // Reveal cards on mount and whenever the filter changes
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pr-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "power3.out", overwrite: true }
      );
    }, grid);
    return () => ctx.revert();
  }, [active]);

  return (
    <>
      <GlobalGlow />
      <div className="grain-overlay" />
      <div className="dr-page">
        <Starfield />
        <header className="dr-page-top">
          <Link to="/" className="logo dr-logo">
            <img className="icon" src={logoMark} alt="" />
            <span>ODAY</span>
          </Link>
          <a className="contact-btn" href="mailto:odaiesmael303@gmail.com">
            Hire me <span className="arrow">↗</span>
          </a>
        </header>

        <section className="portfolio-section">
          <div className="pf-hero">
            <div className="pf-eyebrow">
              <span className="pr-dot" />
              [ PORTFOLIO · {projects.length} PROJECTS ]
            </div>
            <h1 className="pf-title">
              All my <em>work.</em>
            </h1>
            <p className="pf-sub">
              Nine years of corporate websites, platforms, web apps and online stores — designed,
              built and maintained end to end. Filter by type below.
            </p>
          </div>

          <div className="pf-filters" role="tablist" aria-label="Filter projects by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active === c}
                className={`pf-filter ${active === c ? "is-active" : ""}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="pr-grid pf-grid" ref={gridRef}>
            {visible.map((p, i) => (
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
        </section>

        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
