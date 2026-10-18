import { Fragment, type ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for the blog — no HTML passthrough,
 * so article files can never inject markup or scripts. Supports:
 *   ## / ### headings, paragraphs, - and 1. lists, > callouts,
 *   ```fenced code```, **bold**, *italic*, `code` and [links](https://…).
 */

export type Heading = { id: string; text: string; level: 2 | 3 };

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[`*_[\]()]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Block =
  | { t: "h"; level: 2 | 3; text: string; id: string }
  | { t: "p"; text: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "quote"; text: string }
  | { t: "code"; lang: string; code: string };

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      out.push({ t: "code", lang: fence[1], code: code.join("\n") });
      continue;
    }
    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      const text = h[2].trim();
      out.push({ t: "h", level: h[1].length as 2 | 3, text, id: slugify(text) });
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push({ t: "quote", text: buf.join(" ") });
      continue;
    }
    if (/^(-|\*)\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const re = ordered ? /^\d+\.\s+/ : /^(-|\*)\s+/;
      const items: string[] = [];
      while (i < lines.length && (re.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        if (re.test(lines[i])) items.push(lines[i].replace(re, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,3}\s|```|>|(-|\*)\s|\d+\.\s)/.test(lines[i])
    ) {
      buf.push(lines[i++].trim());
    }
    out.push({ t: "p", text: buf.join(" ") });
  }
  return out;
}

/** Inline formatting → React nodes (text is always escaped by React). */
function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) nodes.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**")) nodes.push(<strong key={k++}>{inline(tok.slice(2, -2))}</strong>);
    else if (tok.startsWith("*")) nodes.push(<em key={k++}>{inline(tok.slice(1, -1))}</em>);
    else {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)!;
      const href = lm[2];
      const safe = /^(https?:\/\/|\/|#|mailto:)/.test(href) ? href : "#";
      const external = /^https?:\/\//.test(safe);
      nodes.push(
        <a
          key={k++}
          href={safe}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inline(lm[1])}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Split "---\nkey: value\n---\nbody" front matter off an article file. */
export function stripFrontMatter(md: string) {
  const m = md.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? md.slice(m[0].length) : md;
}

export function headingsOf(md: string): Heading[] {
  return parse(stripFrontMatter(md))
    .filter((b): b is Extract<Block, { t: "h" }> => b.t === "h")
    .map((b) => ({ id: b.id, text: b.text, level: b.level }));
}

export function Markdown({ source }: { source: string }) {
  const blocks = parse(stripFrontMatter(source));
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h":
            return b.level === 2 ? (
              <h2 key={i} id={b.id}>
                {inline(b.text)}
              </h2>
            ) : (
              <h3 key={i} id={b.id}>
                {inline(b.text)}
              </h3>
            );
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <aside key={i} className="bl-callout">
                {inline(b.text)}
              </aside>
            );
          case "code":
            return (
              <pre key={i} dir="ltr" data-lang={b.lang || undefined}>
                <code>{b.code}</code>
              </pre>
            );
          default:
            return <Fragment key={i} />;
        }
      })}
    </>
  );
}
