import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { DeviceMockup } from "@/components/DeviceMockup";
import { CaseStudyLink } from "@/components/CaseStudyLink";
import { caseStudyOrder, getCaseStudy, type CaseStudy } from "@/data/caseStudies";
import { projects, projectShots } from "@/data/projects";
import { SITE_URL } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Testimonials } from "@/components/Testimonials";
import { consumeMorph } from "@/lib/viewTransition";
import { LocaleLink } from "@/components/LocaleLink";
import {
  localeFromParam,
  localePath,
  localizeCaseStudy,
  messagesFor,
  useLocale,
  useMessages,
} from "@/i18n";
import { breadcrumbs, localeLinks, localeMeta, ogImage, ogImageMeta } from "@/i18n/seo";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/{-$locale}/work/$slug")({
  loader: ({ params }) => {
    const base = getCaseStudy(params.slug);
    if (!base) throw notFound();
    return localizeCaseStudy(base, localeFromParam(params.locale));
  },
  head: ({ loaderData: cs, params }) => {
    if (!cs) return {};
    const locale = localeFromParam(params.locale);
    const t = messagesFor(locale);
    const title = `${cs.name} — ${t.meta.caseStudySuffix}`;
    const path = `/work/${cs.slug}`;
    const url = `${SITE_URL}${localePath(locale, path)}`;
    const image = ogImage(locale, `work-${cs.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: cs.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: cs.summary },
        ...localeMeta(locale, path),
        ...ogImageMeta(locale, `work-${cs.slug}`, title),
      ],
      links: localeLinks(locale, path),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            inLanguage: locale,
            description: cs.summary,
            url,
            image,
            about: { "@type": "WebSite", name: cs.name, url: cs.url },
            author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Oday", url: SITE_URL },
          }),
        },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbs(locale, cs.name, path)) },
      ],
    };
  },
  component: CaseStudyPage,
});

function nextProject(slug: string) {
  const i = caseStudyOrder.indexOf(slug);
  const nextSlug = caseStudyOrder[(i + 1) % caseStudyOrder.length];
  const p = projects.find((x) => x.slug === nextSlug);
  return p ? { name: p.title, slug: p.slug } : null;
}

function CaseStudyPage() {
  const cs = Route.useLoaderData() as CaseStudy;
  const t = useMessages();
  const tc = t.caseStudy;
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.slug === cs.slug);
  const shots = project ? projectShots(project) : null;
  const next = nextProject(cs.slug);

  useEffect(() => {
    const root = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(".cs-hero .cs-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
      });
      // When we arrived by morphing a project card into this mockup, don't animate it again.
      if (!consumeMorph()) {
        gsap.from(".cs-hero-mock", {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.2,
        });
      }
      root.querySelectorAll<HTMLElement>(".cs-block").forEach((el) => {
        gsap.from(el.querySelectorAll(".cs-in"), {
          y: 30,
          opacity: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [cs.slug]);

  return (
    <>
      <div className="grain-overlay" />
      <div className="dr-page cs-page" ref={ref}>
        <Starfield />
        <PageHeader />

        <main>
          {/* ---------- Hero ---------- */}
          <section className="cs-hero cs-hero-web">
            <div className="cs-hero-copy">
              <nav className="cs-crumbs cs-reveal" aria-label="Breadcrumb">
                <LocaleLink to="/portfolio">{t.common.portfolio}</LocaleLink> <span>/</span>{" "}
                <span>{cs.name}</span>
              </nav>
              <div className="cs-eyebrow cs-reveal">
                <span className="cs-dot" />[ {tc.eyebrow} · {cs.kind.toLocaleUpperCase(locale)} ]
              </div>
              <h1 className="cs-title cs-reveal">
                <bdi>{cs.name}</bdi> — <em>{cs.tagline}</em>
              </h1>
              <p className="cs-lead cs-reveal">{cs.summary}</p>
              <div className="cs-actions cs-reveal">
                <a
                  className="as-btn as-btn-primary"
                  href={cs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.common.visit} {cs.domain} <span aria-hidden>↗</span>
                </a>
                <LocaleLink className="as-btn" to="/portfolio">
                  {t.common.allProjects}
                </LocaleLink>
              </div>
              <dl className="cs-meta cs-reveal">
                {cs.meta.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {shots && (
              <div className="cs-hero-mock" style={{ viewTransitionName: `shot-${cs.slug}` }}>
                <DeviceMockup
                  desktop={shots.desktop}
                  mobile={shots.mobile}
                  domain={cs.domain}
                  eager
                />
              </div>
            )}
          </section>

          {/* ---------- Stats ---------- */}
          {cs.stats && (
            <section className="cs-block cs-stats-block" aria-label={tc.keyNumbers}>
              <div className="cs-stats">
                {cs.stats.map((s) => (
                  <div className="cs-stat cs-in" key={s.label}>
                    <span className="cs-stat-value">{s.value}</span>
                    <span className="cs-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ---------- Challenge ---------- */}
          <section className="cs-block cs-problem">
            <div className="cs-label cs-in">[ {tc.challenge} ]</div>
            <h2 className="cs-h2 cs-in">{cs.challenge.heading}</h2>
            <p className="cs-p cs-in">{cs.challenge.body}</p>
          </section>

          {/* ---------- Before / after ---------- */}
          {cs.before && (
            <section className="cs-block">
              <div className="cs-label cs-in">[ {tc.beforeAfter} ]</div>
              <h2 className="cs-h2 cs-in">
                {tc.beforeAfterTitle[0]} <em>{tc.beforeAfterTitle[1]}</em>
              </h2>
              <div className="cs-in">
                <BeforeAfter
                  className="cs-compare-web"
                  before={cs.before.src}
                  after={`/work/${cs.slug}-desktop.webp`}
                  beforeLabel={`${tc.before} · ${cs.before.label}`}
                  afterLabel={tc.after}
                  label={tc.compareLabel}
                />
              </div>
            </section>
          )}

          {/* ---------- Features ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ {tc.built} ]</div>
            <h2 className="cs-h2 cs-in">
              {tc.builtTitle[0]} <em>{tc.builtTitle[1]}</em>
            </h2>
            <div className="cs-features">
              {cs.features.map((f, i) => (
                <article className="cs-feature cs-in" key={f.title}>
                  <span className="cs-feature-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ---------- Gallery ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ {tc.inside} ]</div>
            <h2 className="cs-h2 cs-in">
              {tc.insideTitle[0]} <em>{tc.insideTitle[1]}</em>
            </h2>
            <div className="cs-gallery">
              {cs.gallery.map((g, i) => (
                <figure className="cs-shot cs-in" key={g.label}>
                  <div className="cs-shot-frame">
                    <div className="dm-bar">
                      <span className="dm-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="dm-url">{cs.domain}</span>
                    </div>
                    <img
                      src={`/work/${cs.slug}-page-${i + 1}-desktop.webp`}
                      alt={`${cs.name}: ${g.label}`}
                      width={1440}
                      height={900}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption>{g.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <Testimonials project={cs.slug} />

          {/* ---------- Deliverables + stack ---------- */}
          <section className="cs-block cs-split cs-split-top">
            <div>
              <div className="cs-label cs-in">[ {tc.delivered} ]</div>
              <ul className="cs-list cs-in">
                {cs.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="cs-label cs-in">[ {tc.stack} ]</div>
              <ul className="cs-stack cs-in">
                {cs.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a className="as-btn cs-in" href={cs.url} target="_blank" rel="noopener noreferrer">
                {tc.open} {cs.domain} <span aria-hidden>↗</span>
              </a>
            </div>
          </section>

          {/* ---------- Next ---------- */}
          {next && (
            <section className="cs-block cs-next">
              <CaseStudyLink slug={next.slug} className="pr-viewall cs-in">
                {t.common.nextProject}: {next.name} <span className="pr-arrow">→</span>
              </CaseStudyLink>
            </section>
          )}
        </main>

        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
