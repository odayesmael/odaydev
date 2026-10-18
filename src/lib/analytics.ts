import { track as vercelTrack } from "@vercel/analytics";

/**
 * Cookieless, privacy-friendly event tracking (Vercel Web Analytics).
 * No personal data — only the event name and a couple of plain labels.
 * Never throws: analytics must not break the page.
 */
export function track(name: string, props?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(name, props);
  } catch {
    /* ignore */
  }
}
