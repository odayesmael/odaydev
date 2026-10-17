import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone } from "@/components/Phone";
import { shustyle as base } from "@/data/shustyle";
import { SITE_URL } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { LocaleLink } from "@/components/LocaleLink";
import {
  localeFromParam,
  localizeShustyle,
  messagesFor,
  useLocale,
  useMessages,
  type Messages,
} from "@/i18n";
import { localeLinks, localeMeta } from "@/i18n/seo";

gsap.registerPlugin(ScrollTrigger);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: base.name,
  description: base.tagline,
  url: base.site,
  operatingSystem: "iOS, Android",
  applicationCategory: "LifestyleApplication",
  inLanguage: ["ar", "en", "tr", "nl", "fr"],
  installUrl: base.appStore,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Oday", url: SITE_URL },
};

export const Route = createFileRoute("/{-$locale}/work/shustyle")({
  component: ShuStyleCaseStudy,
  head: ({ params }) => {
    const locale = localeFromParam(params.locale);
    const t = messagesFor(locale);
    const title = `ShuStyle — ${t.shustylePage.titleAccent.replace(/\.$/, "")} — ${t.meta.caseStudySuffix}`;
    const description = localizeShustyle(locale).summary;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...localeMeta(locale, "/work/shustyle"),
        { property: "og:image", content: `${SITE_URL}/og-shustyle.png` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:image", content: `${SITE_URL}/og-shustyle.png` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: localeLinks(locale, "/work/shustyle"),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
});

/** Drag-to-compare: flat-lay vs. AI try-on. */
function Compare({ t }: { t: Messages["shustylePage"] }) {
  const [pos, setPos] = useState(50);
  const s = base;
  return (
    <div className="cs-compare" style={{ ["--pos" as string]: `${pos}%` }}>
      <img src={s.compare.after} alt={t.tryOn} loading="lazy" width={600} height={844} />
      <div className="cs-compare-before">
        <img src={s.compare.before} alt={t.flatLay} loading="lazy" width={600} height={844} />
      </div>
      <span className="cs-compare-tag cs-compare-tag-l">{t.flatLay}</span>
      <span className="cs-compare-tag cs-compare-tag-r">{t.tryOn}</span>
      <span className="cs-compare-handle" aria-hidden />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t.compareLabel}
      />
    </div>
  );
}

function ShuStyleCaseStudy() {
  const ref = useRef<HTMLDivElement>(null);
  const tt = useMessages();
  const t = tt.shustylePage;
  const s = localizeShustyle(useLocale());

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
      gsap.from(".cs-hero .phone", {
        y: 90,
        opacity: 0,
        stagger: 0.15,
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
  }, []);

  return (
    <>
      <div className="grain-overlay" />
      <div className="dr-page cs-page" ref={ref}>
        <Starfield />
        <PageHeader />

        <main>
          {/* ---------- Hero ---------- */}
          <section className="cs-hero">
            <div className="cs-hero-copy">
              <nav className="cs-crumbs cs-reveal" aria-label="Breadcrumb">
                <LocaleLink to="/portfolio">{tt.common.portfolio}</LocaleLink> <span>/</span>{" "}
                <span>ShuStyle</span>
              </nav>
              <div className="cs-eyebrow cs-reveal">
                <span className="cs-dot" />[ {t.eyebrow} · {s.year} ]
              </div>
              <h1 className="cs-title cs-reveal">
                <img className="cs-logo" src={s.logo} alt="" width={72} height={72} />
                ShuStyle — <em>{t.titleAccent}</em>
              </h1>
              <p className="cs-lead cs-reveal">{s.summary}</p>

              <div className="cs-actions cs-reveal">
                <a
                  className="as-btn as-btn-primary"
                  href={s.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.download} <span aria-hidden>↗</span>
                </a>
                <a className="as-btn" href={s.site} target="_blank" rel="noopener noreferrer">
                  {t.visitSite} <span aria-hidden>↗</span>
                </a>
              </div>

              <dl className="cs-meta cs-reveal">
                {s.meta.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="cs-hero-visual" aria-hidden>
              <div className="as-halo" />
              <Phone className="cs-phone-l" src={s.screens[2].src} loading="eager" />
              <Phone className="cs-phone-c" src={s.screens[0].src} loading="eager" />
              <Phone className="cs-phone-r" src={s.screens[1].src} loading="eager" />
            </div>
          </section>

          {/* ---------- Problem ---------- */}
          <section className="cs-block cs-problem">
            <div className="cs-label cs-in">[ {t.problemLabel} ]</div>
            <h2 className="cs-h2 cs-in">
              {t.problemTitle[0]} <em>{t.problemTitle[1]}</em>
            </h2>
            <p className="cs-p cs-in">{t.problemBody}</p>
          </section>

          {/* ---------- How it works ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ {t.howLabel} ]</div>
            <h2 className="cs-h2 cs-in">
              {t.howTitle[0]} <em>{t.howTitle[1]}</em>
            </h2>
            <ol className="cs-steps">
              {s.steps.map((st) => (
                <li className="cs-step cs-in" key={st.n}>
                  <span className="cs-step-n">{st.n}</span>
                  <h3>{st.title}</h3>
                  <p>{st.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------- AI try-on ---------- */}
          <section className="cs-block cs-split">
            <div>
              <div className="cs-label cs-in">[ {t.tryLabel} ]</div>
              <h2 className="cs-h2 cs-in">
                {t.tryTitle[0]} <em>{t.tryTitle[1]}</em>
              </h2>
              <p className="cs-p cs-in">{t.tryBody}</p>
            </div>
            <div className="cs-in">
              <Compare t={t} />
            </div>
          </section>

          {/* ---------- Features ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ {t.featuresLabel} ]</div>
            <h2 className="cs-h2 cs-in">
              {t.featuresTitle[0]} <em>{t.featuresTitle[1]}</em>
            </h2>
            <div className="cs-features">
              {s.features.map((f, i) => (
                <article className="cs-feature cs-in" key={f.title}>
                  <span className="cs-feature-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ---------- Screens ---------- */}
          <section className="cs-block cs-screens-block">
            <div className="cs-label cs-in">[ {t.screensLabel} ]</div>
            <h2 className="cs-h2 cs-in">
              {t.screensTitle[0]} <em>{t.screensTitle[1]}</em>
            </h2>
            <div className="cs-screens" tabIndex={0} aria-label={t.screensAria}>
              {s.screens.map((sc) => (
                <figure className="cs-screen cs-in" key={sc.src}>
                  <Phone src={sc.src} alt={`ShuStyle screen: ${sc.caption}`} />
                  <figcaption>{sc.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* ---------- Business model ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ {t.modelLabel} ]</div>
            <h2 className="cs-h2 cs-in">
              {t.modelTitle[0]} <em>{t.modelTitle[1]}</em>
            </h2>
            <p className="cs-p cs-in">{t.modelBody}</p>
            <div className="cs-plans">
              {s.plans.map((p) => (
                <div
                  className={`cs-plan cs-in ${"highlight" in p && p.highlight ? "is-hl" : ""}`}
                  key={p.name}
                >
                  <div className="cs-plan-name">{p.name}</div>
                  <div className="cs-plan-price">{p.price}</div>
                  <div className="cs-plan-note">{p.note}</div>
                  <ul>
                    {p.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Website + privacy ---------- */}
          <section className="cs-block cs-split cs-split-top">
            <div>
              <div className="cs-label cs-in">[ {t.siteLabel} ]</div>
              <h2 className="cs-h2 cs-in">
                {t.siteTitle[0]} <em>{t.siteTitle[1]}</em>
              </h2>
              <p className="cs-p cs-in">{t.siteBody}</p>
              <ul className="cs-list cs-in">
                {s.website.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <a className="as-btn cs-in" href={s.site} target="_blank" rel="noopener noreferrer">
                {t.openSite} <span aria-hidden>↗</span>
              </a>
            </div>
            <div>
              <div className="cs-label cs-in">[ {t.privacyLabel} ]</div>
              <h2 className="cs-h2 cs-in">
                {t.privacyTitle[0]} <em>{t.privacyTitle[1]}</em>
              </h2>
              <p className="cs-p cs-in">{t.privacyBody}</p>
              <div className="cs-label cs-in cs-label-gap">[ {t.deliveredLabel} ]</div>
              <ul className="cs-list cs-in">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* ---------- Next ---------- */}
          <section className="cs-block cs-next">
            <LocaleLink to="/work/$slug" slug="solechem-europe" className="pr-viewall cs-in">
              {tt.common.nextProject}: SoleChem Europe <span className="pr-arrow">→</span>
            </LocaleLink>
          </section>
        </main>

        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
