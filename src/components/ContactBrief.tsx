import { useEffect, useState } from "react";
import { contactEmail, EMAIL_PLACEHOLDER } from "@/lib/email";
import { fmt, useMessages } from "@/i18n";

/**
 * A short brief that opens the visitor's mail app with everything pre-filled —
 * no backend or third-party form service needed.
 */
export function ContactBrief() {
  const t = useMessages().contact.brief;
  const TYPES = t.types;
  const [typeIndex, setTypeIndex] = useState(0);
  const type = TYPES[typeIndex];
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => setEmail(contactEmail()), []);

  const subject = `${fmt(t.subject, { type })}${name ? ` — ${name}` : ""}`;
  const body = `${t.greeting}\n\n${message || t.fallbackMessage}\n\n— ${name || ""}`;
  const href = `mailto:${email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contactEmail()}`;
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
        <legend>[ {t.legend} ]</legend>
        {TYPES.map((label, i) => (
          <label key={label} className={`cb-type ${typeIndex === i ? "is-active" : ""}`}>
            <input
              type="radio"
              name="type"
              value={label}
              checked={typeIndex === i}
              onChange={() => setTypeIndex(i)}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="cb-fields">
        <label className="cb-field">
          <span>{t.name}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={80}
            placeholder={t.namePlaceholder}
          />
        </label>
        <label className="cb-field cb-field-wide">
          <span>{t.message}</span>
          <textarea
            rows={3}
            maxLength={1500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
          />
        </label>
      </div>

      <div className="cb-actions">
        <button type="submit" className="as-btn as-btn-primary">
          {t.submit} <span aria-hidden>↗</span>
        </button>
        <button type="button" className="as-btn" onClick={copy}>
          {copied ? t.copied : `${t.copy} ${email ?? EMAIL_PLACEHOLDER}`}
        </button>
      </div>
      <p className="cb-note">{t.note}</p>
    </form>
  );
}
