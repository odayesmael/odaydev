import { useState } from "react";

const EMAIL = "info@oday.dev";
const TYPES = ["Website", "Online store", "Mobile app", "SEO & care", "Full-time role"];

/**
 * A short brief that opens the visitor's mail app with everything pre-filled —
 * no backend or third-party form service needed.
 */
export function ContactBrief() {
  const [type, setType] = useState(TYPES[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const subject = `${type} enquiry${name ? ` — ${name}` : ""}`;
  const body = `Hi Oday,\n\n${message || "I'd like to talk about a project."}\n\n— ${name || ""}`;
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <form
      className="cb-form"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = href;
      }}
    >
      <fieldset className="cb-types">
        <legend>[ WHAT ARE YOU PLANNING? ]</legend>
        {TYPES.map((t) => (
          <label key={t} className={`cb-type ${type === t ? "is-active" : ""}`}>
            <input
              type="radio"
              name="type"
              value={t}
              checked={type === t}
              onChange={() => setType(t)}
            />
            {t}
          </label>
        ))}
      </fieldset>

      <div className="cb-fields">
        <label className="cb-field">
          <span>Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Jane from Acme"
          />
        </label>
        <label className="cb-field cb-field-wide">
          <span>A few lines about it</span>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What you need, rough timeline, links…"
          />
        </label>
      </div>

      <div className="cb-actions">
        <button type="submit" className="as-btn as-btn-primary">
          Write the email <span aria-hidden>↗</span>
        </button>
        <button type="button" className="as-btn" onClick={copy}>
          {copied ? "Copied ✓" : `Copy ${EMAIL}`}
        </button>
      </div>
      <p className="cb-note">Opens your mail app with the brief filled in — nothing is stored.</p>
    </form>
  );
}
