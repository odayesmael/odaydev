const logos = [
  "JAVASCRIPT",
  "REACT",
  "PHP",
  "HTML5",
  "CSS3",
  "TAILWIND",
  "WORDPRESS",
  "WOOCOMMERCE",
  "MYSQL",
  "REST API",
  "NODE.JS",
  "cPANEL",
  "WHMCS",
];

const logos2 = [
  "CLAUDE",
  "CURSOR",
  "GITHUB COPILOT",
  "LOVABLE",
  "ANTIGRAVITY",
  "v0",
  "WINDSURF",
  "CHATGPT",
  "GEMINI",
  "BOLT",
];

export function LogoMarquee() {
  const row1 = [...logos, ...logos];
  const row2 = [...logos2, ...logos2];
  return (
    <section className="marquee-section">
      <div className="marquee-label">[ 9 YEARS · FULL-STACK · AI-ASSISTED WORKFLOW · NETHERLANDS ]</div>
      <div className="marquee">
        <div className="marquee-track">
          {row1.map((l, i) => (
            <div className="marquee-item" key={`a-${i}`}>
              <span className="marquee-dot" />
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="marquee marquee-reverse">
        <div className="marquee-track">
          {row2.map((l, i) => (
            <div className="marquee-item marquee-item-outline" key={`b-${i}`}>
              <span>{l}</span>
              <span className="marquee-slash">/</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
