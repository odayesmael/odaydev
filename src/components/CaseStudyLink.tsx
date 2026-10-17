import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

/** Typed link to a case study: ShuStyle has its own route, the rest use /work/$slug. */
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
      <Link to="/work/shustyle" className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/work/$slug" params={{ slug }} className={className} {...rest}>
      {children}
    </Link>
  );
}
