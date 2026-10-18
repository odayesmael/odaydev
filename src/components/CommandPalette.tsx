import { useRouter, useRouterState } from "@tanstack/react-router";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, type ReactNode } from "react";
import { caseStudies } from "@/data/caseStudies";
import { projects } from "@/data/projects";
import { posts, postText } from "@/data/blog";
import { contactEmail } from "@/lib/email";
import { track } from "@/lib/analytics";
import {
  LOCALES,
  LOCALE_META,
  localePath,
  localizeProject,
  stripLocale,
  useLocale,
  useMessages,
} from "@/i18n";

function Row({ icon, children, hint }: { icon: string; children: ReactNode; hint?: string }) {
  return (
    <>
      <span className="cp-icon" aria-hidden>
        {icon}
      </span>
      <span className="cp-text">{children}</span>
      {hint && <span className="cp-hint">{hint}</span>}
    </>
  );
}

/** ⌘K command menu: jump to any page, project, article or language. */
export default function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useMessages();
  const tp = t.palette;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [copied, setCopied] = useState(false);

  const go = (path: string, label: string) => {
    onOpenChange(false);
    track("palette_go", { to: label });
    const [p, hash] = path.split("#");
    const href = localePath(locale, p);
    if (hash && stripLocale(pathname) === p) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    router.navigate({ href: hash ? `${href}#${hash}` : href });
  };

  const external = (url: string, label: string) => {
    onOpenChange(false);
    track("palette_go", { to: label });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const caseSlugs = new Set(["shustyle", ...caseStudies.map((c) => c.slug)]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label={tp.title}
      overlayClassName="cp-overlay"
      contentClassName="cp-dialog"
      loop
    >
      <Dialog.Title className="sr-only">{tp.title}</Dialog.Title>
      <Dialog.Description className="sr-only">{tp.placeholder}</Dialog.Description>
      <div className="cp-search">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <Command.Input placeholder={tp.placeholder} />
        <kbd>esc</kbd>
      </div>
      <Command.List>
        <Command.Empty>{tp.empty}</Command.Empty>

        <Command.Group heading={tp.pages}>
          <Command.Item value="home" keywords={[tp.home]} onSelect={() => go("/", "home")}>
            <Row icon="⌂">{tp.home}</Row>
          </Command.Item>
          <Command.Item
            value="portfolio"
            keywords={[t.common.portfolio, "work", "projects"]}
            onSelect={() => go("/portfolio", "portfolio")}
          >
            <Row icon="▦">{t.common.portfolio}</Row>
          </Command.Item>
          <Command.Item
            value="blog"
            keywords={[t.footer.blog, "articles", "notes"]}
            onSelect={() => go("/blog", "blog")}
          >
            <Row icon="✎">{t.footer.blog}</Row>
          </Command.Item>
          <Command.Item
            value="contact"
            keywords={[t.nav.contact, tp.contact, "email", "hire"]}
            onSelect={() => go("/#contact", "contact")}
          >
            <Row icon="✉">{tp.contact}</Row>
          </Command.Item>
        </Command.Group>

        <Command.Group heading={tp.caseStudies}>
          {projects
            .filter((p) => caseSlugs.has(p.slug))
            .map((p) => {
              const lp = localizeProject(p, locale);
              return (
                <Command.Item
                  key={p.slug}
                  value={`case ${p.title}`}
                  keywords={[lp.categoryLabel, ...p.tags, p.domain]}
                  onSelect={() =>
                    go(p.slug === "shustyle" ? "/work/shustyle" : `/work/${p.slug}`, p.slug)
                  }
                >
                  <Row icon="◆" hint={lp.categoryLabel}>
                    {p.title}
                  </Row>
                </Command.Item>
              );
            })}
        </Command.Group>

        <Command.Group heading={tp.articles}>
          {posts.map((p) => {
            const pt = postText(p, locale);
            return (
              <Command.Item
                key={p.slug}
                value={`article ${pt.title}`}
                keywords={p.tags}
                onSelect={() => go(`/blog/${p.slug}`, `blog-${p.slug}`)}
              >
                <Row icon="¶">
                  <span lang={pt.lang} dir={LOCALE_META[pt.lang].dir}>
                    {pt.title}
                  </span>
                </Row>
              </Command.Item>
            );
          })}
        </Command.Group>

        <Command.Group heading={tp.projects}>
          {projects
            .filter((p) => !caseSlugs.has(p.slug) && !p.offline)
            .map((p) => {
              const lp = localizeProject(p, locale);
              return (
                <Command.Item
                  key={p.slug}
                  value={`project ${p.title}`}
                  keywords={[lp.categoryLabel, ...p.tags, p.domain]}
                  onSelect={() => external(p.url, p.slug)}
                >
                  <Row icon="↗" hint={p.domain}>
                    {p.title}
                  </Row>
                </Command.Item>
              );
            })}
        </Command.Group>

        <Command.Group heading={tp.languages}>
          {LOCALES.filter((l) => l !== locale).map((l) => (
            <Command.Item
              key={l}
              value={`language ${LOCALE_META[l].name}`}
              keywords={[l, LOCALE_META[l].short]}
              onSelect={() => {
                track("palette_go", { to: `lang-${l}` });
                window.location.href = localePath(l, stripLocale(pathname));
              }}
            >
              <Row icon="◐" hint={LOCALE_META[l].short}>
                <span lang={l}>{LOCALE_META[l].name}</span>
              </Row>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={tp.actions}>
          <Command.Item
            value="copy email"
            keywords={["email", "mail", "contact"]}
            onSelect={async () => {
              try {
                await navigator.clipboard.writeText(contactEmail());
                setCopied(true);
                track("palette_go", { to: "copy-email" });
                setTimeout(() => {
                  setCopied(false);
                  onOpenChange(false);
                }, 900);
              } catch {
                window.location.href = `mailto:${contactEmail()}`;
              }
            }}
          >
            <Row icon="@">{copied ? tp.emailCopied : tp.copyEmail}</Row>
          </Command.Item>
          <Command.Item
            value="linkedin"
            onSelect={() => external("https://www.linkedin.com/in/oday-alatbash/", "linkedin")}
          >
            <Row icon="in">LinkedIn</Row>
          </Command.Item>
          <Command.Item
            value="github"
            onSelect={() => external("https://github.com/odayesmael", "github")}
          >
            <Row icon="⌥">GitHub</Row>
          </Command.Item>
        </Command.Group>
      </Command.List>
      <div className="cp-foot" aria-hidden>
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd>
        </span>
        <span>
          <kbd>↵</kbd>
        </span>
        <span className="cp-foot-brand">
          oday<b>.</b>dev
        </span>
      </div>
    </Command.Dialog>
  );
}
