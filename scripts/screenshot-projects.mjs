/**
 * Captures desktop + mobile screenshots of every project in src/data/projects.ts
 * and writes a health report. Run in CI (needs `playwright` and `sharp`):
 *   node scripts/screenshot-projects.mjs
 * Output: public/work/<slug>-desktop.webp, public/work/<slug>-mobile.webp,
 *         scripts/site-report.json
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const root =
  process.env.REPO_ROOT || path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = fs.readFileSync(path.join(root, "src/data/projects.ts"), "utf8");
const projects = [...src.matchAll(/slug: "([^"]+)",[\s\S]*?url: "([^"]+)"/g)]
  .map(([, slug, url]) => ({ slug, url }))
  .filter((p) => p.slug !== "shustyle");

const outDir = path.join(root, "public/work");
fs.mkdirSync(outDir, { recursive: true });

const HIDE_OVERLAYS = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [class*="gdpr" i], [id*="gdpr" i], [class*="cmplz" i], [id*="cmplz" i],
  [class*="cky-" i], #onetrust-banner-sdk, .fc-consent-root, [class*="popup-maker" i],
  [class*="newsletter-popup" i], [id*="chat-widget" i], iframe[title*="chat" i],
  .grecaptcha-badge, [class*="whatsapp" i] { display: none !important; visibility: hidden !important; }
  html, body { overflow: auto !important; }
`;

const BAD_SIGNS = [
  /domain (is )?for sale/i, /buy this domain/i, /account (has been )?suspended/i,
  /this site can.?t be reached/i, /website (is )?(expired|suspended)/i,
  /index of \//i, /default web page/i, /under construction/i, /coming soon/i,
  /404 not found/i, /page not found/i, /error establishing a database connection/i,
  /there has been a critical error/i, /hesap askıya alındı/i, /bu alan adı satılık/i,
];

async function shoot(browser, p, kind) {
  const isMobile = kind === "mobile";
  const ctx = await browser.newContext({
    viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: isMobile ? 2 : 1,
    isMobile,
    hasTouch: isMobile,
    userAgent: isMobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
      : undefined,
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();
  const info = { status: null, finalUrl: null, title: null, error: null, flags: [] };
  try {
    let res;
    try {
      res = await page.goto(p.url, { waitUntil: "networkidle", timeout: 45000 });
    } catch {
      res = await page.goto(p.url, { waitUntil: "load", timeout: 45000 });
    }
    info.status = res?.status() ?? null;
    info.finalUrl = page.url();
    await page.addStyleTag({ content: HIDE_OVERLAYS }).catch(() => {});
    // Nudge lazy-loaded content and scroll-triggered reveals, then return to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < 2400; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(2500);
    info.title = await page.title();
    const text = (await page.evaluate(() => document.body?.innerText || "")).slice(0, 5000);
    for (const re of BAD_SIGNS) if (re.test(text) || re.test(info.title || "")) info.flags.push(re.source);
    if (text.trim().length < 40) info.flags.push("almost-empty-page");
    const png = await page.screenshot({ type: "png" });
    await sharp(png)
      .resize(isMobile ? 780 : 1440)
      .webp({ quality: 78 })
      .toFile(path.join(outDir, `${p.slug}-${kind}.webp`));
  } catch (e) {
    info.error = String(e.message || e).split("\n")[0];
  } finally {
    await ctx.close();
  }
  return info;
}

const browser = await chromium.launch();
const report = [];
for (const p of projects) {
  const desktop = await shoot(browser, p, "desktop");
  const mobile = await shoot(browser, p, "mobile");
  const ok =
    !desktop.error && desktop.status && desktop.status < 400 && desktop.flags.length === 0;
  report.push({ ...p, ok, desktop, mobile });
  console.log(`${ok ? "OK  " : "FAIL"} ${p.slug} ${desktop.status ?? ""} ${desktop.error ?? desktop.flags.join(",")}`);
}
await browser.close();
fs.writeFileSync(path.join(root, "scripts/site-report.json"), JSON.stringify(report, null, 2));
