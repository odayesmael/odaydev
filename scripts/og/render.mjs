// SVG -> PNG for scripts/og/generate.py. Needs: npm i --no-save @resvg/resvg-js
import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
for (const [src, out] of jobs) {
  const png = new Resvg(fs.readFileSync(src, "utf8"), {
    fitTo: { mode: "width", value: 1200 },
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng();
  fs.writeFileSync(out, png);
}
