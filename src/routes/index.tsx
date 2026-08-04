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
import { ContactCTA } from "@/components/ContactCTA";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Oday — Full-Stack Web Developer" },
      { name: "description", content: "Oday — Full-Stack Web Developer with 9 years of experience building websites of every kind: corporate sites, web apps, online stores and custom platforms, with an AI-assisted workflow. Based in the Netherlands, working worldwide." },
      { property: "og:title", content: "Oday — Full-Stack Web Developer" },
      { property: "og:description", content: "9 years crafting fast, custom websites of every kind — front-end, back-end, SEO and UI/UX, with an AI-assisted workflow." },
    ],
  }),
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
        <Projects />
        <Skills />
        <ContactCTA />
        <SiteFooter />
      </div>
    </>
  );
}
