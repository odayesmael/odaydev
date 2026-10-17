/**
 * The contact address is assembled in the browser so it never appears as a
 * plain "user@domain" string in the HTML that scrapers download.
 */
const USER = "info";
const DOMAIN = ["oday", "dev"].join(".");

export function contactEmail() {
  return `${USER}@${DOMAIN}`;
}

/** Shown in the server-rendered HTML before the page hydrates. */
export const EMAIL_PLACEHOLDER = `${USER} [at] ${DOMAIN.replace(".", " [dot] ")}`;
