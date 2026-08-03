import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { ContactCTA } from "@/components/ContactCTA";
import { BottomNav } from "@/components/BottomNav";
import { Starfield } from "@/components/Starfield";
import { SiteFooter } from "@/components/SiteFooter";
import { GlobalGlow } from "@/components/GlobalGlow";
import logoMark from "@/assets/oday-mark.svg";

export const Route = createFileRoute("/product")({
  component: ProductRoute,
  head: () => ({
    meta: [
      { title: "Asset Atlas — Product — NULLSEC" },
      {
        name: "description",
        content:
          "Reduce your attack surface, eliminate shadow IT, and stay compliant with a comprehensive, unified view of your digital assets.",
      },
      { property: "og:title", content: "Asset Atlas — Product — NULLSEC" },
      {
        property: "og:description",
        content:
          "AI-powered asset intelligence: real-time insights, change tracking, and on-demand reporting.",
      },
    ],
  }),
});

function ProductRoute() {
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
        <ProductPage />
        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
