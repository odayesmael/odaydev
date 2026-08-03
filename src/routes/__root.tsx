import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { GlobalGlow } from "@/components/GlobalGlow";
import { Starfield } from "@/components/Starfield";
import logoMark from "@/assets/oday-mark.svg";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <>
      <div className="grain-overlay" />
      <main className="nf-page">
        <Starfield />
        <Link to="/" className="logo nf-logo">
          <img className="icon" src={logoMark} alt="" />
          <span>ODAY</span>
        </Link>

        <div className="nf-inner">
          <div className="nf-eyebrow">
            <span className="nf-dot" />
            [ ERROR 404 · ROUTE NOT FOUND ]
          </div>

          <h1 className="nf-code">
            4<span className="nf-zero">0</span>4
          </h1>

          <h2 className="nf-title">
            This page <em>doesn&apos;t exist.</em>
          </h2>
          <p className="nf-sub">
            The link may be broken or the page has moved. Let&apos;s get you back to something that
            works.
          </p>

          <div className="nf-actions">
            <Link to="/" className="nf-btn nf-btn-primary">
              Back home <span className="nf-arrow">→</span>
            </Link>
            <Link to="/portfolio" className="nf-btn">
              View my work <span className="nf-arrow">↗</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Oday Ismail — Full-Stack Web Developer" },
      { name: "description", content: "Full-Stack Web Developer with 9 years of experience building fast, custom websites of every kind — corporate sites, web apps, online stores and platforms, with an AI-assisted workflow." },
      { name: "author", content: "Oday Ismail" },
      { property: "og:title", content: "Oday Ismail — Full-Stack Web Developer" },
      { property: "og:description", content: "9 years crafting fast, custom websites of every kind — front-end, back-end, SEO and UI/UX, with an AI-assisted workflow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Space+Mono:wght@400;700&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <GlobalGlow />
      <Outlet />
    </>
  );
}
