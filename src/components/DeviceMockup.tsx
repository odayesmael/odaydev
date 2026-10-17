/**
 * A staged device mockup: the desktop screenshot in a browser window with the
 * mobile screenshot in a phone overlapping its corner.
 */
export function DeviceMockup({
  desktop,
  mobile,
  domain,
  eager = false,
}: {
  desktop?: string;
  mobile?: string;
  domain: string;
  eager?: boolean;
}) {
  const loading = eager ? "eager" : "lazy";
  return (
    <div
      className={`dm-stage ${mobile ? "has-phone" : ""} ${desktop ? "" : "phone-only"}`}
      aria-hidden
    >
      <div className="dm-glow" />
      {desktop && (
        <div className="dm-browser">
          <div className="dm-bar">
            <span className="dm-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="dm-url">{domain}</span>
          </div>
          <div className="dm-viewport">
            <img
              src={desktop}
              alt=""
              width={1440}
              height={900}
              loading={loading}
              decoding="async"
            />
          </div>
        </div>
      )}
      {mobile && (
        <div className="dm-phone">
          <div className="dm-phone-screen">
            <img src={mobile} alt="" width={390} height={844} loading={loading} decoding="async" />
          </div>
        </div>
      )}
    </div>
  );
}
