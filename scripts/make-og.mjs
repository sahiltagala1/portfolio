// Regenerates public/og.png, the image shown when the site is shared.
// Run with: node scripts/make-og.mjs
import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const font = (p) => pathToFileURL(join(process.cwd(), "node_modules", p)).href;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:D;src:url(${font("@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2")});font-weight:200 800}
@font-face{font-family:M;src:url(${font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2")})}
body{margin:0;width:1200px;height:630px;background:#FAFAF9;color:#18181B;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;box-sizing:border-box}
p{margin:0;font:500 26px M;letter-spacing:.06em;text-transform:uppercase;color:#5C5C66}
h1{margin:0;font:700 76px/1.08 D;letter-spacing:-.025em;max-width:960px}

</style>
<p>Mohammed Sahil Tagala · Dublin</p>
<h1>I build backend systems, and models that explain their own alarms.</h1>
<div style="display:flex;gap:14px;font:500 24px M;color:#3B45D9">Software engineer <span style="color:#5C5C66">/</span> Data scientist</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("Wrote public/og.png");
