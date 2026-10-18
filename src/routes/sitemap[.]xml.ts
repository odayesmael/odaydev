import { createFileRoute } from "@tanstack/react-router";
import { sitemapXml } from "@/lib/feeds";

export const Route = createFileRoute("/sitemap.xml")({
  // `server` handlers come from TanStack Start; its types live on a nested
  // router-core copy, so the option is cast here (runtime is unaffected).
  ...({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml(), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400",
          },
        }),
    },
  },
} as object),
});
