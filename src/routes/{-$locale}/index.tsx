import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Preloader } from "@/components/Preloader";
import { Hero } from "@/components/Hero";
import { LogoMarquee } from "@/components/LogoMarquee";
import { Services } from "@/components/Services";
import { TextGrid } from "@/components/TextGrid";
import { Starfield } from "@/components/Starfield";
import { Skills } from "@/components/Skills";
import { Tools } from "@/components/Tools";
import { Projects } from "@/components/Projects";
import { AppSpotlight } from "@/components/AppSpotlight";
import { SITE_URL } from "@/lib/site";
import { localeFromParam, localePath, messagesFor, type Locale } from "@/i18n";
import { localeLinks, localeMeta, ogImageMeta } from "@/i18n/seo";
import { ContactCTA } from "@/components/ContactCTA";
import { SiteFooter } from "@/components/SiteFooter";
import { Testimonials } from "@/components/Testimonials";
import { LatestPosts } from "@/components/LatestPosts";

const jsonLd = (locale: Locale, jobTitle: string, description: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "oday.dev",
      url: SITE_URL,
      inLanguage: ["en", "ar", "nl", "tr"],
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}${localePath(locale, "/")}#page`,
      url: `${SITE_URL}${localePath(locale, "/")}`,
      inLanguage: locale,
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Oday",
      alternateName: "عدي",
      url: SITE_URL,
      jobTitle,
      description,
      image: `${SITE_URL}/icon-512.png`,
      address: { "@type": "PostalAddress", addressCountry: "NL" },
      knowsLanguage: ["en", "ar", "tr", "nl"],
      knowsAbout: ["Web development", "WordPress", "React", "Mobile apps", "SEO", "UI/UX design"],
      sameAs: ["https://www.linkedin.com/in/oday-alatbash/", "https://github.com/odayesmael"],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Oday — Web & Mobile Development",
      url: SITE_URL,
      image: `${SITE_URL}/og-image.png`,
      founder: { "@id": `${SITE_URL}/#person` },
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressCountry: "NL" },
      serviceType: [
        "Web design",
        "Web development",
        "SEO",
        "UI/UX design",
        "Mobile app development",
      ],
    },
  ],
});

export const Route = createFileRoute("/{-$locale}/")({
  component: Index,
  head: ({ params }) => {
    const locale = localeFromParam(params.locale);
    const t = messagesFor(locale);
    return {
      meta: [
        { title: t.meta.homeTitle },
        { name: "description", content: t.meta.homeDescription },
        { property: "og:title", content: t.meta.homeTitle },
        { property: "og:description", content: t.meta.ogDescription },
        ...localeMeta(locale, "/"),
        ...ogImageMeta(locale, "home", t.meta.homeTitle),
      ],
      links: [
        ...localeLinks(locale, "/"),
        { rel: "alternate", type: "application/rss+xml", title: "Oday — Notes", href: "/rss.xml" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd(locale, t.hero.label, t.meta.homeDescription)),
        },
      ],
    };
  },
});

function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("preloaded")) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <div className="grain-overlay" />
      <Hero play={!loading} />
      <div className="post-hero-wrap">
        <Starfield />
        <LogoMarquee />
        <TextGrid />
        <Tools />
        <Services />
        <AppSpotlight />
        <Projects />
        <Skills />
        <Testimonials />
        <LatestPosts />
        <ContactCTA />
        <SiteFooter />
      </div>
    </>
  );
}
