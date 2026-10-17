// /api/og edge route: 1200x630 PNG with the title rendered in ABC Diatype.
import fs from "node:fs";
import path from "node:path";

const title = process.env.OG_TITLE || "Verification of the OG card";

export default async function ({ page, check, evidenceDir, shot }) {
  const res = await page.request.get(`/api/og?title=${encodeURIComponent(title)}`);
  check(res.ok(), `GET /api/og -> ${res.status()}`);
  check((res.headers()["content-type"] || "").startsWith("image/png"), "content-type image/png");
  const buf = await res.body();
  fs.writeFileSync(path.join(evidenceDir, "og.png"), buf);
  check(buf.readUInt32BE(16) === 1200 && buf.readUInt32BE(20) === 630, "PNG is 1200x630");

  await page.setContent(`<img src="data:image/png;base64,${buf.toString("base64")}" style="width:1200px">`);
  await shot("og-rendered");
}
