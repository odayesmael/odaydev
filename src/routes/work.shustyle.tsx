import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone } from "@/components/Phone";
import { shustyle as s } from "@/data/shustyle";
import { SITE_URL } from "@/lib/site";
import logoMark from "@/assets/oday-mark.svg";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "ShuStyle — AI stylist app case study — Oday";
const DESCRIPTION =
  "Case study: ShuStyle, an AI stylist app for iOS and Android that builds outfits from your own closet, with 360° try-on, a week planner and a five-language website — designed and built by Oday.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: s.name,
  description: s.tagline,
  url: s.site,
  operatingSystem: "iOS, Android",
  applicationCategory: "LifestyleApplication",
  inLanguage: ["ar", "en", "tr", "nl", "fr"],
  installUrl: s.appStore,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Oday", url: SITE_URL },
};

export const Route = createFileRoute("/work/shustyle")({
  component: ShuStyleCaseStudy,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/work/shustyle` },
      { property: "og:image", content: `${SITE_URL}/og-shustyle.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: `${SITE_URL}/og-shustyle.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/work/shustyle` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
});

/** Drag-to-compare: flat-lay vs. AI try-on. */
function Compare() {
  const [pos, setPos] = useState(50);
  return (
    <div className="cs-compare" style={{ ["--pos" as string]: `${pos}%` }}>
      <img
        src={s.compare.after}
        alt="The same outfit generated on a model by AI"
        loading="lazy"
        width={600}
        height={844}
      />
      <div className="cs-compare-before">
        <img
          src={s.compare.before}
          alt="An outfit laid out flat from the user's own clothes"
          loading="lazy"
          width={600}
          height={844}
        />
      </div>
      <span className="cs-compare-tag cs-compare-tag-l">Flat-lay</span>
      <span className="cs-compare-tag cs-compare-tag-r">AI try-on</span>
      <span className="cs-compare-handle" aria-hidden />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare the flat-lay with the AI try-on"
      />
    </div>
  );
}

function ShuStyleCaseStudy() {
  const ref = useRef<HTMLDivElement>(null);

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
        <header className="dr-page-top">
          <Link to="/" className="logo dr-logo">
            <img className="icon" src={logoMark} alt="" />
            <span className="logo-word">
              oday<span className="logo-dot">.</span>
            </span>
          </Link>
          <a className="contact-btn" href="mailto:info@oday.dev">
            Let&apos;s Talk <span className="arrow">↗</span>
          </a>
        </header>

        <main>
          {/* ---------- Hero ---------- */}
          <section className="cs-hero">
            <div className="cs-hero-copy">
              <nav className="cs-crumbs cs-reveal" aria-label="Breadcrumb">
                <Link to="/portfolio">Portfolio</Link> <span>/</span> <span>ShuStyle</span>
              </nav>
              <div className="cs-eyebrow cs-reveal">
                <span className="cs-dot" />[ CASE STUDY · MOBILE APP · {s.year} ]
              </div>
              <h1 className="cs-title cs-reveal">
                <img className="cs-logo" src={s.logo} alt="" width={72} height={72} />
                ShuStyle — <em>your AI stylist.</em>
              </h1>
              <p className="cs-lead cs-reveal">{s.summary}</p>

              <div className="cs-actions cs-reveal">
                <a
                  className="as-btn as-btn-primary"
                  href={s.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download on the App Store <span aria-hidden>↗</span>
                </a>
                <a className="as-btn" href={s.site} target="_blank" rel="noopener noreferrer">
                  Visit shustyle.app <span aria-hidden>↗</span>
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
            <div className="cs-label cs-in">[ 01 / THE PROBLEM ]</div>
            <h2 className="cs-h2 cs-in">
              A full wardrobe, and <em>nothing to wear.</em>
            </h2>
            <p className="cs-p cs-in">
              Most people wear a small slice of what they own and lose time every morning deciding.
              Styling apps tend to push new purchases. ShuStyle starts from the opposite idea: work
              with the closet you already have, read the day — weather, plans, occasion — and answer
              in seconds, in the user's own language.
            </p>
          </section>

          {/* ---------- How it works ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ 02 / HOW IT WORKS ]</div>
            <h2 className="cs-h2 cs-in">
              From closet to outfit <em>in three taps.</em>
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
              <div className="cs-label cs-in">[ 03 / AI TRY-ON ]</div>
              <h2 className="cs-h2 cs-in">
                See it on a model, <em>from every side.</em>
              </h2>
              <p className="cs-p cs-in">
                One tap turns a flat-lay of the user's own pieces into a realistic photo on a model,
                then into a 360° view they can drag around. Measurements in the profile tune the
                result. Drag the slider to compare.
              </p>
            </div>
            <div className="cs-in">
              <Compare />
            </div>
          </section>

          {/* ---------- Features ---------- */}
          <section className="cs-block">
            <div className="cs-label cs-in">[ 04 / FEATURES ]</div>
            <h2 className="cs-h2 cs-in">
              Everything the closet <em>was missing.</em>
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
            <div className="cs-label cs-in">[ 05 / INSIDE THE APP ]</div>
            <h2 className="cs-h2 cs-in">
              Designed to make getting dressed <em>easy.</em>
            </h2>
            <div className="cs-screens" tabIndex={0} aria-label="App screens, scroll horizontally">
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
            <div className="cs-label cs-in">[ 06 / BUSINESS MODEL ]</div>
            <h2 className="cs-h2 cs-in">
              Free to start, <em>subscriptions to grow.</em>
            </h2>
            <p className="cs-p cs-in">
              A freemium model with monthly and yearly in-app subscriptions, plus style-point
              top-ups for occasional extra use. Prices shown in USD; the store shows local pricing.
            </p>
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
              <div className="cs-label cs-in">[ 07 / THE WEBSITE ]</div>
              <h2 className="cs-h2 cs-in">
                shustyle.app — <em>the front door.</em>
              </h2>
              <p className="cs-p cs-in">
                A fast, five-language landing site that explains the product and sends visitors
                straight to the store.
              </p>
              <ul className="cs-list cs-in">
                {s.website.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <a className="as-btn cs-in" href={s.site} target="_blank" rel="noopener noreferrer">
                Open shustyle.app <span aria-hidden>↗</span>
              </a>
            </div>
            <div>
              <div className="cs-label cs-in">[ 08 / PRIVATE BY DESIGN ]</div>
              <h2 className="cs-h2 cs-in">
                The closet <em>stays yours.</em>
              </h2>
              <p className="cs-p cs-in">
                Clothes and photos are visible only to their owner and are sent to AI providers
                solely to style outfits — never sold or used for ads. Deleting the account in the
                app removes everything.
              </p>
              <div className="cs-label cs-in cs-label-gap">[ WHAT I DELIVERED ]</div>
              <ul className="cs-list cs-in">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* ---------- Next ---------- */}
          <section className="cs-block cs-next">
            <Link
              to="/work/$slug"
              params={{ slug: "solechem-europe" }}
              className="pr-viewall cs-in"
            >
              Next project: SoleChem Europe <span className="pr-arrow">→</span>
            </Link>
          </section>
        </main>

        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
