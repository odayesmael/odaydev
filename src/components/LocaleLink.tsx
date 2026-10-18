import type React from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { localeParam, useLocale } from "@/i18n";

type Target = "/" | "/portfolio" | "/work/shustyle" | "/work/$slug" | "/blog" | "/blog/$slug";

/** An internal link that keeps the visitor's language (adds /ar, /nl or /tr). */
export function LocaleLink({
  to,
  slug,
  children,
  ...rest
}: {
  to: Target;
  slug?: string;
  children: ReactNode;
  className?: string;
  "data-num"?: string;
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  const locale = useLocale();
  const params = { locale: localeParam(locale), ...(slug ? { slug } : {}) };
  const target = to === "/" ? "/{-$locale}" : `/{-$locale}${to}`;
  return (
    // The route id is built at runtime; the router resolves it against the typed tree.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link to={target as any} params={params as any} {...rest}>
      {children}
    </Link>
  );
}
