/**
 * Smoke test across every language: each page renders, has the right
 * lang/dir and hreflang tags, throws no errors, and never scrolls sideways
 * on a phone. Usage: BASE_URL=http://127.0.0.1:8080 node tests/smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:8080";
const LOCALES = ["", "/ar", "/nl", "/tr"];
const PAGES = [
  "/",
  "/portfolio",
  "/work/shustyle",
  "/work/solechem-europe",
  "/work/dposphere",
  "/blog",
  "/blog/rtl-is-more-than-dir-rtl",
  "/blog/fast-wordpress-checklist",
];
const WIDTHS = [375, 1280];
// Third-party assets (app screenshots, analytics in dev) may be unreachable in CI.
const IGNORE = [/ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|Failed to load resource/i];

const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.error("✗", msg);
};

const browser = await chromium.launch({ args: ["--use-gl=swiftshader"] });
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, locale: "en-US" });
  await ctx.addInitScript(() => {
    sessionStorage.setItem("preloaded", "1");
    localStorage.setItem("oday:ufo-popup", String(Date.now())); // keep the invitation popup out of the checks
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORE.some((r) => r.test(m.text()))) errors.push(m.text());
  });

  for (const loc of LOCALES) {
    for (const p of PAGES) {
      const path = loc && p === "/" ? loc : `${loc}${p}`;
      errors.length = 0;
      const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
      if (!res || res.status() !== 200) {
        fail(`${path} → HTTP ${res?.status()}`);
        continue;
      }
      await page.waitForTimeout(400);
      const info = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        hreflang: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
        canonical: !!document.querySelector('link[rel="canonical"]'),
        h1: document.querySelectorAll("h1").length,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      }));
      const want = loc ? loc.slice(1) : "en";
      if (info.lang !== want) fail(`${path} lang=${info.lang}, expected ${want}`);
      if (info.dir !== (want === "ar" ? "rtl" : "ltr")) fail(`${path} dir=${info.dir}`);
      if (!info.canonical) fail(`${path} has no canonical link`);
      if (info.hreflang < 2) fail(`${path} has ${info.hreflang} hreflang links`);
      if (info.h1 !== 1 && !p.startsWith("/work/shustyle") && p !== "/") fail(`${path} has ${info.h1} <h1>`);
      if (info.overflow > 1) fail(`${path} @${width}px scrolls sideways by ${info.overflow}px`);
      for (const e of errors) fail(`${path} @${width}px: ${e}`);
    }
  }
  await ctx.close();
}

// Endpoints
for (const [path, type] of [
  ["/sitemap.xml", "xml"],
  ["/rss.xml", "xml"],
]) {
  const r = await fetch(BASE + path);
  if (!r.ok || !(r.headers.get("content-type") ?? "").includes(type)) fail(`${path} → ${r.status}`);
}
for (const path of ["/en", "/fr", "/blog/nope", "/work/nope"]) {
  const r = await fetch(BASE + path);
  if (r.status !== 404) fail(`${path} should be 404, got ${r.status}`);
}
const bad = await fetch(BASE + "/api/contact", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name: "x", email: "nope", message: "short" }),
});
if (bad.status !== 400) fail(`/api/contact invalid body → ${bad.status}, expected 400`);

await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} problem(s)`);
  process.exit(1);
}
console.log(`✓ ${LOCALES.length * PAGES.length * WIDTHS.length} page checks passed`);
