import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import { LOCALE_META, localePath, stripLocale, useLocale, useMessages } from "@/i18n";
import { track } from "@/lib/analytics";

/** Seconds of (visible-tab) browsing before the saucer arrives. */
const DELAY_S = 15;
/** Don't come back for this long after a visitor has seen it. */
const SNOOZE_DAYS = 14;
const SEEN_KEY = "oday:ufo-popup";
const ELAPSED_KEY = "oday:ufo-elapsed";

const store = {
  get(k: string, s: Storage | undefined) {
    try {
      return s?.getItem(k) ?? null;
    } catch {
      return null;
    }
  },
  set(k: string, v: string, s: Storage | undefined) {
    try {
      s?.setItem(k, v);
    } catch {
      /* storage blocked */
    }
  },
};

/** Called by the contact form after a successful send: no need to invite them again. */
export function markUfoDone() {
  store.set(SEEN_KEY, String(Date.now() + 365 * 864e5), globalThis.localStorage);
}

function recentlySeen() {
  const v = Number(store.get(SEEN_KEY, globalThis.localStorage) ?? 0);
  return v > 0 && Date.now() - v < SNOOZE_DAYS * 864e5;
}

function Saucer() {
  return (
    <svg className="ufo-svg" viewBox="0 0 200 110" aria-hidden>
      <defs>
        <linearGradient id="ufo-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef4f0" />
          <stop offset="0.55" stopColor="#a9b8ae" />
          <stop offset="1" stopColor="#4c5c52" />
        </linearGradient>
        <radialGradient id="ufo-dome" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#e9fff0" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#7cf0a6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1f6b3c" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id="ufo-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#4ade80" stopOpacity="0.55" />
          <stop offset="1" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="66" rx="98" ry="40" fill="url(#ufo-glow)" />
      {/* dome */}
      <path d="M62 52 C62 20 138 20 138 52 Z" fill="url(#ufo-dome)" />
      <ellipse cx="88" cy="36" rx="9" ry="5" fill="#fff" opacity="0.55" />
      {/* saucer */}
      <ellipse cx="100" cy="60" rx="86" ry="20" fill="url(#ufo-body)" />
      <ellipse cx="100" cy="55" rx="70" ry="9" fill="#ffffff" opacity="0.18" />
      <path d="M28 64 Q100 88 172 64 L160 72 Q100 92 40 72 Z" fill="#33423a" />
      {/* rim lights */}
      {[44, 72, 100, 128, 156].map((x, i) => (
        <circle
          key={x}
          className={`ufo-light l${i % 3}`}
          cx={x}
          cy={67 + Math.abs(100 - x) * -0.05}
          r="4.2"
        />
      ))}
      <ellipse className="ufo-thruster" cx="100" cy="84" rx="18" ry="4" fill="#4ade80" />
    </svg>
  );
}

/**
 * After ~15 s of browsing, a small flying saucer arrives from the distance,
 * parks in the middle of the screen and beams down a short invitation.
 * Shown once per visitor (snoozed for two weeks), never after the contact
 * form was sent, and replaced by a simple fade for reduced-motion users.
 */
export function UfoPopup() {
  const t = useMessages().ufo;
  const locale = useLocale();
  const rtl = LOCALE_META[locale].dir === "rtl";
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closing = useRef(false);

  // Count visible browsing time across page navigations (per tab session)
  useEffect(() => {
    if (recentlySeen()) return;
    let elapsed = Number(store.get(ELAPSED_KEY, globalThis.sessionStorage) ?? 0);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      // Never interrupt an open dialog (⌘K palette etc.) or someone typing a brief
      const busy =
        document.querySelector("[role=dialog][data-state=open], .cp-dialog") ||
        (document.activeElement && document.activeElement.closest(".cb-form"));
      elapsed += 1;
      store.set(ELAPSED_KEY, String(elapsed), globalThis.sessionStorage);
      if (elapsed >= DELAY_S && !busy && !recentlySeen()) {
        window.clearInterval(id);
        store.set(SEEN_KEY, String(Date.now()), globalThis.localStorage);
        lastFocus.current = document.activeElement as HTMLElement | null;
        setOpen(true);
        track("ufo_popup_shown", { locale });
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [locale]);

  // Arrival animation
  useEffect(() => {
    if (!open || !stageRef.current) return;
    const stage = stageRef.current;
    const craft = stage.querySelector<HTMLElement>(".ufo-craft")!;
    const beam = stage.querySelector<HTMLElement>(".ufo-beam")!;
    const card = stage.querySelector<HTMLElement>(".ufo-card")!;
    const scrim = stage.querySelector<HTMLElement>(".ufo-scrim")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = rtl ? 1 : -1; // arrive from the reading start
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => card.querySelector<HTMLElement>(".ufo-primary")?.focus(),
      });
      tlRef.current = tl;
      if (reduce) {
        tl.from(scrim, { opacity: 0, duration: 0.25 })
          .from([craft, card], { opacity: 0, duration: 0.3 }, 0)
          .set(beam, { opacity: 1, scaleY: 1 });
        return;
      }
      gsap.set(card, { clipPath: "inset(0% 0% 100% 0%)", y: -30, scale: 0.92, opacity: 0 });
      gsap.set(beam, { scaleY: 0, opacity: 0 });
      gsap.set(scrim, { opacity: 0 });
      tl
        // a speck far away…
        .fromTo(
          craft,
          {
            x: dir * vw * 0.55,
            y: -vh * 0.45,
            scale: 0.08,
            rotation: dir * -18,
            opacity: 0,
            filter: "blur(3px)",
          },
          { opacity: 1, duration: 0.4, ease: "none" },
        )
        // …swooping in along a curve, growing as it gets closer
        .to(craft, {
          keyframes: [
            {
              x: dir * vw * 0.18,
              y: -vh * 0.3,
              scale: 0.35,
              rotation: dir * 12,
              duration: 0.9,
              ease: "sine.inOut",
            },
            {
              x: -dir * vw * 0.12,
              y: -vh * 0.06,
              scale: 0.75,
              rotation: -dir * 10,
              duration: 0.8,
              ease: "sine.inOut",
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "back.out(1.6)",
            },
          ],
        })
        .to(scrim, { opacity: 1, duration: 0.8 }, "-=1.2")
        // hover and switch on the beam
        .to(beam, { opacity: 1, scaleY: 1, duration: 0.45, ease: "power2.out" }, "+=0.15")
        // the message unfolds inside the beam
        .to(
          card,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.1",
        );
    }, stage);

    // gentle idle bob, independent of the timeline
    const bob = reduce
      ? null
      : gsap.to(stage.querySelector(".ufo-svg"), {
          y: -6,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

    return () => {
      ctx.revert();
      bob?.kill();
    };
  }, [open, rtl]);

  const close = useCallback(
    (reason: string, after?: () => void) => {
      if (closing.current) return;
      closing.current = true;
      track("ufo_popup_close", { reason });
      const stage = stageRef.current;
      const finish = () => {
        setOpen(false);
        closing.current = false;
        after?.();
        if (!after) lastFocus.current?.focus?.();
      };
      if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
      tlRef.current?.kill();
      const dir = rtl ? -1 : 1; // leave towards the reading end
      gsap
        .timeline({ onComplete: finish })
        .to(stage.querySelector(".ufo-card"), {
          clipPath: "inset(0% 0% 100% 0%)",
          y: -24,
          scale: 0.92,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        })
        .to(stage.querySelector(".ufo-beam"), { scaleY: 0, opacity: 0, duration: 0.25 }, "-=0.1")
        .to(stage.querySelector(".ufo-scrim"), { opacity: 0, duration: 0.5 }, "<")
        .to(
          stage.querySelector(".ufo-craft"),
          {
            x: dir * window.innerWidth * 0.7,
            y: -window.innerHeight * 0.55,
            scale: 0.1,
            rotation: dir * 20,
            duration: 0.75,
            ease: "power3.in",
          },
          "<",
        );
    },
    [rtl],
  );

  // Esc to close; keep Tab inside the card
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("escape");
      if (e.key === "Tab" && stageRef.current) {
        const f = stageRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const goContact = () =>
    close("brief", () => {
      if (stripLocale(pathname) === "/") {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.navigate({ href: `${localePath(locale, "/")}#contact` });
      }
    });
  const goWork = () =>
    close("work", () => router.navigate({ href: localePath(locale, "/portfolio") }));

  return (
    <div className="ufo-stage" ref={stageRef}>
      <div className="ufo-scrim" onClick={() => close("backdrop")} aria-hidden />
      <div className="ufo-rig">
        <div className="ufo-craft" aria-hidden>
          <Saucer />
        </div>
        <div className="ufo-beam" aria-hidden />
        <div
          className="ufo-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ufo-title"
          aria-describedby="ufo-body"
        >
          <button type="button" className="ufo-x" onClick={() => close("x")} aria-label={t.close}>
            ×
          </button>
          <div className="ufo-eyebrow">
            <span className="ufo-pulse" aria-hidden />[ {t.eyebrow} ]
          </div>
          <h2 className="ufo-title" id="ufo-title">
            <span className="sr-only">{t.label}: </span>
            {t.title[0]} <em>{t.title[1]}</em>
          </h2>
          <p className="ufo-body" id="ufo-body">
            {t.body}
          </p>
          <div className="ufo-actions">
            <button type="button" className="as-btn as-btn-primary ufo-primary" onClick={goContact}>
              {t.primary} <span aria-hidden>↗</span>
            </button>
            <button type="button" className="as-btn" onClick={goWork}>
              {t.secondary}
            </button>
          </div>
          <button type="button" className="ufo-later" onClick={() => close("later")}>
            {t.later}
          </button>
        </div>
      </div>
    </div>
  );
}
