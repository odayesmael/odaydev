import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BottomNav } from "@/components/BottomNav";
import { ContactCTA } from "@/components/ContactCTA";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Starfield } from "@/components/Starfield";
import { SITE_URL } from "@/lib/site";
import { localeFromParam, localePath, messagesFor, useMessages } from "@/i18n";
import { localeLinks, localeMeta, ogImageMeta } from "@/i18n/seo";

const REPO = "https://github.com/odayesmael/app-builder-guide";
const CLONE_CMD = `git clone ${REPO} ~/.claude/skills/mobile-app-playbook`;
const ZIP_URL = `${REPO}/archive/refs/heads/main.zip`;
const PROMPT = "I want to build an app for…";

/** File names are literal paths — only their descriptions are translated. */
const FILES = [
  "SKILL.md",
  "references/strategy.md",
  "references/stack.md",
  "references/backend.md",
  "references/ai-features.md",
  "references/payments.md",
  "references/security.md",
  "references/release-ios.md",
  "references/release-android.md",
  "references/ux-onboarding.md",
  "references/marketing.md",
  "references/working-with-ai.md",
];

export const Route = createFileRoute("/{-$locale}/skill")({
  component: SkillPage,
  head: ({ params }) => {
    const locale = localeFromParam(params.locale);
    const t = messagesFor(locale).skill;
    return {
      meta: [
        { title: t.metaTitle },
        { name: "description", content: t.metaDescription },
        { property: "og:title", content: t.metaTitle },
        { property: "og:description", content: t.metaDescription },
        ...localeMeta(locale, "/skill"),
        ...ogImageMeta(locale, "skill", t.metaTitle),
      ],
      links: [...localeLinks(locale, "/skill")],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: "Mobile App Playbook",
            description: t.metaDescription,
            url: `${SITE_URL}${localePath(locale, "/skill")}`,
            codeRepository: REPO,
            programmingLanguage: "Markdown",
            license: "https://opensource.org/licenses/MIT",
            inLanguage: locale,
            author: { "@id": `${SITE_URL}/#person` },
          }),
        },
      ],
    };
  },
});

/** A copyable one-line command. */
function CodeLine({ code }: { code: string }) {
  const t = useMessages().skill;
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* clipboard blocked — the text stays selectable */
    }
  };

  return (
    <div className="sg-code">
      <code dir="ltr">{code}</code>
      <button type="button" className="sg-copy" onClick={copy}>
        {done ? t.copied : t.copy}
      </button>
    </div>
  );
}

function SkillPage() {
  const t = useMessages().skill;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pf-hero > *", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".sg-block", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="grain-overlay" />
      <div className="dr-page">
        <Starfield />
        <PageHeader />

        <section className="portfolio-section sg-page" ref={ref}>
          <div className="pf-hero">
            <div className="pf-eyebrow">
              <span className="pr-dot" />[ {t.eyebrow} ]
            </div>
            <h1 className="pf-title">
              {t.title[0]} <em>{t.title[1]}</em>
            </h1>
            <p className="pf-sub">{t.sub}</p>
            <div className="sg-hero-actions">
              <a className="as-btn as-btn-primary" href={REPO} target="_blank" rel="noreferrer">
                {t.repoCta} <span aria-hidden>↗</span>
              </a>
              <span className="sg-licence">{t.licence}</span>
            </div>
          </div>

          <p className="sg-intro sg-block">{t.intro}</p>

          {/* What's inside */}
          <div className="sg-block">
            <h2 className="sg-heading">{t.insideHeading}</h2>
            <ul className="sg-inside">
              {t.inside.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Install */}
          <div className="sg-block" id="install">
            <h2 className="sg-heading">{t.installHeading}</h2>
            <p className="sg-note">{t.installSub}</p>

            <ol className="sg-steps">
              {t.steps.map((s, i) => (
                <li className="sg-step" key={s.n}>
                  <span className="sg-step-n">[ {s.n} ]</span>
                  <div className="sg-step-main">
                    <h3 className="sg-step-title">{s.title}</h3>
                    <p className="sg-step-body">{s.body}</p>
                    {i === 0 && <CodeLine code={CLONE_CMD} />}
                    {i === 1 && (
                      <a className="as-btn sg-zip" href={ZIP_URL} target="_blank" rel="noreferrer">
                        main.zip <span aria-hidden>↓</span>
                      </a>
                    )}
                    {i === 2 && <CodeLine code={PROMPT} />}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Structure */}
          <div className="sg-block">
            <h2 className="sg-heading">{t.structureHeading}</h2>
            <p className="sg-note">{t.structureNote}</p>
            <ul className="sg-files">
              {FILES.map((f, i) => (
                <li key={f}>
                  <code dir="ltr">{f}</code>
                  <span>{t.files[i]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ContactCTA />
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
