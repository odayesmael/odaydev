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

        <div className="label-tag js-reveal">[ {t.hero.label} ]</div>

        <div className="headline">
          <div className="row row-1 js-reveal">{t.hero.line1}</div>
          <div className="row row-2 js-reveal">{t.hero.line2}</div>
        </div>

        <p className="hero-desc js-reveal">{t.hero.desc}</p>

        <div className="scroll-hint js-reveal">
          <span className="arrow">↓</span> {t.common.scroll}
        </div>
      </div>
      <BottomNav />
    </section>
  );
}
