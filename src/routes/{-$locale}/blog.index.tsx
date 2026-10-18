import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BottomNav } from "@/components/BottomNav";
import { ContactCTA } from "@/components/ContactCTA";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Starfield } from "@/components/Starfield";
import { PostCard } from "@/components/PostCard";
import { posts } from "@/data/blog";
import { SITE_URL } from "@/lib/site";
import { localeFromParam, localePath, messagesFor, useMessages } from "@/i18n";
import { localeLinks, localeMeta, ogImageMeta } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/blog/")({
  component: BlogIndex,
  head: ({ params }) => {
    const locale = localeFromParam(params.locale);
    const t = messagesFor(locale).blog;
    return {
      meta: [
        { title: t.metaTitle },
        { name: "description", content: t.metaDescription },
        { property: "og:title", content: t.metaTitle },
        { property: "og:description", content: t.metaDescription },
        ...localeMeta(locale, "/blog"),
        ...ogImageMeta(locale, "blog", t.metaTitle),
      ],
      links: [
        ...localeLinks(locale, "/blog"),
        { rel: "alternate", type: "application/rss+xml", title: "Oday — Notes", href: "/rss.xml" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: t.metaTitle,
            description: t.metaDescription,
            url: `${SITE_URL}${localePath(locale, "/blog")}`,
            inLanguage: locale,
            author: { "@id": `${SITE_URL}/#person` },
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: (p.i18n[locale] ?? p.i18n.en).title,
              datePublished: p.date,
              url: `${SITE_URL}${localePath(p.i18n[locale] ? locale : "en", `/blog/${p.slug}`)}`,
            })),
          }),
        },
      ],
    };
  },
});

function BlogIndex() {
  const t = useMessages().blog;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pf-hero > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" });
      gsap.from(".bl-card", { y: 30, opacity: 0, stagger: 0.07, duration: 0.7, ease: "power3.out", delay: 0.15 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="grain-overlay" />
      <div className="dr-page">
        <Starfield />
        <PageHeader />
        <section className="portfolio-section bl-index" ref={ref}>
          <div className="pf-hero">
            <div className="pf-eyebrow">
              <span className="pr-dot" />[ {t.eyebrow} ]
            </div>
            <h1 className="pf-title">
              {t.title[0]} <em>{t.title[1]}</em>
            </h1>
            <p className="pf-sub">{t.sub}</p>
          </div>
          <div className="bl-list">
            {posts.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </section>
        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
