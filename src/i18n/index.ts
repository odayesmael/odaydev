import { useRouterState } from "@tanstack/react-router";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import en, { type Messages } from "./messages/en";
import ar from "./messages/ar";
import nl from "./messages/nl";
import tr from "./messages/tr";
import arContent from "./content/ar";
import nlContent from "./content/nl";
import trContent from "./content/tr";
import type { LocalizedContent } from "./content/types";
import type { Project } from "@/data/projects";
import type { CaseStudy } from "@/data/caseStudies";
import { shustyle } from "@/data/shustyle";

export * from "./config";
export type { Messages };

const MESSAGES: Record<Locale, Messages> = { en, ar, nl, tr };
const CONTENT: Partial<Record<Locale, LocalizedContent>> = {
  ar: arContent,
  nl: nlContent,
  tr: trContent,
};

/** Current locale, from the URL's first segment ("/ar/...", "/nl", ...). Works on 404s too. */
export function useLocale(): Locale {
  const first = useRouterState({ select: (s) => s.location.pathname.split("/")[1] });
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale];
}

/** UI copy for the current locale. */
export function useMessages(): Messages {
  return MESSAGES[useLocale()];
}

/** "View all {n} projects" + { n: 21 } -> "View all 21 projects" */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

/* ---------------- Data content ---------------- */

export function localizeProject(p: Project, locale: Locale): Project & { categoryLabel: string } {
  const body = CONTENT[locale]?.projects[p.slug] ?? p.body;
  const categoryLabel = MESSAGES[locale].categories[p.category] ?? p.category;
  return { ...p, body, categoryLabel };
}

export function localizeCaseStudy(cs: CaseStudy, locale: Locale): CaseStudy {
  const t = CONTENT[locale]?.caseStudies[cs.slug];
  if (!t) return cs;
  return {
    ...cs,
    tagline: t.tagline,
    kind: t.kind,
    summary: t.summary,
    meta: t.meta,
    stats: cs.stats?.map((s, i) => ({ value: s.value, label: t.stats?.[i] ?? s.label })),
    challenge: t.challenge,
    features: t.features,
    gallery: cs.gallery.map((g, i) => ({ label: t.gallery[i] ?? g.label })),
    deliverables: t.deliverables,
  };
}

type Shustyle = typeof shustyle;
export function localizeShustyle(locale: Locale) {
  const t = CONTENT[locale]?.shustyle;
  if (!t) return shustyle;
  return {
    ...shustyle,
    tagline: t.tagline,
    summary: t.summary,
    meta: t.meta,
    screens: shustyle.screens.map((s, i) => ({
      // shustyle.app ships Arabic app screens; other languages use the English ones
      src: locale === "ar" ? s.src.replace(/-en\.webp$/, "-ar.webp") : s.src,
      caption: t.screens[i] ?? s.caption,
    })),
    steps: shustyle.steps.map((s, i) => ({ ...s, ...t.steps[i] })),
    features: t.features,
    plans: shustyle.plans.map((p, i) => ({ ...p, ...t.plans[i] })),
    website: t.website,
    deliverables: t.deliverables,
  } as unknown as Shustyle;
}
