# Social images

`public/og/<locale>/<key>.jpg` — one 1200×630 image per page and language
(home, portfolio, blog, every case study and every article in each language
it's written in). Page heads reference them through `ogImageMeta()` in
`src/i18n/seo.ts`.

Regenerate after changing titles, taglines or adding an article:

```bash
pip install uharfbuzz fonttools brotli pillow   # once
npm i --no-save @resvg/resvg-js                 # once
npx tsx scripts/og/dump.ts > /tmp/og.json
python3 scripts/og/generate.py /tmp/og.json
```

Text is shaped with HarfBuzz from the site's own fonts (Archivo, JetBrains
Mono, Alexandria for Arabic) and turned into vector paths, so Arabic joins
correctly and nothing depends on system fonts.
