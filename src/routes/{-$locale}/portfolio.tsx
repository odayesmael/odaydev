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
import { fmt, localeFromParam, localePath, localizeProject, messagesFor, useLocale, useMessages } from "@/i18n";
import type { Project } from "@/data/projects";
import { localeLinks, localeMeta, ogImageMeta } from "@/i18n/seo";
import { SITE_URL } from "@/lib/site";

type Search = { type?: string; stack?: string; q?: string };

export const Route = createFileRoute("/{-$locale}/portfolio")({
  component: PortfolioRoute,
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: typeof s.type === "string" && s.type ? s.type : undefined,
    stack: typeof s.stack === "string" && s.stack ? s.stack : undefined,
    q: typeof s.q === "string" && s.q ? s.q.slice(0, 60) : undefined,
  }),
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
        ...ogImageMeta(locale, "portfolio", t.meta.portfolioTitle),
      ],
      links: localeLinks(locale, "/portfolio"),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t.meta.portfolioTitle,
            description: t.meta.portfolioDescription,
            url: `${SITE_URL}${localePath(locale, "/portfolio")}`,
            inLanguage: locale,
            author: { "@id": `${SITE_URL}/#person` },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: projects.length,
              itemListElement: projects.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": p.kind === "app" ? "SoftwareApplication" : "WebSite",
                  name: p.title,
                  url: p.url,
                  description: localizeProject(p, locale).body,
                  ...(p.kind === "app" ? { operatingSystem: "iOS, Android", applicationCategory: "LifestyleApplication" } : {}),
                  creator: { "@id": `${SITE_URL}/#person` },
                },
              })),
            },
          }),
        },
      ],
    };
  },
});

const ALL = "__all";
const STACKS = ["wordpress", "shopify", "react", "app"] as const;

/** Which technology bucket(s) a project belongs to, derived from its tags. */
function stacksOf(p: Project): string[] {
  const tags = p.tags.map((t) => t.toLowerCase());
  const out: string[] = [];
  if (tags.some((t) => t === "wordpress" || t === "woocommerce")) out.push("wordpress");
  if (tags.includes("shopify")) out.push("shopify");
  if (tags.includes("react")) out.push("react");
  if (p.kind === "app") out.push("app");
  return out;
}

const norm = (s: string) =>
  s
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function PortfolioRoute() {
  const t = useMessages();
  const locale = useLocale();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(search.q ?? "");

  const active = search.type ?? ALL;
  const stack = search.stack ?? ALL;

  const setSearch = (next: Partial<Search>) =>
    navigate({
      search: (prev: Search) => {
        const merged = { ...prev, ...next };
        return {
          type: merged.type && merged.type !== ALL ? merged.type : undefined,
          stack: merged.stack && merged.stack !== ALL ? merged.stack : undefined,
          q: merged.q ? merged.q : undefined,
        };
      },
      replace: true,
      resetScroll: false,
      viewTransition: false,
    } as never);

  // Debounce the search box into the URL
  useEffect(() => {
    const id = window.setTimeout(() => {
      if ((search.q ?? "") !== query.trim()) setSearch({ q: query.trim() });
    }, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return [ALL, ...Array.from(set)];
  }, []);

  const index = useMemo(
    () =>
      projects.map((p) => {
        const lp = localizeProject(p, locale);
        return {
          p,
          stacks: stacksOf(p),
          text: norm([lp.title, lp.body, lp.categoryLabel, lp.domain, ...lp.tags].join(" ")),
        };
      }),
    [locale],
  );

  const q = norm(search.q ?? "");
  const visible = useMemo(
    () =>
      index
        .filter(
          (x) =>
            (active === ALL || x.p.category === active) &&
            (stack === ALL || x.stacks.includes(stack)) &&
            (!q || q.split(/\s+/).every((w) => x.text.includes(w))),
        )
        .map((x) => x.p),
    [index, active, stack, q],
  );

  // Reveal cards on mount and whenever the filters change
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pr-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: "power3.out", overwrite: true },
      );
    }, grid);
    return () => ctx.revert();
  }, [active, stack, q]);

  const filtered = active !== ALL || stack !== ALL || !!q;

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

          <div className="pf-controls">
            <label className="pf-search">
              <span className="sr-only">{t.portfolio.search}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.portfolio.searchPlaceholder}
                maxLength={60}
                enterKeyHint="search"
              />
            </label>

            <div className="pf-row">
              <span className="pf-row-label">{t.portfolio.typeLabel}</span>
              <div className="pf-filters" role="group" aria-label={t.portfolio.filterLabel}>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active === c}
                    className={`pf-filter ${active === c ? "is-active" : ""}`}
                    onClick={() => setSearch({ type: c })}
                  >
                    {c === ALL ? t.portfolio.all : (t.categories[c] ?? c)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pf-row">
              <span className="pf-row-label">{t.portfolio.stackLabel}</span>
              <div className="pf-filters" role="group" aria-label={t.portfolio.stackFilterLabel}>
                {[ALL, ...STACKS].map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={stack === s}
                    className={`pf-filter ${stack === s ? "is-active" : ""}`}
                    onClick={() => setSearch({ stack: s })}
                  >
                    {s === ALL ? t.portfolio.allStacks : t.portfolio.stacks[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="pf-status" aria-live="polite">
              <span>{fmt(t.portfolio.showing, { n: visible.length, total: projects.length })}</span>
              {filtered && (
                <button
                  type="button"
                  className="pf-reset"
                  onClick={() => {
                    setQuery("");
                    setSearch({ type: ALL, stack: ALL, q: "" });
                  }}
                >
                  {t.portfolio.reset} ×
                </button>
              )}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="pf-empty">{t.portfolio.noResults}</p>
          ) : (
            <div className="pr-grid pf-grid" ref={gridRef}>
              {visible.map((p, i) => (
                <ProjectCard project={p} index={i} key={p.slug} />
              ))}
            </div>
          )}
        </section>

        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
