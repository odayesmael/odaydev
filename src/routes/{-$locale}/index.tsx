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
import { localeFromParam, messagesFor } from "@/i18n";
import { localeLinks, localeMeta } from "@/i18n/seo";
import { ContactCTA } from "@/components/ContactCTA";
import { SiteFooter } from "@/components/SiteFooter";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Oday",
      url: SITE_URL,
      jobTitle: "Full-Stack Web & Mobile Developer",
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
};

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
      ],
      links: localeLinks(locale, "/"),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
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
        <ContactCTA />
        <SiteFooter />
      </div>
    </>
  );
}
