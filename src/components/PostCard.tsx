import { postText, type PostMeta } from "@/data/blog";
import { fmt, LOCALE_META, useLocale, useMessages } from "@/i18n";
import { formatDate } from "@/i18n/seo";
import { LocaleLink } from "./LocaleLink";

/** One article in the blog list / home teaser. */
export function PostCard({ post, index }: { post: PostMeta; index: number }) {
  const locale = useLocale();
  const t = useMessages().blog;
  const text = postText(post, locale);
  return (
    <LocaleLink to="/blog/$slug" slug={post.slug} className="bl-card">
      <span className="bl-card-num">[ {String(index + 1).padStart(2, "0")} ]</span>
      <div className="bl-card-meta">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        <span aria-hidden>·</span>
        <span>{fmt(t.minRead, { n: post.minutes })}</span>
        {!text.translated && (
          <span className="bl-lang" lang="en">
            {LOCALE_META.en.short}
          </span>
        )}
      </div>
      <h2 className="bl-card-title" lang={text.lang} dir={LOCALE_META[text.lang].dir}>
        {text.title}
      </h2>
      <p className="bl-card-desc" lang={text.lang} dir={LOCALE_META[text.lang].dir}>
        {text.description}
      </p>
      <div className="bl-card-foot">
        <ul className="bl-tags">
          {post.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <span className="bl-read">
          {t.read} <span className="pr-arrow">→</span>
        </span>
      </div>
    </LocaleLink>
  );
}
