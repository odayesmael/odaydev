import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HeroSphere } from "./HeroSphere";
import { BinaryRain } from "./BinaryRain";
import { BottomNav } from "./BottomNav";
import logoMark from "@/assets/oday-mark.svg";
import { useMessages } from "@/i18n";
import { LangSwitch } from "./LangSwitch";
import { PaletteButton } from "./CommandPaletteHost";
import { EmailLink } from "@/components/EmailLink";
import { LocaleLink } from "./LocaleLink";

export function Hero({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const t = useMessages();

  useEffect(() => {
    if (!play) return;
    const ctx = gsap.context(() => {
      gsap.set([".js-reveal"], { y: 60, opacity: 0 });
      gsap.to(".js-reveal", {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
    }, ref);
    return () => ctx.revert();
  }, [play]);

  return (
    <section className="hero" ref={ref}>
      <BinaryRain />
      <HeroSphere />
      <div className="hero-content">
        <div className="top-bar">
          <div className="logo js-reveal">
            <img className="icon" src={logoMark} alt="" />
            <span className="logo-word">
              oday<span className="logo-dot">.</span>
            </span>
          </div>
          <div className="top-actions js-reveal">
            <PaletteButton label={t.palette.trigger} />
            <LangSwitch />
            <EmailLink className="contact-btn">
              {t.common.letsTalk} <span className="arrow">↗</span>
            </EmailLink>
          </div>
        </div>

        <div className="hero-intro">
          <div className="hero-eyebrow js-reveal">
            <span className="hero-eyebrow-dot" aria-hidden />[ {t.hero.label} ]
          </div>
          <h1 className="hero-title js-reveal">
            {t.hero.line1}
            <br />
            <em>{t.hero.line2}</em>
          </h1>
          <p className="hero-lead js-reveal">{t.hero.desc}</p>
          <div className="hero-actions js-reveal">
            <LocaleLink to="/portfolio" className="as-btn as-btn-primary">
              {t.ufo.secondary} <span aria-hidden>→</span>
            </LocaleLink>
            <a className="as-btn" href="#contact">
              {t.common.letsTalk} <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="scroll-hint js-reveal">
          <span className="arrow">↓</span> {t.common.scroll}
        </div>
      </div>
      <BottomNav />
    </section>
  );
}
