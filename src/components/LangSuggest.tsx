import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  localePath,
  messagesFor,
  stripLocale,
  useLocale,
  type Locale,
} from "@/i18n";
import { track } from "@/lib/analytics";

const KEY = "oday:lang-suggest-dismissed";

/** First supported language in the browser's preference list, if any. */
function preferredLocale(): Locale | null {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of langs) {
    const base = l?.toLowerCase().split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

/**
 * A small, dismissible hint offering an English page in the visitor's browser
 * language (Arabic, Dutch or Turkish).
 * Never redirects (search engines and shared links must land where they point).
 * Written in the suggested language, since that's the one the visitor reads.
 */
export function LangSuggest() {
  const locale = useLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [suggest, setSuggest] = useState<Locale | null>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {
      /* storage blocked */
    }
    const pref = preferredLocale();
    // Only offer a translation from the default (English) pages: anyone already
    // on /ar, /nl or /tr chose that language (or a search result chose it for them).
    if (dismissed || locale !== DEFAULT_LOCALE || !pref || pref === locale) return setSuggest(null);
    const id = window.setTimeout(() => setSuggest(pref), 1800);
    return () => window.clearTimeout(id);
  }, [locale]);

  if (!suggest) return null;
  const t = messagesFor(suggest).langSuggest;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setSuggest(null);
  };

  return (
    <div
      className="lang-suggest"
      role="region"
      aria-label={LOCALE_META[suggest].name}
      lang={suggest}
      dir={LOCALE_META[suggest].dir}
    >
      <span className="lang-suggest-text">{t.text}</span>
      <a
        className="lang-suggest-go"
        href={localePath(suggest, stripLocale(pathname))}
        hrefLang={suggest}
        onClick={() => {
          track("lang_suggest_accept", { from: locale, to: suggest });
          dismiss();
        }}
      >
        {t.action} {LOCALE_META[suggest].dir === "rtl" ? "←" : "→"}
      </a>
      <button type="button" className="lang-suggest-x" onClick={dismiss} aria-label={t.dismiss}>
        ×
      </button>
    </div>
  );
}
