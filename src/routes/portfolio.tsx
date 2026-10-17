import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import logoMark from "@/assets/oday-mark.svg";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioRoute,
  head: () => ({
    meta: [
      { title: "Portfolio — Oday" },
      {
        name: "description",
        content:
          "The full portfolio of Oday — corporate websites, platforms, online stores and mobile apps designed, built and maintained end to end.",
      },
      { property: "og:title", content: "Portfolio — Oday" },
      { property: "og:url", content: `${SITE_URL}/portfolio` },
      {
        property: "og:description",
        content: "Corporate websites, platforms, online stores and mobile apps built end to end.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/portfolio` }],
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
    [active],
  );

  // Reveal cards on mount and whenever the filter changes
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pr-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "power3.out", overwrite: true },
      );
    }, grid);
    return () => ctx.revert();
  }, [active]);

  return (
    <>
      <div className="grain-overlay" />
      <div className="dr-page">
        <Starfield />
        <header className="dr-page-top">
          <Link to="/" className="logo dr-logo">
            <img className="icon" src={logoMark} alt="" />
            <span>ODAY</span>
          </Link>
          <a className="contact-btn p-reveal" href="mailto:info@oday.dev">
            Let&apos;s Talk <span className="arrow">↗</span>
          </a>
        </header>

        <section className="portfolio-section">
          <div className="pf-hero">
            <div className="pf-eyebrow">
              <span className="pr-dot" />[ PORTFOLIO · {projects.length} PROJECTS ]
            </div>
            <h1 className="pf-title">
              All my <em>work.</em>
            </h1>
            <p className="pf-sub">
              Nine years of corporate websites, platforms, online stores and now mobile apps —
              designed, built and maintained end to end. Filter by type below.
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
              <ProjectCard project={p} index={i} key={p.slug} />
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
