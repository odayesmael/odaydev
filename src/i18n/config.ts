export const LOCALES = ["en", "ar", "nl", "tr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<
  Locale,
  { name: string; short: string; dir: "ltr" | "rtl"; og: string }
> = {
  en: { name: "English", short: "EN", dir: "ltr", og: "en_US" },
  ar: { name: "العربية", short: "عربي", dir: "rtl", og: "ar_AR" },
  nl: { name: "Nederlands", short: "NL", dir: "ltr", og: "nl_NL" },
  tr: { name: "Türkçe", short: "TR", dir: "ltr", og: "tr_TR" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** The locale for a `{-$locale}` URL param: missing means English. */
export function localeFromParam(param: string | undefined): Locale {
  return isLocale(param) ? param : DEFAULT_LOCALE;
}

/** The value to put in the `{-$locale}` param: English has no prefix. */
export function localeParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}

/** "/portfolio" -> "/ar/portfolio" (or unchanged for English). */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Strip a locale prefix from a pathname: "/ar/work/x" -> "/work/x". */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(ar|nl|tr)(?=\/|$)/);
  if (!m) return pathname || "/";
  const rest = pathname.slice(m[0].length);
  return rest === "" ? "/" : rest;
}
