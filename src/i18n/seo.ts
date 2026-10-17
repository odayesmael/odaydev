import { SITE_URL } from "@/lib/site";
import { LOCALES, LOCALE_META, localePath, type Locale } from "./config";

/** Canonical + hreflang alternates for a page path like "/portfolio". */
export function localeLinks(locale: Locale, path: string) {
  return [
    { rel: "canonical", href: `${SITE_URL}${localePath(locale, path)}` },
    ...LOCALES.map((l) => ({
      rel: "alternate",
      hrefLang: l,
      href: `${SITE_URL}${localePath(l, path)}`,
    })),
    { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${path}` },
  ];
}

/** og:url and og:locale (+ alternates) for a page. */
export function localeMeta(locale: Locale, path: string) {
  return [
    { property: "og:url", content: `${SITE_URL}${localePath(locale, path)}` },
    { property: "og:locale", content: LOCALE_META[locale].og },
    ...LOCALES.filter((l) => l !== locale).map((l) => ({
      property: "og:locale:alternate",
      content: LOCALE_META[l].og,
    })),
  ];
}
