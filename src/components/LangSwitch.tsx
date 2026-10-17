import { useRouterState } from "@tanstack/react-router";
import { LOCALES, LOCALE_META, localePath, stripLocale, useLocale, useMessages } from "@/i18n";

/** Language links that keep the current page: /work/x <-> /ar/work/x. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useMessages();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = stripLocale(pathname);

  return (
    <nav className={`lang-switch ${className}`} aria-label={t.common.language}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={localePath(l, base)}
          hrefLang={l}
          lang={l}
          className={l === locale ? "is-active" : ""}
          aria-current={l === locale ? "true" : undefined}
          title={LOCALE_META[l].name}
        >
          {LOCALE_META[l].short}
        </a>
      ))}
    </nav>
  );
}
