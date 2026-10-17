import { useEffect, useState, type ReactNode } from "react";
import { contactEmail, EMAIL_PLACEHOLDER } from "@/lib/email";

/**
 * A mailto link whose address is only built after the page loads in a real browser.
 * `children` replaces the visible text; `showAddress` renders the address itself.
 */
export function EmailLink({
  children,
  showAddress = false,
  query = "",
  ...rest
}: {
  children?: ReactNode;
  showAddress?: boolean;
  /** e.g. "?subject=Hello" */
  query?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => setEmail(contactEmail()), []);

  return (
    <a href={email ? `mailto:${email}${query}` : "#contact"} {...rest}>
      {showAddress ? (email ?? EMAIL_PLACEHOLDER) : children}
    </a>
  );
}

/** The address as text, assembled after the page loads. */
export function EmailAddress() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => setEmail(contactEmail()), []);
  return <>{email ?? EMAIL_PLACEHOLDER}</>;
}
