import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { contactEmail, EMAIL_PLACEHOLDER } from "@/lib/email";
import { fmt, useLocale, useMessages } from "@/i18n";
import { track } from "@/lib/analytics";
import { markUfoDone } from "./UfoPopup";

type Status = "idle" | "sending" | "sent" | "error" | "rate";

/**
 * The contact brief. Sends straight to Oday's inbox through /api/contact;
 * if the endpoint isn't configured or unreachable, it falls back to opening
 * the visitor's mail app with everything pre-filled.
 */
export function ContactBrief() {
  const t = useMessages().contact.brief;
  const locale = useLocale();
  const page = useRouterState({ select: (s) => s.location.pathname });
  const TYPES = t.types;
  const [typeIndex, setTypeIndex] = useState(0);
  const type = TYPES[typeIndex];
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const shownAt = useRef(0);

  useEffect(() => {
    setEmail(contactEmail());
    shownAt.current = Date.now();
  }, []);

  const subject = `${fmt(t.subject, { type })}${name ? ` — ${name}` : ""}`;
  const body = `${t.greeting}\n\n${message || t.fallbackMessage}\n\n— ${name || ""}`;
  const mailto = `mailto:${email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contactEmail()}`;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          email: from,
          message,
          locale,
          page,
          website,
          elapsed: Date.now() - shownAt.current,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        markUfoDone();
        track("contact_sent", { type, locale });
        return;
      }
      if (res.status === 429) return setStatus("rate");
      if (res.status === 503) {
        // Not configured yet — hand over to the mail app instead.
        setStatus("idle");
        track("contact_mailto", { type, locale });
        window.location.href = mailto;
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="cb-form cb-done" role="status">
        <span className="cb-done-icon" aria-hidden>
          ✓
        </span>
        <h3 className="cb-done-title">{t.sentTitle}</h3>
        <p className="cb-done-body">{fmt(t.sentBody, { email: from })}</p>
        <button
          type="button"
          className="as-btn"
          onClick={() => {
            setMessage("");
            setStatus("idle");
            shownAt.current = Date.now();
          }}
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form className="cb-form" onSubmit={submit} noValidate={false}>
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
            required
            maxLength={80}
            placeholder={t.namePlaceholder}
          />
        </label>
        <label className="cb-field">
          <span>{t.email}</span>
          <input
            type="email"
            dir="ltr"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            autoComplete="email"
            required
            maxLength={160}
            placeholder={t.emailPlaceholder}
          />
        </label>
        <label className="cb-field cb-field-wide">
          <span>{t.message}</span>
          <textarea
            rows={4}
            required
            minLength={10}
            maxLength={1500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
          />
        </label>
        {/* Honeypot: hidden from people and screen readers, irresistible to bots */}
        <label className="cb-hp" aria-hidden="true">
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {(status === "error" || status === "rate") && (
        <p className="cb-error" role="alert">
          {status === "rate" ? t.errorRate : t.error}{" "}
          <a href={mailto}>{t.fallbackLink}</a>
        </p>
      )}

      <div className="cb-actions">
        <button type="submit" className="as-btn as-btn-primary" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit} <span aria-hidden>↗</span>
        </button>
        <button type="button" className="as-btn" onClick={copy}>
          {copied ? t.copied : `${t.copy} ${email ?? EMAIL_PLACEHOLDER}`}
        </button>
      </div>
      <p className="cb-note">{t.note}</p>
    </form>
  );
}
