import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BottomNav } from "@/components/BottomNav";
import { ContactCTA } from "@/components/ContactCTA";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Starfield } from "@/components/Starfield";
import { LocaleLink } from "@/components/LocaleLink";
import { Markdown, headingsOf } from "@/components/Markdown";
import { getPost, postText, posts } from "@/data/blog";
import { loadPostBody } from "@/data/blogBodies";
import { SITE_URL } from "@/lib/site";
import { track } from "@/lib/analytics";
import {
  fmt,
  LOCALES,
  LOCALE_META,
  localeFromParam,
  localePath,
  messagesFor,
  useLocale,
  useMessages,
  type Locale,
} from "@/i18n";
import { formatDate, localeMeta, ogImageMeta } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/blog/$slug")({
  loader: async ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    const locale = localeFromParam(params.locale);
    const body = await loadPostBody(post.slug, locale);
    if (!body) throw notFound();
    return { slug: post.slug, markdown: body.markdown, lang: body.lang };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const post = getPost(loaderData.slug)!;
    const locale = localeFromParam(params.locale);
    const text = postText(post, locale);
    const path = `/blog/${post.slug}`;
    // Untranslated articles point search engines at the original language.
    const canonicalLocale = text.lang;
    const url = `${SITE_URL}${localePath(canonicalLocale, path)}`;
    const written = LOCALES.filter((l) => post.i18n[l]);
    return {
      meta: [
        { title: `${text.title} — Oday` },
        { name: "description", content: text.description },
        { property: "og:title", content: text.title },
        { property: "og:description", content: text.description },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.date },
        { property: "article:author", content: "Oday" },
        ...post.tags.map((tag) => ({ property: "article:tag", content: tag })),
        ...localeMeta(canonicalLocale, path),
        ...ogImageMeta(canonicalLocale, `blog-${post.slug}`, text.title),
      ],
      links: [
        { rel: "canonical", href: url },
        ...written.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: `${SITE_URL}${localePath(l, path)}`,
        })),
        ...(written.length > 1
          ? [{ rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${path}` }]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                headline: text.title,
                description: text.description,
                inLanguage: text.lang,
                datePublished: post.date,
                dateModified: post.date,
                keywords: post.tags.join(", "),
                url,
                mainEntityOfPage: url,
                image: `${SITE_URL}/og/${canonicalLocale}/blog-${post.slug}.jpg`,
                author: {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  name: "Oday",
                  url: SITE_URL,
                },
                publisher: { "@id": `${SITE_URL}/#person` },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Oday", item: `${SITE_URL}${localePath(locale, "/")}` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: messagesFor(locale).blog.eyebrow,
                    item: `${SITE_URL}${localePath(locale, "/blog")}`,
                  },
                  { "@type": "ListItem", position: 3, name: text.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: PostPage,
});

function ShareRow({ title }: { title: string }) {
  const t = useMessages().blog;
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href), []);
  return (
    <div className="bl-share">
      <span>{t.share}</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("article_share", { via: "linkedin" })}
      >
        LinkedIn
      </a>
      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("article_share", { via: "x" })}
      >
        X
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
            track("article_share", { via: "copy" });
          } catch {
            /* ignore */
          }
        }}
      >
        {copied ? t.linkCopied : t.copyLink}
      </button>
    </div>
  );
}

function PostPage() {
  const data = Route.useLoaderData();
  const locale = useLocale();
  const t = useMessages();
  const post = getPost(data.slug)!;
  const text = postText(post, locale);
  const lang: Locale = data.lang;
  const dir = LOCALE_META[lang].dir;
  // The page's own language, for UI labels around an article written in another one
  const pageDir = LOCALE_META[locale].dir;
  const headings = headingsOf(data.markdown).filter((h) => h.level === 2);
  const ref = useRef<HTMLDivElement>(null);
  const others = LOCALES.filter((l) => post.i18n[l] && l !== lang);
  const i = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[(i + 1) % posts.length];
  const nextText = next && next.slug !== post.slug ? postText(next, locale) : null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bl-head > *", { y: 28, opacity: 0, stagger: 0.07, duration: 0.8, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, [post.slug]);

  return (
    <>
      <div className="grain-overlay" />
      <div className="dr-page bl-page" ref={ref}>
        <Starfield />
        <PageHeader />
        <main className="bl-main">
          <header className="bl-head" lang={lang} dir={dir}>
            <nav className="cs-crumbs" aria-label="Breadcrumb" lang={locale}>
              <LocaleLink to="/blog">{t.blog.back}</LocaleLink> <span>/</span>{" "}
              <span>{post.tags[0]}</span>
            </nav>
            <ul className="bl-tags">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <h1 className="bl-title">
              {text.title}
            </h1>
            <p className="bl-lead">
              {text.description}
            </p>
            <div className="bl-byline">
              <span className="bl-avatar" aria-hidden>
                O
              </span>
              <span>
                <strong>Oday</strong>
                <span className="bl-byline-sub" lang={locale} dir={pageDir}>
                  {t.blog.published}{" "}
                  <time dateTime={post.date}>{formatDate(post.date, locale)}</time> ·{" "}
                  {fmt(t.blog.minRead, { n: post.minutes })}
                </span>
              </span>
            </div>
            {lang !== locale && (
              <p className="bl-notice" lang={locale} dir={pageDir}>
                {fmt(t.blog.onlyIn, { lang: LOCALE_META[lang].name })}
              </p>
            )}
            {others.length > 0 && (
              <p className="bl-also" lang={locale} dir={pageDir}>
                {t.blog.alsoIn}{" "}
                {others.map((l, k) => (
                  <span key={l}>
                    {k > 0 && " · "}
                    <a href={localePath(l, `/blog/${post.slug}`)} hrefLang={l} lang={l}>
                      {LOCALE_META[l].name}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </header>

          <div className="bl-layout" lang={lang} dir={dir}>
            {headings.length > 2 && (
              <aside className="bl-toc" aria-label={t.blog.toc}>
                <div className="bl-toc-label" lang={locale}>
                  [ {t.blog.toc} ]
                </div>
                <ol>
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}>{h.text.replace(/`/g, "")}</a>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
            <article className="bl-prose">
              <Markdown source={data.markdown} />
              <div lang={locale} dir={pageDir}>
                <ShareRow title={text.title} />
              </div>
              <div className="bl-cta" lang={locale} dir={pageDir}>
                <h2>{t.blog.ctaTitle}</h2>
                <p>{t.blog.ctaBody}</p>
                <a className="as-btn as-btn-primary" href={`${localePath(locale, "/")}#contact`}>
                  {t.blog.ctaButton} <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          </div>

          {nextText && (
            <nav className="cs-next bl-next">
              <LocaleLink to="/blog/$slug" slug={next.slug} className="pr-viewall">
                {t.blog.next}: {nextText.title} <span className="pr-arrow">→</span>
              </LocaleLink>
            </nav>
          )}
        </main>
        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
