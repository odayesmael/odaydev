/**
 * Prints the strings the OG image generator needs, per language, as JSON.
 * Run: npx tsx scripts/og/dump.ts > /tmp/og.json
 */
import { LOCALES } from "../../src/i18n/config";
import en from "../../src/i18n/messages/en";
import ar from "../../src/i18n/messages/ar";
import nl from "../../src/i18n/messages/nl";
import tr from "../../src/i18n/messages/tr";
import arC from "../../src/i18n/content/ar";
import nlC from "../../src/i18n/content/nl";
import trC from "../../src/i18n/content/tr";
import { caseStudies } from "../../src/data/caseStudies";
import { shustyle } from "../../src/data/shustyle";
import { posts } from "../../src/data/blog";
import { projects } from "../../src/data/projects";

const M = { en, ar, nl, tr } as const;
const C = { ar: arC, nl: nlC, tr: trC } as const;

const out = LOCALES.map((l) => {
  const t = M[l];
  const c = l === "en" ? null : C[l];
  return {
    locale: l,
    home: { eyebrow: t.hero.label, line1: t.hero.line1, line2: t.hero.line2, foot: t.marquee },
    portfolio: {
      eyebrow: t.portfolio.eyebrow.replace("{n}", String(projects.length)),
      title: t.portfolio.title,
      sub: t.portfolio.sub,
    },
    blog: { eyebrow: t.blog.eyebrow, title: t.blog.title, sub: t.blog.sub },
    caseEyebrow: t.caseStudy.eyebrow,
    cases: [
      {
        slug: "shustyle",
        name: "ShuStyle",
        tagline: c?.shustyle.tagline ?? shustyle.tagline,
        domain: "shustyle.app",
      },
      ...caseStudies.map((cs) => ({
        slug: cs.slug,
        name: cs.name,
        tagline: c?.caseStudies[cs.slug]?.tagline ?? cs.tagline,
        domain: cs.domain,
      })),
    ],
    posts: posts
      .filter((p) => p.i18n[l])
      .map((p) => ({
        slug: p.slug,
        title: p.i18n[l]!.title,
        tags: p.tags,
        minutes: t.blog.minRead.replace("{n}", String(p.minutes)),
      })),
  };
});

console.log(JSON.stringify(out, null, 2));
