import { caseStudies } from "@/data/caseStudies";
import { posts } from "@/data/blog";
import { SITE_URL } from "@/lib/site";
import { LOCALES, localePath, type Locale } from "@/i18n/config";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

type Entry = { path: string; locales: readonly Locale[]; lastmod: string; priority: string };

/** Every indexable URL with its language alternates — generated from the data, never stale. */
export function sitemapXml(today = new Date().toISOString().slice(0, 10)) {
  const entries: Entry[] = [
    { path: "/", locales: LOCALES, lastmod: today, priority: "1.0" },
    { path: "/portfolio", locales: LOCALES, lastmod: today, priority: "0.9" },
    { path: "/work/shustyle", locales: LOCALES, lastmod: today, priority: "0.8" },
    ...caseStudies.map((c) => ({
      path: `/work/${c.slug}`,
      locales: LOCALES,
      lastmod: today,
      priority: "0.8",
    })),
    { path: "/blog", locales: LOCALES, lastmod: posts[0]?.date ?? today, priority: "0.7" },
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      locales: LOCALES.filter((l) => p.i18n[l]),
      lastmod: p.date,
      priority: "0.6",
    })),
  ];

  const urls = entries.flatMap((e) =>
    e.locales.map((l) => {
      const alts =
        e.locales.length > 1
          ? [
              ...e.locales.map(
                (a) =>
                  `    <xhtml:link rel="alternate" hreflang="${a}" href="${SITE_URL}${localePath(a, e.path)}"/>`,
              ),
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${e.path}"/>`,
            ]
          : [];
      return [
        "  <url>",
        `    <loc>${SITE_URL}${localePath(l, e.path)}</loc>`,
        ...alts,
        `    <lastmod>${e.lastmod}</lastmod>`,
        `    <priority>${e.priority}</priority>`,
        "  </url>",
      ].join("\n");
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

/** RSS 2.0 feed of the articles (English titles, links to each article's original language). */
export function rssXml() {
  const items = posts.map((p) => {
    const t = p.i18n.en;
    const url = `${SITE_URL}/blog/${p.slug}`;
    return `    <item>
      <title>${esc(t.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(t.description)}</description>
${p.tags.map((tag) => `      <category>${esc(tag)}</category>`).join("\n")}
    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Oday — Notes &amp; articles</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Practical write-ups on multilingual sites, WordPress performance, shipping apps and web security.</description>
    <language>en</language>
${items.join("\n")}
  </channel>
</rss>
`;
}
