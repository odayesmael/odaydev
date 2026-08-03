import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    n: "1.0",
    title: "Detection and Response",
    body: "We amplify your threat visibility and employ automated incident response to safeguard your resources, standing, and activities.",
  },
  {
    n: "2.0",
    title: "Offensive Security",
    body: "We specialize in penetration testing and collaborative cross-team operations, creating realistic threat simulations to fine-tune and amplify cybersecurity defenses.",
  },
  {
    n: "3.0",
    title: "Reporting and Analytics",
    body: "Today's digital landscape requires more than just monitoring isolated metrics; it demands a holistic, unified view of your entire cybersecurity posture.",
  },
  {
    n: "4.0",
    title: "Advisory Services",
    body: "We provide expert guidance on best practices and strategies to strengthen an organization's cyber defenses and resilience.",
  },
  {
    n: "5.0",
    title: "NIS2",
    body: "We help organisations align with NIS2 obligations — from gap assessment to control hardening and continuous compliance reporting.",
  },
];

export function MoreServices() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelector(".ms-eyebrow"), {
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      gsap.from(section.querySelector(".ms-title"), {
        y: 30, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
      gsap.from(section.querySelectorAll(".ms-row"), {
        y: 24, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ms-section" ref={ref}>
      <div className="ms-head">
        <div className="ms-eyebrow">[ &nbsp;MORE SERVICES&nbsp; ]</div>
        <h2 className="ms-title">
          Tailored digital<br />security solutions
        </h2>
      </div>

      <ul className="ms-list">
        {ITEMS.map((it) => (
          <li className="ms-row" key={it.n}>
            <div className="ms-num">[ {it.n} ]</div>
            <h3 className="ms-row-title">{it.title}</h3>
            <p className="ms-row-body">{it.body}</p>
            <span className="ms-arrow" aria-hidden>↗</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
