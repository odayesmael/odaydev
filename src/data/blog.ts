import type { Locale } from "@/i18n/config";

/**
 * Blog registry. Article bodies live in src/content/blog/<slug>/<locale>.md
 * and are loaded on demand (each one is its own small chunk), so this file
 * only carries what lists and menus need.
 *
 * To add an article: create the folder + en.md (and any translations),
 * then add an entry here with a title/description per language you wrote.
 */
export type PostMeta = {
  slug: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  tags: string[];
  /** Reading time in minutes (per language, roughly the same) */
  minutes: number;
  /** Languages this article is written in → title + description */
  i18n: Partial<Record<Locale, { title: string; description: string }>> & {
    en: { title: string; description: string };
  };
};

export const posts: PostMeta[] = [
  {
    slug: "rtl-is-more-than-dir-rtl",
    date: "2026-10-16",
    tags: ["RTL", "i18n", "CSS", "SEO"],
    minutes: 8,
    i18n: {
      en: {
        title: "RTL is more than dir=\"rtl\": lessons from making a site Arabic-ready",
        description:
          "Flipping the direction takes a minute; getting Arabic right takes a checklist. Logical CSS, bidi bugs, typography, what should never flip, and multilingual SEO.",
      },
      ar: {
        title: "الـ RTL أكثر من \u2066dir=\"rtl\"\u2069: دروس من تجهيز موقع للغة العربية",
        description:
          "قلب الاتجاه يأخذ دقيقة، أما إتقان العربية فيحتاج قائمة تحقق: خصائص CSS المنطقية، مشاكل النص ثنائي الاتجاه، الطباعة، ما لا يجب قلبه أبداً، وتحسين محركات البحث متعدد اللغات.",
      },
    },
  },
  {
    slug: "fast-wordpress-checklist",
    date: "2026-10-09",
    tags: ["WordPress", "Performance", "Core Web Vitals"],
    minutes: 9,
    i18n: {
      en: {
        title: "Making a WordPress site fast: the checklist I use on client sites",
        description:
          "Measure first, then fix in the order that pays off: hosting and caching, images, page builders, fonts, plugins, third-party scripts and the database.",
      },
      nl: {
        title: "Een WordPress-website snel maken: de checklist die ik bij klanten gebruik",
        description:
          "Eerst meten, dan verbeteren in de volgorde die het meest oplevert: hosting en caching, afbeeldingen, page builders, lettertypen, plugins, scripts van derden en de database.",
      },
      tr: {
        title: "WordPress sitesini hızlandırmak: müşteri projelerinde kullandığım kontrol listesi",
        description:
          "Önce ölçün, sonra en çok fayda sağlayan sırayla düzeltin: barındırma ve önbellek, görseller, sayfa oluşturucular, fontlar, eklentiler, üçüncü taraf betikler ve veritabanı.",
      },
    },
  },
  {
    slug: "shipping-an-app-solo",
    date: "2026-10-02",
    tags: ["iOS", "App Store", "Subscriptions", "AI"],
    minutes: 8,
    i18n: {
      en: {
        title: "Shipping an app to the App Store as a solo developer: what I'd tell myself",
        description:
          "Lessons from launching ShuStyle on iOS and preparing it for Google Play: store listings in five languages, subscriptions, privacy forms, AI costs, review and the website around it.",
      },
    },
  },
  {
    slug: "hardening-a-portfolio-site",
    date: "2026-09-25",
    tags: ["Security", "CSP", "Headers", "Forms"],
    minutes: 7,
    i18n: {
      en: {
        title: "Hardening a small site: security headers, CSP and a contact form bots can't abuse",
        description:
          "A practical baseline for portfolio and company sites — the headers worth sending, a Content-Security-Policy that doesn't break things, and a spam-resistant contact endpoint.",
      },
    },
  },
].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** Title/description in the requested language, falling back to English. */
export function postText(post: PostMeta, locale: Locale) {
  const own = post.i18n[locale];
  return { ...(own ?? post.i18n.en), lang: (own ? locale : "en") as Locale, translated: !!own };
}
