import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logoMark from "@/assets/oday-mark.svg";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced-motion users: skip the intro entirely.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("preloaded", "1");
      onDone();
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: 100,
      duration: 1.2,
      ease: "cubic-bezier(0.65, 0, 0.35, 1)",
      onUpdate: () => setPct(Math.round(obj.v)),
      onComplete: () => {
        gsap.to(logoRef.current, { scale: 1.15, duration: 0.5, ease: "power2.out" });
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.5,
          delay: 0.15,
          ease: "power2.inOut",
          onComplete: () => {
            sessionStorage.setItem("preloaded", "1");
            onDone();
          },
        });
      },
    });
    gsap.to(barRef.current, {
      width: "100%",
      duration: 1.2,
      ease: "cubic-bezier(0.65, 0, 0.35, 1)",
    });
  }, [onDone]);

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader-logo" ref={logoRef}>
        <img className="icon" src={logoMark} alt="" />
        <span>ODAY</span>
      </div>
      <div className="preloader-bottom">
        <span>[ LOADING... ]</span>
        <span>[ {String(pct).padStart(2, "0")}% ]</span>
      </div>
      <div className="preloader-bar" ref={barRef} />
    </div>
  );
}
