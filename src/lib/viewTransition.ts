/**
 * Card → case-study morph. Only the clicked card's cover gets the shared
 * view-transition-name (two elements with the same name on one page would
 * cancel the transition); the case study's hero mockup carries it statically.
 */
let morphing = false;

export function canMorph() {
  return (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function markMorph(el: HTMLElement | null, slug: string) {
  if (!el || !canMorph()) return;
  el.style.viewTransitionName = `shot-${slug}`;
  morphing = true;
  window.setTimeout(() => {
    el.style.viewTransitionName = "";
  }, 1200);
}

/** True once, right after a morph navigation — lets the new page skip its own intro. */
export function consumeMorph() {
  const was = morphing;
  morphing = false;
  return was;
}
