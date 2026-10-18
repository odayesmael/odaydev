Adding Arabic to a site looks like a one-line change: set `dir="rtl"` and the layout flips. That gets you about 70% of the way in a minute. The remaining 30% is what separates a site that *works* in Arabic from one that feels like it was built for Arabic readers. These are the things I check every time, most recently when I made this portfolio available in Arabic, Dutch and Turkish.

## Set lang and dir on the server, on the html element

Direction belongs on `<html>`, rendered by the server, not toggled by JavaScript after the page loads. If the browser first paints left-to-right and then flips, visitors see the whole page jump, and screen readers may announce the content with the wrong voice.

```html
<html lang="ar" dir="rtl">
```

The `lang` attribute matters as much as `dir`. It tells the browser which font fallbacks and line-breaking rules to use, and it tells assistive technology which pronunciation to use. Each language should also have its own URL (`/ar/…`), so the server always knows which one to render.

## Write CSS in logical properties

Most layout bugs in RTL come from CSS that says *left* and *right* when it means *start* and *end*. Logical properties follow the writing direction automatically:

```css
/* Instead of margin-left / padding-right / left: 0 */
.card {
  margin-inline-start: 24px;
  padding-inline-end: 16px;
  inset-inline-start: 0;
  text-align: start;
  border-start-start-radius: 12px;
}
```

Flexbox and grid already follow the direction, so `flex-direction: row` lays items out right-to-left in Arabic with no extra work. What breaks are the hard-coded `left`, `right`, `margin-left` and `translateX()` values, usually in older components. A quick search for those words in the stylesheet finds most of the problems.

## Decide what should never flip

Not everything should mirror. Some things represent real objects or carry their own direction, and flipping them looks wrong:

- **Device and browser mockups.** A browser window has its controls on the left on every operating system the visitor knows.
- **Logos and wordmarks.** A brand is the same in every language.
- **Code, URLs, email addresses and phone numbers.** These are always left-to-right.
- **Media controls and progress bars for time.** Most RTL design guidelines keep play buttons and video timelines left-to-right.
- **Marquees and carousels of Latin brand names**, where flipping changes nothing useful and can break the animation.

I keep these in one explicit list so the decision is visible in the code:

```css
[dir="rtl"] .device-mockup,
[dir="rtl"] .logo,
[dir="rtl"] .code-sample { direction: ltr; }
```

What *should* flip are arrows that mean "next" or "go": in Arabic, "next" points left. A `→` in a button becomes `←`, and an external-link `↗` becomes `↖`. A `transform: scaleX(-1)` under `[dir="rtl"]` handles text arrows and icons alike.

## Watch for bidirectional text bugs

Arabic pages are full of Latin words: product names, technologies, brand names. The browser's bidirectional algorithm usually places them correctly, but it can surprise you. On this site, the Arabic phrase for "iOS and Android" rendered in the wrong order, because the Arabic word for "and" (و) is written attached to the next word, and attaching it to a Latin word confuses the ordering. The fix was simply a space after و.

For anything inserted from data, such as a client name, a username or a product title, wrap it in `<bdi>` so its direction is isolated from the sentence around it:

```html
<h1><bdi>SoleChem Europe</bdi> — منصة كيميائية مصممة لكسب طلبات الأسعار</h1>
```

Inline `code` in an Arabic article needs the same treatment: `unicode-bidi: isolate` on the element keeps symbols and parentheses in place.

## Give Arabic its own typography

A Latin font with Arabic fallback rarely looks good. Pick a real Arabic typeface that matches the personality of the Latin one. On this site I paired a wide grotesque with Alexandria, which has similar geometric proportions. Then adjust a few rules for Arabic only:

```css
html[lang="ar"] {
  --font-body: "Alexandria Variable", system-ui, sans-serif;
}
/* Tracking breaks the joins between Arabic letters */
html[lang="ar"] * { letter-spacing: 0 !important; }
/* Arabic has no true italics — a synthetic slant looks broken */
html[lang="ar"] em { font-style: normal; }
/* Taller letterforms need more room */
html[lang="ar"] h1, html[lang="ar"] h2 { line-height: 1.3; }
```

Display headings often need to be a little smaller too, because Arabic words are taller and lines wrap differently.

## Choose your digits on purpose

Arabic can be written with Western digits (1, 2, 3) or Eastern Arabic digits (١، ٢، ٣). Both are correct; the right choice depends on the audience. Many business sites in the Gulf use Western digits. Whichever you pick, be consistent. `Intl` formatters follow the locale's default, so pin the numbering system if you need to:

```js
new Intl.DateTimeFormat("ar-u-nu-latn", { dateStyle: "long" }).format(date);
```

## Multilingual SEO, done properly

- Give each language its own URL, like `/ar/portfolio`. Don't switch languages with a cookie on the same URL.
- Add `hreflang` links for every language version, plus `x-default`, on every page. Include them in the sitemap too.
- Translate titles, meta descriptions and structured data, not only the visible text.
- **Don't auto-redirect** by IP address or browser language. Search engines crawl mostly from the US, and people share links expecting them to open as sent. Suggest the other language with a small, dismissible hint instead.

## Test it like a visitor would

Before I ship, I take screenshots of every page in every language at phone and desktop width, and check that nothing overflows horizontally. Long Turkish and Dutch words break layouts as often as RTL does. Then I ask a native speaker to read the copy. Machine-perfect grammar can still sound like a translation, and readers notice.

> The short version: put direction on the server, write logical CSS, keep a list of what never flips, isolate mixed text, give Arabic real typography, and treat each language as its own page.
