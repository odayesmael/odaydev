import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
import logoMark from "@/assets/oday-mark.svg";
import { EmailLink } from "@/components/EmailLink";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const cs = getCaseStudy(params.slug);
    if (!cs) throw notFound();
    return cs;
  },
  head: ({ loaderData: cs }) => {
    if (!cs) return {};
    const title = `${cs.name} — case study — Oday`;
    const url = `${SITE_URL}/work/${cs.slug}`;
    const image = `${SITE_URL}/og-${cs.slug}.png`;
    return {
      meta: [
        { title },
        { name: "description", content: cs.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: cs.summary },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: `${cs.name} — case study`,
            description: cs.summary,
            url,
            image,
            about: { "@type": "WebSite", name: cs.name, url: cs.url },
            author: { "@type": "Person", name: "Oday", url: SITE_URL },
          }),
        },
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
      gsap.from(".cs-hero-mock", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.2,
      });
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
        <header className="dr-page-top">
          <Link to="/" className="logo dr-logo">
            <img className="icon" src={logoMark} alt="" />
            <span className="logo-word">
              oday<span className="logo-dot">.</span>
            </span>
          </Link>
          <EmailLink className="contact-btn">
            Let&apos;s Talk <span className="arrow">↗</span>
          </EmailLink>
        </header>

        <main>
          {/* ---------- Hero ---------- */}
          <section className="cs-hero cs-hero-web">
            <div className="cs-hero-copy">
              <nav className="cs-crumbs cs-reveal" aria-label="Breadcrumb">
                <Link to="/portfolio">Portfolio</Link> <span>/</span> <span>{cs.name}</span>
              </nav>
              <div className="cs-eyebrow cs-reveal">
                <span className="cs-dot" />[ CASE STUDY · {cs.kind.toUpperCase()} ]
              </div>
              <h1 className="cs-title cs-reveal">
                {cs.name} — <em>{cs.tagline}</em>
              </h1>
              <p className="cs-lead cs-reveal">{cs.summary}</p>
              <div className="cs-actions cs-reveal">
                <a
                  className="as-btn as-btn-primary"
                  href={cs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit {cs.domain} <span aria-hidden>↗</span>
                </a>
                <Link className="as-btn" to="/portfolio">
                  All projects
                </Link>
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
              <div className="cs-hero-mock">
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
            <section className="cs-block cs-stats-block" aria-label="Key numbers">
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
            <div className="cs-label cs-in">[ 01 / THE CHALLENGE ]</div>
            <h2 className="cs-h2 cs-in">{cs.challenge.heading}</h2>
            <p className="cs-p cs-in">{cs.challenge.body}</p>
          </section>

          {/* ---------- Features ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ 02 / WHAT I BUILT ]</div>
            <h2 className="cs-h2 cs-in">
              The pieces that <em>make it work.</em>
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
            <div className="cs-label cs-in">[ 03 / INSIDE THE SITE ]</div>
            <h2 className="cs-h2 cs-in">
              Key pages, <em>as they are live.</em>
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

          {/* ---------- Deliverables + stack ---------- */}
          <section className="cs-block cs-split cs-split-top">
            <div>
              <div className="cs-label cs-in">[ 04 / WHAT I DELIVERED ]</div>
              <ul className="cs-list cs-in">
                {cs.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="cs-label cs-in">[ 05 / BUILT WITH ]</div>
              <ul className="cs-stack cs-in">
                {cs.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a className="as-btn cs-in" href={cs.url} target="_blank" rel="noopener noreferrer">
                Open {cs.domain} <span aria-hidden>↗</span>
              </a>
            </div>
          </section>

          {/* ---------- Next ---------- */}
          {next && (
            <section className="cs-block cs-next">
              <CaseStudyLink slug={next.slug} className="pr-viewall cs-in">
                Next project: {next.name} <span className="pr-arrow">→</span>
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
