import type { ReactNode } from "react";
import { LocaleLink } from "./LocaleLink";

/** Link to a case study in the current language: ShuStyle has its own route. */
export function CaseStudyLink({
  slug,
  children,
  className,
  ...rest
}: {
  slug: string;
  children: ReactNode;
  className?: string;
  "data-num"?: string;
}) {
  if (slug === "shustyle") {
    return (
      <LocaleLink to="/work/shustyle" className={className} {...rest}>
        {children}
      </LocaleLink>
    );
  }
  return (
    <LocaleLink to="/work/$slug" slug={slug} className={className} {...rest}>
      {children}
    </LocaleLink>
  );
}
