/**
 * Cinematic video showcase — rounded frame with green stage glow above & below.
 * Embeds a YouTube video via iframe at 75% of the section width.
 */
export function VideoShowcase() {
  // youtu.be / watch?v=  → embed URL with autoplay, mute, loop
  const videoId = "nLM1OU9ru3U";
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`;

  return (
    <section className="video-showcase">
      <div className="vs-eyebrow">[ IN MOTION ]</div>
      <h2 className="vs-title">
        Built for the <span className="vs-accent">edge</span> of complexity.
      </h2>

      <div className="vs-stage">
        <div className="vs-glow vs-glow-top" aria-hidden />
        <div className="vs-frame">
          <iframe
            className="vs-video"
            src={src}
            title="Showcase video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
          <div className="vs-frame-grain" aria-hidden />
        </div>
        <div className="vs-glow vs-glow-bottom" aria-hidden />
      </div>
    </section>
  );
}
