import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const CommandPalette = lazy(() => import("./CommandPalette"));

export const OPEN_PALETTE = "oday:open-palette";

/** Ask the palette to open (from a header button, the bottom nav, etc.). */
export function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE));
}

function typingInField(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/**
 * Global ⌘K / Ctrl+K (and "/") listener. The palette itself — cmdk and its
 * dialog — is only downloaded the first time someone opens it.
 */
export function CommandPaletteHost() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;

  useEffect(() => {
    const show = (via: string) => {
      setLoaded(true);
      setOpen(true);
      track("palette_open", { via });
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else show("shortcut");
      } else if (e.key === "/" && !typingInField(e) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        show("slash");
      }
    };
    const onOpen = () => show("button");
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, []);

  if (!loaded) return null;
  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </Suspense>
  );
}

/** The little "⌘K" button shown in the page headers. */
export function PaletteButton({ label }: { label: string }) {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)), []);
  return (
    <button type="button" className="palette-btn" onClick={openPalette} aria-label={label}>
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );
}
