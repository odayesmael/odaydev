import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { localizeShustyle, useLocale, useMessages } from "@/i18n";
import { LocaleLink } from "./LocaleLink";
import { Phone } from "./Phone";

gsap.registerPlugin(ScrollTrigger);

/** Home-page spotlight for the latest product: the ShuStyle app. */
export function AppSpotlight() {
  const ref = useRef<HTMLElement>(null);
  const t = useMessages();
  const shustyle = localizeShustyle(useLocale());

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".as-reveal"), {
        y: 34,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%" },
      });
      gsap.from(section.querySelectorAll(".as-phone"), {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="app-spotlight" id="latest" ref={ref} aria-labelledby="as-title">
      <div className="as-card">
        <div className="as-copy">
          <div className="as-eyebrow as-reveal">
            <span className="as-dot" />[ {t.spotlight.eyebrow} · {shustyle.year} ]
          </div>
          <h2 className="as-title as-reveal" id="as-title">
            <img className="as-logo" src={shustyle.logo} alt="" width={56} height={56} />
            {shustyle.name}
          </h2>
          <p className="as-tagline as-reveal">{shustyle.tagline}</p>
          <p className="as-body as-reveal">{shustyle.summary}</p>

          <ul className="as-chips as-reveal">
            {t.spotlight.chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <div className="as-actions as-reveal">
            <LocaleLink to="/work/shustyle" className="as-btn as-btn-primary">
              {t.spotlight.readCaseStudy} <span aria-hidden>→</span>
            </LocaleLink>
            <a
              className="as-btn"
              href={shustyle.appStore}
              target="_blank"
              rel="noopener noreferrer"
            >
              App Store <span aria-hidden>↗</span>
            </a>
            <a
              className="as-btn as-btn-ghost"
              href={shustyle.site}
              target="_blank"
              rel="noopener noreferrer"
            >
              shustyle.app <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="as-visual" aria-hidden>
          <div className="as-halo" />
          <Phone className="as-phone as-phone-back" src={shustyle.screens[1].src} />
          <Phone className="as-phone as-phone-front" src={shustyle.screens[0].src} />
        </div>
      </div>
    </section>
  );
}
