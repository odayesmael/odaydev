When a client says "the site is slow", the first instinct is to install another optimisation plugin. That rarely fixes it. A fast WordPress site comes from a handful of decisions made in the right order. This is the checklist I work through on client sites, from corporate sites built with Elementor to WooCommerce stores.

## 1. Measure before you touch anything

Open [PageSpeed Insights](https://pagespeed.web.dev/) and look at the **field data** first: that's how real visitors experienced the site over the last 28 days. The lab score underneath is useful for debugging, but Google ranks on field data. The three Core Web Vitals to watch, with their "good" thresholds:

- **LCP** (Largest Contentful Paint), when the main content appears: 2.5 s or less
- **INP** (Interaction to Next Paint), how quickly the page responds to taps and clicks: 200 ms or less
- **CLS** (Cumulative Layout Shift), how much things jump around while loading: 0.1 or less

Write the numbers down for the home page and two or three key templates, such as a product, a service page and a blog post. You'll want the "before" later.

## 2. Fix the server first

No front-end trick makes up for a slow server. If the **Time to First Byte** is above roughly 600 ms on a cached page, start here.

- Run a current, supported PHP version. Each major PHP 8 release has been noticeably faster than PHP 7.
- Make sure **OPcache** is on. Most decent hosts enable it by default.
- Use **page caching**, at the server level (Nginx, LiteSpeed) if your host offers it, or a well-known caching plugin. Exclude cart, checkout and account pages on WooCommerce.
- For dynamic sites (stores, memberships, LMS), add a persistent **object cache** such as Redis, so repeated database queries are served from memory.
- Put a CDN in front of the site. Cloudflare's free plan is enough for most business sites.

## 3. Images: the biggest, easiest win

On most sites I audit, the LCP element is an image, usually the hero.

- Serve **WebP or AVIF**, resized to the size they're displayed at. Never upload a 4000 px photo to show it at 1200 px.
- Let WordPress output `srcset` (it does by default when you use the media library), so phones download smaller files.
- **Lazy-load images below the fold, but never the LCP image.** WordPress marks the likely LCP image with `fetchpriority="high"` and skips lazy-loading for it, but page builders and sliders often defeat that. Check the hero in DevTools.
- Always set `width` and `height` (or an `aspect-ratio`) so the browser reserves the space. This alone fixes most CLS problems.

## 4. Tame the page builder

Elementor and other builders are fine for client sites. They just need some discipline:

- Use **Flexbox Containers** instead of the old section → column → widget structure. They produce far less HTML.
- Turn on the builder's performance features. In Elementor these include optimised asset loading, lazy-loaded background images and inline font icons. The exact names change between versions.
- Avoid stacking several "addon" plugins that each load their own CSS and JS on every page.
- Don't put a heavy slider or a video background at the top of the page if a single well-compressed image does the job.

## 5. Fonts

- Self-host fonts instead of loading them from a third party. It saves a connection, and in the EU it avoids sending visitor IP addresses elsewhere.
- Load only the weights you actually use, ideally as one variable font.
- Preload the one font used above the fold, and use `font-display: swap`.
- Replace icon fonts with inline SVGs where you can.

## 6. Plugins: audit, don't accumulate

Install **Query Monitor** temporarily and load your slowest pages. It shows which plugins run slow database queries or hooks. Then:

- Remove plugins that aren't used, and plugins that duplicate each other.
- Look for plugins that load assets **site-wide** when they're only needed on one page. Contact form plugins are the classic example. Dequeue their scripts on pages without a form.
- Replace "do everything" plugins with small, focused ones, or a few lines in a child theme.

## 7. Third-party scripts

Chat widgets, heatmaps, multiple analytics tags and embedded social feeds are often the main reason INP is poor. For each one, ask whether someone actually uses the data. Load what remains after the page is interactive, or after the visitor's first interaction, and make sure consent rules are respected.

## 8. Database housekeeping

Older sites collect clutter that slows every request:

- **Autoloaded options:** check the size of autoloaded data in `wp_options`. Old plugins often leave large autoloaded rows behind. Recent WordPress versions warn about this in Site Health.
- Expired **transients**, spam comments and thousands of **post revisions**. Limit revisions with `define('WP_POST_REVISIONS', 10);` in `wp-config.php`.
- On WooCommerce, make sure **HPOS** (High-Performance Order Storage) is enabled on stores with many orders.

## 9. Measure again, and keep watching

Re-run PageSpeed Insights on the same pages and compare with your "before" numbers. Remember that field data takes up to 28 days to fully reflect a change. Then set up monitoring, for example the Core Web Vitals report in Search Console, so you notice when a new plugin or a marketing script makes things slow again.

> In my experience, hosting, caching and images fix most of the problem on a typical business site. The page builder and plugin work fixes most of what's left. Start at the top of the list.
