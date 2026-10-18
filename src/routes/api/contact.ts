import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * POST /api/contact — delivers the contact brief by email through Resend.
 *
 * Environment (set in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  required. Without it the endpoint answers 503 and the form
 *                   falls back to opening the visitor's mail app.
 *   CONTACT_TO      inbox that receives the briefs (default: info@oday.dev)
 *   CONTACT_FROM    verified sender, e.g. "oday.dev <hello@oday.dev>"
 *                   (default: Resend's shared test sender)
 *
 * Spam protection: a hidden honeypot field, a minimum fill time, strict
 * validation and a small per-IP rate limit. Bots get a fake success.
 */

const Brief = z.object({
  type: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(1500),
  locale: z.enum(["en", "ar", "nl", "tr"]).default("en"),
  page: z.string().max(200).optional(),
  // anti-spam
  website: z.string().max(200).optional(), // honeypot — humans never see it
  elapsed: z.number().int().nonnegative().optional(), // ms between render and submit
});

const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded on long-lived instances
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/** Strip CR/LF so nothing a visitor types can end up as an extra mail header. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export const Route = createFileRoute("/api/contact")({
  // `server` handlers come from TanStack Start; its types live on a nested
  // router-core copy, so the option is cast here (runtime is unaffected).
  ...({
    server: {
      handlers: {
        POST: async ({ request }: { request: Request }) => {
          const origin = request.headers.get("origin");
          const host = request.headers.get("host");
          if (origin && host) {
            let originHost = "";
            try {
              originHost = new URL(origin).host;
            } catch {
              /* "null" or malformed origin */
            }
            if (originHost !== host) return json({ ok: false, error: "origin" }, 403);
          }

          let data: z.infer<typeof Brief>;
          try {
            const parsed = Brief.safeParse(await request.json());
            if (!parsed.success) {
              return json(
                {
                  ok: false,
                  error: "invalid",
                  fields: Object.keys(parsed.error.flatten().fieldErrors),
                },
                400,
              );
            }
            data = parsed.data;
          } catch {
            return json({ ok: false, error: "invalid" }, 400);
          }

          // Bots: pretend it worked so they don't adapt.
          if (data.website || (data.elapsed !== undefined && data.elapsed < MIN_FILL_MS)) {
            return json({ ok: true });
          }

          const ip =
            request.headers.get("x-real-ip") ??
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            "unknown";
          if (rateLimited(ip)) return json({ ok: false, error: "rate" }, 429);

          const key = process.env.RESEND_API_KEY;
          if (!key) return json({ ok: false, error: "unconfigured" }, 503);

          const to = process.env.CONTACT_TO || ["info", "oday.dev"].join("@");
          const from = process.env.CONTACT_FROM || "oday.dev <onboarding@resend.dev>";
          const subject = oneLine(`[oday.dev] ${data.type} — ${data.name}`).slice(0, 160);

          const text = [
            `Type: ${data.type}`,
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Language: ${data.locale}`,
            data.page ? `Page: ${data.page}` : "",
            "",
            data.message,
          ].join("\n");

          const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.55;color:#111">
<p style="margin:0 0 4px;color:#666;font-size:12px;letter-spacing:.08em;text-transform:uppercase">New brief from oday.dev</p>
<h2 style="margin:0 0 16px;font-size:20px">${escape(data.type)} — ${escape(data.name)}</h2>
<table style="border-collapse:collapse;margin-bottom:16px;font-size:14px">
<tr><td style="padding:2px 12px 2px 0;color:#666">Email</td><td><a href="mailto:${escape(data.email)}">${escape(data.email)}</a></td></tr>
<tr><td style="padding:2px 12px 2px 0;color:#666">Language</td><td>${escape(data.locale)}</td></tr>
${data.page ? `<tr><td style="padding:2px 12px 2px 0;color:#666">Page</td><td>${escape(data.page)}</td></tr>` : ""}
</table>
<div style="white-space:pre-wrap;border-left:3px solid #4ade80;padding:4px 0 4px 14px">${escape(data.message)}</div>
<p style="margin-top:20px;color:#888;font-size:12px">Reply to this email to answer ${escape(data.name)} directly.</p>
</div>`;

          try {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from,
                to: [to],
                reply_to: oneLine(data.email),
                subject,
                text,
                html,
              }),
            });
            if (!res.ok) {
              console.error(
                "[contact] resend failed",
                res.status,
                await res.text().catch(() => ""),
              );
              return json({ ok: false, error: "send" }, 502);
            }
          } catch (err) {
            console.error("[contact] resend error", err);
            return json({ ok: false, error: "send" }, 502);
          }

          return json({ ok: true });
        },
      },
    },
  } as object),
});
