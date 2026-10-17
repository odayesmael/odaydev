import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { localeParam, stripLocale, useLocale, useMessages } from "@/i18n";

type Item = { key: "home" | "work" | "skills" | "contact"; target: string };

const items: Item[] = [
  { key: "home", target: "top" },
  { key: "work", target: "work" },
  { key: "skills", target: "skills" },
  { key: "contact", target: "contact" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const t = useMessages();
  const isHome = stripLocale(location.pathname) === "/";
  const goHome = () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: "/{-$locale}" as any, params: { locale: localeParam(locale) } as any });

  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [style, setStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  // On sub-pages nothing is scroll-spied, so mark the section that page belongs to
  const [active, setActive] = useState(isHome ? 0 : 1);

  const scrollToId = (target: string) => {
    const el = document.getElementById(target);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  };

  const go = (target: string, index: number) => {
    setActive(index);

    if (target === "top") {
      if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
      else goHome();
      return;
    }

    // Section is on this page — just scroll to it
    if (scrollToId(target)) return;

    // Otherwise it lives on the home page: go there, then scroll once it mounts
    goHome();
    let tries = 0;
    const tick = () => {
      if (scrollToId(target) || ++tries > 60) return;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Keep the pill under the active item
  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) setStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  useEffect(() => {
    const onR = () => {
      const el = refs.current[active];
      if (el) setStyle({ left: el.offsetLeft, width: el.offsetWidth });
    };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [active]);

  // Reset the highlight when the route changes
  useEffect(() => {
    setActive(isHome ? 0 : 1);
  }, [location.pathname, isHome]);

  // Scroll-spy — only meaningful on the single-page home route
  useEffect(() => {
    if (!isHome) return;

    const sections = items
      .map((it, i) => ({ el: it.target === "top" ? null : document.getElementById(it.target), i }))
      .filter((s): s is { el: HTMLElement; i: number } => !!s.el);

    if (sections.length === 0) return;

    const onScroll = () => {
      if (window.scrollY < 200) {
        setActive(0);
        return;
      }
      const mid = window.scrollY + window.innerHeight * 0.4;
      let current = 0;
      for (const { el, i } of sections) {
        if (el.offsetTop <= mid) current = i;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, location.pathname]);

  return (
    <nav className="bottom-nav">
      <span className="pill-indicator" style={{ left: style.left, width: style.width }} />
      {items.map((item, i) => (
        <button
          key={item.key}
          type="button"
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`bn-btn ${i === active ? "active" : ""}`}
          onClick={() => go(item.target, i)}
        >
          {t.nav[item.key]}
        </button>
      ))}
    </nav>
  );
}
