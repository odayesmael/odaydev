import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { posts } from "@/data/blog";
import { useMessages } from "@/i18n";
import { LocaleLink } from "./LocaleLink";
import { PostCard } from "./PostCard";

gsap.registerPlugin(ScrollTrigger);

/** Home-page teaser: the three latest articles. */
export function LatestPosts() {
  const t = useMessages().blog;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".sk-head > *, .bl-card"), {
        y: 28,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="skills-section bl-home" id="writing" ref={ref} aria-labelledby="bl-home-title">
      <div className="skills-inner">
        <div className="sk-head">
          <div className="sk-eyebrow">
            <span className="sk-dot" />[ {t.homeEyebrow} ]
          </div>
          <h2 className="sk-title" id="bl-home-title">
            {t.homeTitle[0]}
            <br />
            <em>{t.homeTitle[1]}</em>
          </h2>
        </div>
        <div className="bl-list bl-list-home">
          {posts.slice(0, 3).map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
        <LocaleLink to="/blog" className="pr-viewall">
          {t.readAll} <span className="pr-arrow">→</span>
        </LocaleLink>
      </div>
    </section>
  );
}
