import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isLocale } from "@/i18n";

/**
 * Optional language prefix: "/" is English, "/ar", "/nl" and "/tr" the others.
 * Anything else in that position (including "/en") is a 404.
 */
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale !== undefined && (!isLocale(params.locale) || params.locale === "en")) {
      throw notFound();
    }
  },
  component: Outlet,
});
