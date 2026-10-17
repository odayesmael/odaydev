import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { type Project, projectCover } from "@/data/projects";

/**
 * One portfolio card, shared by the home grid and /portfolio.
 * Shows a cover (own image or a live screenshot) and links either to the
 * live site or, for projects with a case study, to the internal page.
 */
export function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const [imgState, setImgState] = useState<"loading" | "ready" | "error">("loading");
  const num = String(index + 1).padStart(2, "0");
  const isApp = p.kind === "app";
  const imgRef = useRef<HTMLImageElement>(null);

  const judge = (img: HTMLImageElement) => {
    // The screenshot service returns a small "generating" placeholder on a
    // first request — treat that like a miss and show the typographic cover.
    const w = img.naturalWidth;
    setImgState(w === 0 || (w < 500 && !p.image) ? "error" : "ready");
  };

  // An image can finish loading before React hydrates and attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) judge(img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inner = (
    <>
      <div className={`pr-cover ${isApp ? "is-app" : ""} is-${imgState}`} aria-hidden>
        {imgState !== "error" && (
          <img
            src={projectCover(p)}
            alt=""
            loading="lazy"
            decoding="async"
            width={1200}
            height={750}
            ref={imgRef}
            onLoad={(e) => judge(e.currentTarget)}
            onError={() => setImgState("error")}
          />
        )}
        <span className="pr-cover-fallback">{p.title}</span>
      </div>

      <div className="pr-card-top">
        <span className="pr-num">[ {num} ]</span>
        <span className="pr-cat">{p.category}</span>
      </div>

      <div className="pr-card-body">
        <h3 className="pr-name">{p.title}</h3>
        <p className="pr-desc">{p.body}</p>
      </div>

      <ul className="pr-tags">
        {p.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div className="pr-card-foot">
        <span className="pr-domain">{p.domain}</span>
        <span className="pr-visit">
          {p.caseStudy ? "Case study" : "Visit"}{" "}
          <span className="pr-arrow">{p.caseStudy ? "→" : "↗"}</span>
        </span>
      </div>
    </>
  );

  if (p.caseStudy) {
    return (
      <Link className="pr-card" data-num={num} to={p.caseStudy}>
        {inner}
      </Link>
    );
  }

  return (
    <a className="pr-card" data-num={num} href={p.url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}
