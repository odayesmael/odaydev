import { Link } from "@tanstack/react-router";
import { type Project, projectShots } from "@/data/projects";
import { DeviceMockup } from "./DeviceMockup";

/**
 * One portfolio card, shared by the home grid and /portfolio.
 * The cover is a device mockup built from real screenshots of the site
 * (or the app screens), with a typographic fallback when none exist.
 * Cards link to the live site, or to the internal case study when there is one.
 */
export function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  const shots = projectShots(p);

  const inner = (
    <>
      <div className="pr-cover" aria-hidden>
        {p.kind === "app" && p.screens?.length ? (
          <div className="dm-stage app-stage">
            <div className="dm-glow" />
            {p.screens.slice(0, 2).map((src, i) => (
              <div className={`dm-phone app-phone-${i}`} key={src}>
                <div className="dm-phone-screen">
                  <img src={src} alt="" width={600} height={1298} loading="lazy" decoding="async" />
                </div>
              </div>
            ))}
          </div>
        ) : shots && (shots.desktop || shots.mobile) ? (
          <DeviceMockup desktop={shots.desktop} mobile={shots.mobile} domain={p.domain} />
        ) : (
          <span className="pr-cover-fallback">{p.title}</span>
        )}
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
        {p.offline ? (
          <span className="pr-visit is-offline">Currently offline</span>
        ) : (
          <span className="pr-visit">
            {p.caseStudy ? "Case study" : "Visit"}{" "}
            <span className="pr-arrow">{p.caseStudy ? "→" : "↗"}</span>
          </span>
        )}
      </div>
    </>
  );

  if (p.offline) {
    return (
      <div className="pr-card is-offline" data-num={num}>
        {inner}
      </div>
    );
  }

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
