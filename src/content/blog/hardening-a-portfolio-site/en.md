Small sites get attacked too. Usually not by someone targeting *you*, but by bots that scan every domain for missing headers, open forms and leaked email addresses. A portfolio or company site doesn't need an enterprise security program, but it does need a solid baseline. This is the one I applied to this site, and it's what I recommend to clients.

## Start with the security headers

Response headers cost nothing and close whole classes of problems. These are the ones worth sending on every response:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cross-Origin-Opener-Policy: same-origin
```

- **HSTS** tells browsers to only ever use HTTPS for your domain, so nobody can downgrade a visitor to plain HTTP. Only add `preload` once every subdomain really works over HTTPS.
- **nosniff** stops browsers from guessing file types, a classic route for running uploaded files as scripts.
- **X-Frame-Options** (and `frame-ancestors` in the CSP below) stops other sites from loading yours in an invisible frame to trick clicks.
- **Referrer-Policy** keeps full URLs, which may contain tokens or search terms, from leaking to other sites.
- **Permissions-Policy** switches off powerful browser features you don't use. If a script is ever injected, it can't ask for the camera.

Most hosts let you set these in configuration: `vercel.json`, Netlify's `_headers`, an Nginx `add_header`, or for WordPress a few lines in `.htaccess` or a small plugin.

## Add a Content-Security-Policy that doesn't break the site

A CSP lists where the page is allowed to load scripts, styles, images and connections from. It's the strongest protection against cross-site scripting, and the header people most often skip because it can break things. Start strict and open up only what you need:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://images.example-cdn.com;
font-src 'self';
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests
```

A few practical notes:

- **Self-host fonts and scripts** where you can. Every third party you add to the CSP is a third party you trust with your visitors.
- Many frameworks inline a small amount of hydration code or styles. If yours does, you'll need `'unsafe-inline'` for that directive, or better, nonces if the framework supports them. Even with `'unsafe-inline'`, the rest of the policy still blocks loading scripts from foreign domains.
- Roll out with `Content-Security-Policy-Report-Only` first, browse the whole site with DevTools open, fix what's reported, then switch to enforcing.

## Don't publish your email address as plain text

Scrapers harvest `name@domain` strings from HTML at scale. On this site, the address is assembled in the browser from separate parts, and the server-rendered HTML only contains a readable placeholder. It's a small step that noticeably reduces spam.

## Build a contact form bots can't abuse

A `mailto:` link is safe but loses people whose computer has no mail app set up. A real form is better, as long as the endpoint is careful. My checklist for the server side:

1. **Validate everything** with a schema: required fields, an email format check, maximum lengths. Reject anything else with a 400.
2. **Add a honeypot**: a field hidden from people (and from screen readers with `aria-hidden` and `tabindex="-1"`) that bots fill in. If it has a value, silently pretend success, so bots don't learn to adapt.
3. **Check the fill time.** A human doesn't complete a form in under three seconds. A bot does.
4. **Rate-limit per IP**, even roughly. A few messages per ten minutes is plenty for a contact form.
5. **Strip line breaks** from anything that ends up in an email header (name, subject, reply-to). Otherwise a crafted value can add extra headers or recipients.
6. **Escape HTML** before putting visitor input into an HTML email.
7. **Check the `Origin` header** so other sites can't post to your endpoint from a visitor's browser.
8. Keep the email provider's **API key on the server**, in an environment variable, and never return provider errors to the client.

```ts
// The parts that matter, in a few lines
if (body.website) return ok();                         // honeypot
if (Date.now() - body.startedAt < 3000) return ok();   // too fast to be human
if (rateLimited(ip)) return tooMany();
const subject = `[site] ${body.name}`.replace(/[\r\n]+/g, " ");
await sendEmail({ subject, replyTo: body.email.replace(/[\r\n]+/g, ""), text: body.message });
```

Add CAPTCHA only if these measures aren't enough. Every extra step loses some real enquiries.

## Keep dependencies boring and up to date

Most real-world breaches of small sites come through outdated software: an old WordPress plugin, an abandoned theme, a JavaScript package with a known vulnerability.

- Turn on automated update pull requests (GitHub's **Dependabot**, or Renovate), but **review** them. Major versions can still break the build.
- On WordPress: remove plugins and themes you don't use (deactivated plugins can still be exploited), enable auto-updates for minor releases, and keep a tested backup.
- Some hosts now refuse to deploy packages with known critical vulnerabilities. Treat that as a feature, not an obstacle.

## Verify, then re-verify

Run the live site through [securityheaders.com](https://securityheaders.com) and [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory) after every infrastructure change. Headers have a way of disappearing when someone changes hosting, a CDN rule or a caching layer.

> None of this is exotic, and that's the point. A good baseline turns your site from an easy target into one that bots skip.
