/**
 * Ensure header-only routes in the Vercel build output don't stop routing.
 * Header routes must carry `continue: true`, otherwise Vercel applies the headers
 * and never reaches the filesystem or the server function.
 */
import fs from "node:fs";

const file = ".vercel/output/config.json";
if (fs.existsSync(file)) {
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  let fixed = 0;
  for (const route of config.routes ?? []) {
    if (route.headers && !route.dest && !route.status && !route.handle && !route.continue) {
      route.continue = true;
      fixed++;
    }
  }
  fs.writeFileSync(file, JSON.stringify(config, null, 2));
  console.log(`[vercel-postbuild] header routes marked continue: ${fixed}`);
}
