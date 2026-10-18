import type { Locale } from "@/i18n/config";

/**
 * Client testimonials. Only add REAL quotes, with the client's permission.
 * The section stays hidden on the site until this list has at least one entry.
 *
 * - `quote` is shown as written (any language); add `translations` to show a
 *   translated version on other language pages.
 * - `project` (a project slug) also shows the quote on that case study page.
 *
 * Example:
 * {
 *   quote: "Oday rebuilt our site in three weeks and it's twice as fast.",
 *   name: "Jane Doe",
 *   role: "Marketing Manager",
 *   company: "Acme B.V.",
 *   project: "solechem-europe",
 *   lang: "en",
 * },
 */
export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  /** Project slug this quote is about */
  project?: string;
  /** Language the quote was written in */
  lang: Locale;
  translations?: Partial<Record<Locale, string>>;
  /** Optional avatar in /public, e.g. "/people/jane.webp" */
  avatar?: string;
};

export const testimonials: Testimonial[] = [];
