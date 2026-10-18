#!/usr/bin/env python3
"""
Social images (1200x630 JPEG) for every page and language:
  public/og/<locale>/{home,portfolio,blog,work-<slug>,blog-<slug>}.jpg

Text is shaped with HarfBuzz (correct Arabic joining + bidi for titles) using
the same self-hosted fonts as the site, then converted to SVG paths, so the
renderer needs no fonts at all.

Setup (once):
  pip install uharfbuzz fonttools brotli pillow
  npm i --no-save @resvg/resvg-js
Run:
  npx tsx scripts/og/dump.ts > /tmp/og.json
  python3 scripts/og/generate.py /tmp/og.json
"""
import base64, io, json, os, re, subprocess, sys, tempfile
from functools import lru_cache

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FS = os.path.join(ROOT, "node_modules", "@fontsource-variable")
G, W, BG, MUTED = "#4ADE80", "#F0F0F0", "#050F05", "#9aa39b"
WIDTH, HEIGHT, M = 1200, 630, 72

FONTS = {
    "arch": ["archivo/files/archivo-latin-wdth-normal.woff2", "archivo/files/archivo-latin-ext-wdth-normal.woff2"],
    "mono": ["jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "jetbrains-mono/files/jetbrains-mono-latin-ext-wght-normal.woff2"],
    "alex": [
        "alexandria/files/alexandria-arabic-wght-normal.woff2",
        "alexandria/files/alexandria-latin-wght-normal.woff2",
        "alexandria/files/alexandria-latin-ext-wght-normal.woff2",
    ],
}
ARABIC = re.compile(r"[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]")


@lru_cache(None)
def load(path):
    """woff2 -> (hb.Face, cmap, upm, axes)"""
    f = TTFont(os.path.join(FS, path))
    f.flavor = None
    buf = io.BytesIO()
    f.save(buf)
    face = hb.Face(hb.Blob(buf.getvalue()))
    axes = {a.axisTag for a in f["fvar"].axes} if "fvar" in f else set()
    return face, set(f.getBestCmap().keys()), f["head"].unitsPerEm, axes


def family_for(kind, rtl):
    if rtl:
        return "alex"
    return "mono" if kind == "mono" else "arch"


def pick_font(fam, ch):
    for p in FONTS[fam]:
        if ord(ch) in load(p)[1]:
            return p
    return FONTS[fam][0]


def segments(text, fam):
    """Split a same-direction run into pieces covered by one font file."""
    out, cur, cur_font = [], "", None
    for ch in text:
        f = pick_font(fam, ch) if not ch.isspace() else (cur_font or pick_font(fam, ch))
        if cur and f != cur_font:
            out.append((cur, cur_font))
            cur = ""
        cur += ch
        cur_font = f
    if cur:
        out.append((cur, cur_font))
    return out


def shape_run(text, fam, size, wght, wdth, tracking, rtl):
    """Shape one direction run. Returns (svg path d, advance in px) in visual order."""
    pieces = segments(text, fam)
    if rtl:
        pieces = pieces[::-1]
    d_all, x = [], 0.0
    for chunk, path in pieces:
        face, _, upm, axes = load(path)
        font = hb.Font(face)
        var = {}
        if "wght" in axes:
            var["wght"] = wght
        if "wdth" in axes:
            var["wdth"] = wdth
        if var:
            font.set_variations(var)
        buf = hb.Buffer()
        buf.add_str(chunk)
        buf.guess_segment_properties()
        if rtl:
            buf.direction = "rtl"
        hb.shape(font, buf, {"kern": True, "liga": True})
        s = size / upm
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            pen = SVGPathPen(None)
            tp = TransformPen(pen, (s, 0, 0, -s, x + pos.x_offset * s, -pos.y_offset * s))
            font.draw_glyph_with_pen(info.codepoint, tp)
            cmd = pen.getCommands()
            if cmd:
                d_all.append(cmd)
            x += pos.x_advance * s + tracking * size
    if tracking:
        x -= tracking * size
    return " ".join(d_all), x


LATIN_RUN = re.compile(r"[A-Za-z0-9][A-Za-z0-9 .,:;'\"=/+&#@%()\-–—·]*[A-Za-z0-9\"')]|[A-Za-z0-9]")


def shape(text, kind="display", size=40, wght=800, wdth=125, tracking=0.0, rtl=False):
    """Shape a line; for RTL text, Latin words are laid out left-to-right inside it."""
    text = text.replace("⁦", "").replace("⁩", "")
    fam = family_for(kind, rtl)
    if rtl:
        tracking = 0.0
    if not rtl or not ARABIC.search(text):
        return shape_run(text, fam, size, wght, wdth, tracking, False)
    runs, last = [], 0
    for m in LATIN_RUN.finditer(text):
        if m.start() > last:
            runs.append((text[last:m.start()], True))
        runs.append((m.group(0), False))
        last = m.end()
    if last < len(text):
        runs.append((text[last:], True))
    d_all, x = [], 0.0
    for chunk, is_rtl in reversed(runs):  # paragraph is RTL: last logical run is leftmost
        d, w = shape_run(chunk, fam, size, wght, wdth, tracking, is_rtl)
        if d:
            d_all.append(f'<path transform="translate({x:.2f},0)" d="{d}"/>')
        x += w
    return "".join(d_all), x


def text_el(text, x, y, fill, rtl=False, anchor="start", op=1.0, **kw):
    d, w = shape(text, rtl=rtl, **kw)
    # in RTL, "start" means the right edge
    if (anchor == "start" and rtl) or (anchor == "end" and not rtl):
        x = x - w
    body = d if d.startswith("<path") else f'<path d="{d}"/>'
    return f'<g transform="translate({x:.2f},{y:.2f})" fill="{fill}" fill-opacity="{op}">{body}</g>', w


def wrap(text, max_w, rtl=False, **kw):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        trial = (cur + " " + wd).strip()
        if cur and shape(trial, rtl=rtl, **kw)[1] > max_w:
            lines.append(cur)
            cur = wd
        else:
            cur = trial
    if cur:
        lines.append(cur)
    return lines


def fit(text, max_w, max_lines, start, minimum, rtl=False, **kw):
    size = start
    while size > minimum:
        lines = wrap(text, max_w, rtl=rtl, size=size, **kw)
        if len(lines) <= max_lines:
            return size, lines
        size -= 2
    return size, wrap(text, max_w, rtl=rtl, size=size, **kw)[:max_lines]


DEFS = f'''<defs>
<radialGradient id="g1" cx="85%" cy="15%" r="70%"><stop offset="0" stop-color="{G}" stop-opacity="0.26"/><stop offset="1" stop-color="{G}" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="0%" cy="100%" r="60%"><stop offset="0" stop-color="#22C55E" stop-opacity="0.16"/><stop offset="1" stop-color="#22C55E" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="{G}" stroke-opacity="0.06"/></pattern>
</defs>'''
MARK = (f'<path d="M34.04 80.02 A34 34 0 0 1 34.04 19.98" fill="none" stroke="{W}" stroke-width="12" stroke-linecap="round"/>'
        f'<path d="M50 16 A34 34 0 0 1 50 84" fill="none" stroke="{W}" stroke-width="12"/>'
        f'<rect x="44" y="10" width="12" height="80" rx="2" fill="{G}"/>')


def frame_svg():
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{WIDTH}" height="{HEIGHT}">{DEFS}'
            f'<rect width="{WIDTH}" height="{HEIGHT}" fill="{BG}"/><rect width="{WIDTH}" height="{HEIGHT}" fill="url(#grid)"/>'
            f'<rect width="{WIDTH}" height="{HEIGHT}" fill="url(#g1)"/><rect width="{WIDTH}" height="{HEIGHT}" fill="url(#g2)"/>')


def brand(rtl):
    # The logo and domain are Latin and keep their own direction; they swap sides in RTL.
    word, ww = text_el("oday", 0, 0, W, size=32, wght=800, wdth=125)
    mark_x = WIDTH - M - 64 - ww - 12 if rtl else M
    out = f'<g transform="translate({mark_x},50) scale(.52)">{MARK}</g>'
    out += f'<g transform="translate({mark_x + 62},88)">{word}</g>'
    out += f'<circle cx="{mark_x + 62 + ww + 8}" cy="85" r="4.5" fill="{G}"/>'
    dom, _ = text_el("ODAY.DEV", M if rtl else WIDTH - M, 82, G, anchor="start" if rtl else "end",
                     kind="mono", size=17, wght=500, wdth=100, tracking=0.18)
    return out + dom


def eyebrow(label, y, rtl, x_edge=None):
    x = x_edge if x_edge is not None else (WIDTH - M if rtl else M)
    dot_x = x - 6 if rtl else x + 6
    t, _ = text_el(f"[ {label} ]", x - 22 if rtl else x + 22, y + 7, G, rtl=rtl,
                   kind="mono", size=18, wght=500, wdth=100, tracking=0.16)
    return f'<circle cx="{dot_x}" cy="{y}" r="6" fill="{G}"/>' + t


def shot(slug, x, y, w, rot):
    im = Image.open(os.path.join(ROOT, "public", "work", f"{slug}-desktop.webp")).convert("RGB")
    im = im.resize((720, int(720 * im.height / im.width)))
    im = im.crop((0, 0, 720, 450))
    b = io.BytesIO()
    im.save(b, "JPEG", quality=82)
    data = base64.b64encode(b.getvalue()).decode()
    h = w * 0.625
    return f'''<g transform="translate({x},{y}) rotate({rot})">
<rect x="-1" y="-1" width="{w + 2}" height="{h + 32}" rx="14" fill="#ffffff" fill-opacity=".08"/>
<rect width="{w}" height="{h + 30}" rx="13" fill="#141815"/>
<circle cx="18" cy="15" r="5" fill="#ff5f57"/><circle cx="34" cy="15" r="5" fill="#febc2e"/><circle cx="50" cy="15" r="5" fill="#28c840"/>
<clipPath id="c-{slug}"><rect y="30" width="{w}" height="{h}"/></clipPath>
<image clip-path="url(#c-{slug})" x="0" y="30" width="{w}" height="{h}" href="data:image/jpeg;base64,{data}" preserveAspectRatio="xMidYMin slice"/></g>'''


def foot(text, rtl):
    t, _ = text_el(text, WIDTH - M if rtl else M, 578, W, rtl=rtl, op=0.6,
                   kind="body", size=20, wght=400, wdth=100)
    return f'<line x1="{M}" y1="530" x2="{WIDTH - M}" y2="530" stroke="{G}" stroke-opacity="0.25"/>' + t


def page_hero(eb, l1, l2, footer, rtl):
    x = WIDTH - M if rtl else M
    s = frame_svg() + brand(rtl) + eyebrow(eb, 240, rtl)
    size1, lines1 = fit(l1, WIDTH - 2 * M, 1, 72, 40, rtl=rtl, wght=800, wdth=125)
    size2, lines2 = fit(l2, WIDTH - 2 * M, 1, 72, 40, rtl=rtl, wght=500, wdth=125)
    size = min(size1, size2)
    s += text_el(lines1[0], x, 352, W, rtl=rtl, size=size, wght=800, wdth=125, tracking=-0.01)[0]
    s += text_el(lines2[0], x, 352 + size * 1.25, G, rtl=rtl, size=size, wght=500, wdth=125, tracking=-0.01)[0]
    return s + foot(footer, rtl) + "</svg>"


def case(cs, eb, rtl):
    col = 520
    x = WIDTH - M if rtl else M
    s = frame_svg() + brand(rtl)
    s += shot(cs["slug"], 70 if rtl else 640, 150 if rtl else 172, 520, 3 if rtl else -3)
    s += eyebrow(eb, 232, rtl)
    nsize, _ = fit(cs["name"], col, 1, 64, 34, wght=800, wdth=125)
    # brand names are Latin: left-aligned in LTR, right-aligned in RTL
    s += text_el(cs["name"], x, 320, W, anchor="end" if rtl else "start",
                 size=nsize, wght=800, wdth=125, tracking=-0.02)[0]
    tsize, lines = fit(cs["tagline"], col, 3, 34, 24, rtl=rtl, wght=500, wdth=112)
    for i, ln in enumerate(lines):
        s += text_el(ln, x, 384 + i * tsize * 1.35, G, rtl=rtl, size=tsize, wght=500, wdth=112)[0]
    dom, _ = text_el(cs["domain"], x, 578, W, op=0.55, anchor="end" if rtl else "start",
                     kind="mono", size=18, wght=500, wdth=100, tracking=0.06)
    return s + dom + "</svg>"


def post(p, eb, rtl):
    x = WIDTH - M if rtl else M
    s = frame_svg() + brand(rtl) + eyebrow(eb, 200, rtl)
    size, lines = fit(p["title"], WIDTH - 2 * M, 4, 62, 34, rtl=rtl, wght=800, wdth=118)
    lh = size * (1.32 if rtl else 1.12)
    for i, ln in enumerate(lines):
        s += text_el(ln, x, 290 + i * lh, W, rtl=rtl, size=size, wght=800, wdth=118, tracking=-0.01)[0]
    # tags (Latin) + reading time
    cx = M
    chips = ""
    for tag in p["tags"][:4]:
        t, w = text_el(tag, 0, 0, G, kind="mono", size=16, wght=500, wdth=100, tracking=0.04)
        bw = w + 32
        bx = WIDTH - cx - bw if rtl else cx
        chips += f'<rect x="{bx}" y="552" width="{bw}" height="38" rx="19" fill="{G}" fill-opacity="0.08" stroke="{G}" stroke-opacity="0.35"/>'
        chips += f'<g transform="translate({bx + 16},577)">{t}</g>'
        cx += bw + 10
    # reading time sits on the opposite side from the tags
    if rtl:  # in RTL "end" is the left edge
        mins, _ = text_el(p["minutes"], M, 578, W, rtl=True, anchor="end", op=0.6, kind="mono", size=17, wght=500, wdth=100)
    else:
        mins, _ = text_el(p["minutes"], WIDTH - M, 578, W, anchor="end", kind="mono", size=17, wght=500, wdth=100)
    return s + chips + mins + "</svg>"


def main():
    data = json.load(open(sys.argv[1]))
    out_root = os.path.join(ROOT, "public", "og")
    jobs = []
    for loc in data:
        l, rtl = loc["locale"], loc["locale"] == "ar"
        jobs.append((l, "home", page_hero(loc["home"]["eyebrow"], loc["home"]["line1"], loc["home"]["line2"], loc["home"]["foot"], rtl)))
        pf = loc["portfolio"]
        jobs.append((l, "portfolio", page_hero(pf["eyebrow"], pf["title"][0], pf["title"][1], "oday.dev/portfolio", rtl)))
        bl = loc["blog"]
        jobs.append((l, "blog", page_hero(bl["eyebrow"], bl["title"][0], bl["title"][1], "oday.dev/blog", rtl)))
        for cs in loc["cases"]:
            jobs.append((l, f"work-{cs['slug']}", case(cs, loc["caseEyebrow"], rtl)))
        for p in loc["posts"]:
            jobs.append((l, f"blog-{p['slug']}", post(p, bl["eyebrow"], rtl)))

    with tempfile.TemporaryDirectory() as tmp:
        pairs = []
        for l, key, svg in jobs:
            src = os.path.join(tmp, f"{l}-{key}.svg")
            open(src, "w").write(svg)
            pairs.append((src, os.path.join(tmp, f"{l}-{key}.png"), l, key))
        listing = os.path.join(tmp, "jobs.json")
        json.dump([[a, b] for a, b, _, _ in pairs], open(listing, "w"))
        subprocess.run(["node", os.path.join(os.path.dirname(__file__), "render.mjs"), listing], check=True, cwd=ROOT)
        for _, png, l, key in pairs:
            os.makedirs(os.path.join(out_root, l), exist_ok=True)
            Image.open(png).convert("RGB").save(os.path.join(out_root, l, f"{key}.jpg"), "JPEG", quality=86, optimize=True, progressive=True)
    print(f"wrote {len(jobs)} images to public/og/")


if __name__ == "__main__":
    main()
