import { testimonials, type Testimonial } from "@/data/testimonials";
import { useLocale, useMessages } from "@/i18n";

function Quote({ t }: { t: Testimonial }) {
  const locale = useLocale();
  const text = t.translations?.[locale] ?? t.quote;
  const lang = t.translations?.[locale] ? locale : t.lang;
  return (
    <figure className="tm-card">
      <span className="tm-mark" aria-hidden>
        “
      </span>
      <blockquote lang={lang}>
        <p>{text}</p>
      </blockquote>
      <figcaption>
        {t.avatar && <img src={t.avatar} alt="" width={44} height={44} loading="lazy" />}
        <span>
          <strong>{t.name}</strong>
          {(t.role || t.company) && (
            <span className="tm-role">{[t.role, t.company].filter(Boolean).join(" · ")}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Client quotes. Renders nothing until real testimonials are added in
 * src/data/testimonials.ts. Pass `project` to show only quotes about that project.
 */
export function Testimonials({ project }: { project?: string }) {
  const t = useMessages();
  const list = project ? testimonials.filter((q) => q.project === project) : testimonials;
  if (list.length === 0) return null;

  if (project) {
    return (
      <section className="cs-block tm-inline">
        <div className="cs-label cs-in">[ {t.caseStudy.whatClientSays} ]</div>
        <div className="tm-grid cs-in">
          {list.map((q) => (
            <Quote key={q.name + q.quote.slice(0, 12)} t={q} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="tm-section" id="testimonials" aria-labelledby="tm-title">
      <div className="tm-inner">
        <div className="sk-eyebrow">
          <span className="sk-dot" />[ {t.testimonials.eyebrow} ]
        </div>
        <h2 className="sk-title" id="tm-title">
          {t.testimonials.title[0]} <em>{t.testimonials.title[1]}</em>
        </h2>
        <div className="tm-grid">
          {list.map((q) => (
            <Quote key={q.name + q.quote.slice(0, 12)} t={q} />
          ))}
        </div>
      </div>
    </section>
  );
}
