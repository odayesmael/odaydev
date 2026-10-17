import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { PageHeader } from "@/components/PageHeader";
import { fmt, localeFromParam, messagesFor, useMessages } from "@/i18n";
import { localeLinks, localeMeta } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/portfolio")({
  component: PortfolioRoute,
  head: ({ params }) => {
    const locale = localeFromParam(params.locale);
    const t = messagesFor(locale);
    return {
      meta: [
        { title: t.meta.portfolioTitle },
        { name: "description", content: t.meta.portfolioDescription },
        { property: "og:title", content: t.meta.portfolioTitle },
        { property: "og:description", content: t.meta.portfolioDescription },
        ...localeMeta(locale, "/portfolio"),
      ],
      links: localeLinks(locale, "/portfolio"),
    };
  },
});

const ALL = "__all";

function PortfolioRoute() {
  const t = useMessages();
  const [active, setActive] = useState(ALL);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return [ALL, ...Array.from(set)];
  }, []);

  const visible = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
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
        <PageHeader />

        <section className="portfolio-section">
          <div className="pf-hero">
            <div className="pf-eyebrow">
              <span className="pr-dot" />[ {fmt(t.portfolio.eyebrow, { n: projects.length })} ]
            </div>
            <h1 className="pf-title">
              {t.portfolio.title[0]} <em>{t.portfolio.title[1]}</em>
            </h1>
            <p className="pf-sub">{t.portfolio.sub}</p>
          </div>

          <div className="pf-filters" role="tablist" aria-label={t.portfolio.filterLabel}>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active === c}
                className={`pf-filter ${active === c ? "is-active" : ""}`}
                onClick={() => setActive(c)}
              >
                {c === ALL ? t.portfolio.all : (t.categories[c] ?? c)}
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
