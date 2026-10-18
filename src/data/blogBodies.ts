import type { Locale } from "@/i18n/config";

// Kept apart from blog.ts so build scripts can import the registry without Vite.
const bodies = import.meta.glob("../content/blog/*/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, (() => Promise<string>) | undefined>;

/** Load an article body in the requested language (falls back to English). */
export async function loadPostBody(slug: string, locale: Locale) {
  const own = bodies[`../content/blog/${slug}/${locale}.md`];
  const loader = own ?? bodies[`../content/blog/${slug}/en.md`];
  if (!loader) return null;
  return { markdown: await loader(), lang: (own ? locale : "en") as Locale };
}
