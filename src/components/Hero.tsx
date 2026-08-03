import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HeroSphere } from "./HeroSphere";
import { BinaryRain } from "./BinaryRain";
import { BottomNav } from "./BottomNav";
import logoMark from "@/assets/oday-mark.svg";

export function Hero({ play }: { play: boolean }) {
  const ref = useRef<HTMLElement>(null);

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
            <span>ODAY</span>
          </div>
          <a className="contact-btn js-reveal" href="mailto:odaiesmael303@gmail.com">
            Hire me <span className="arrow">↗</span>
          </a>
        </div>

        <div className="label-tag js-reveal">[ FULL-STACK WEB DEVELOPER ]</div>

        <div className="headline">
          <div className="row row-1 js-reveal">Building Full-Stack</div>
          <div className="row row-2 js-reveal">
            Web Experiences
          </div>
        </div>

        <p className="hero-desc js-reveal">
          9 years turning ideas into fast, reliable websites of every kind — corporate sites, web apps, online stores and custom platforms. Front-end to back-end. Based in the Netherlands, working worldwide.
        </p>

        <div className="scroll-hint js-reveal">
          <span className="arrow">↓</span> Scroll to explore
        </div>
      </div>
      <BottomNav />
    </section>
  );
}
