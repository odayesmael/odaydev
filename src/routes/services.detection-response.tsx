import { createFileRoute, Link } from "@tanstack/react-router";
import { DetectionResponse } from "@/components/DetectionResponse";
import { WhatWeOffer } from "@/components/WhatWeOffer";
import { MoreServices } from "@/components/MoreServices";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { GlobalGlow } from "@/components/GlobalGlow";
import logoMark from "@/assets/oday-mark.svg";

export const Route = createFileRoute("/services/detection-response")({
  component: DetectionResponsePage,
  head: () => ({
    meta: [
      { title: "Detection and Response — NULLSEC" },
      {
        name: "description",
        content:
          "We amplify your threat visibility and employ automated incident response to safeguard your resources, standing, and activities.",
      },
      { property: "og:title", content: "Detection and Response — NULLSEC" },
      {
        property: "og:description",
        content:
          "Continuous monitoring and AI-assisted incident response across cloud, endpoint and identity surfaces.",
      },
    ],
  }),
});

function DetectionResponsePage() {
  return (
    <>
      <GlobalGlow />
      <div className="grain-overlay" />
      <div className="dr-page">
        <Starfield />
        <header className="dr-page-top">
          <Link to="/" className="logo dr-logo">
            <img className="icon" src={logoMark} alt="" />
            <span>NULLSEC</span>
          </Link>
          <Link to="/" className="contact-btn">
            Contact us <span className="arrow">↗</span>
          </Link>
        </header>
        <DetectionResponse />
        <WhatWeOffer />
        <MoreServices />
        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
