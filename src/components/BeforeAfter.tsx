import { useState } from "react";

/**
 * Drag-to-compare slider. The "before" image is clipped from the right as the
 * handle moves; keyboard and screen readers drive the underlying range input.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  label,
  width = 1440,
  height = 900,
  className = "",
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  label: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div
      className={`cs-compare ${className}`}
      style={{ ["--pos" as string]: `${pos}%`, aspectRatio: `${width} / ${height}` }}
    >
      <img src={after} alt={afterLabel} loading="lazy" width={width} height={height} />
      <div className="cs-compare-before">
        <img src={before} alt={beforeLabel} loading="lazy" width={width} height={height} />
      </div>
      <span className="cs-compare-tag cs-compare-tag-l">{beforeLabel}</span>
      <span className="cs-compare-tag cs-compare-tag-r">{afterLabel}</span>
      <span className="cs-compare-handle" aria-hidden />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}
