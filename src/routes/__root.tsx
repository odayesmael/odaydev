import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { GlobalGlow } from "@/components/GlobalGlow";
import { Starfield } from "@/components/Starfield";
import logoMark from "@/assets/oday-mark.svg";
import { SITE_URL } from "@/lib/site";
import { LOCALE_META, useLocale, useMessages } from "@/i18n";
import { LocaleLink } from "@/components/LocaleLink";

import appCss from "../styles.css?url";
import displayFont from "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url";

function NotFoundComponent() {
  const t = useMessages().notFound;
  return (
    <>
      <div className="grain-overlay" />
      <main className="nf-page">
        <Starfield />
        <LocaleLink to="/" className="logo nf-logo">
          <img className="icon" src={logoMark} alt="" />
          <span className="logo-word">
            oday<span className="logo-dot">.</span>
          </span>
        </LocaleLink>

        <div className="nf-inner">
          <div className="nf-eyebrow">
            <span className="nf-dot" />[ {t.eyebrow} ]
          </div>

          <h1 className="nf-code">
            4<span className="nf-zero">0</span>4
          </h1>

          <h2 className="nf-title">
            {t.title[0]} <em>{t.title[1]}</em>
          </h2>
          <p className="nf-sub">{t.sub}</p>

          <div className="nf-actions">
            <LocaleLink to="/" className="nf-btn nf-btn-primary">
              {t.home} <span className="nf-arrow">→</span>
            </LocaleLink>
            <LocaleLink to="/portfolio" className="nf-btn">
              {t.work} <span className="nf-arrow">↗</span>
            </LocaleLink>
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
      { title: "Oday — Full-Stack Web & Mobile Developer" },
      {
        name: "description",
        content:
          "Full-Stack Web & Mobile Developer with 9 years of experience building fast, custom websites, online stores, platforms and iOS & Android apps, with an AI-assisted workflow.",
      },
      { name: "author", content: "Oday" },
      { name: "theme-color", content: "#050F05" },
      { property: "og:site_name", content: "Oday" },
      { property: "og:title", content: "Oday — Full-Stack Web & Mobile Developer" },
      {
        property: "og:description",
        content:
          "9 years crafting fast, custom websites and mobile apps — front-end, back-end, SEO and UI/UX, with an AI-assisted workflow.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "preload",
        href: displayFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
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
  const locale = useLocale();
  return (
    <html lang={locale} dir={LOCALE_META[locale].dir}>
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
