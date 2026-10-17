/** A screenshot in a minimal CSS phone frame. */
export function Phone({
  src,
  alt = "",
  className = "",
  loading = "lazy",
}: {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <img src={src} alt={alt} width={600} height={1298} loading={loading} decoding="async" />
      </div>
    </div>
  );
}
