// Regenerates public/og.png, the image shown when the site is shared.
// Run with: node scripts/make-og.mjs
import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const font = (p) => pathToFileURL(join(process.cwd(), "node_modules", p)).href;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:D;src:url(${font("@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2")});font-weight:200 800}
@font-face{font-family:M;src:url(${font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2")})}
body{margin:0;width:1200px;height:630px;background:#EDF2F2;color:#10262C;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;box-sizing:border-box}
p{margin:0;font:500 26px M;letter-spacing:.06em;text-transform:uppercase;color:#4B6166}
h1{margin:0;font:700 76px/1.08 D;letter-spacing:-.025em;max-width:960px}
svg{width:100%;height:150px}
</style>
<p>Sahil Tagala · Dublin</p>
<h1>Backend systems, and models that explain their own alarms.</h1>
<svg viewBox="0 0 1056 150" fill="none"><path d="M0 140 L90 30 H560 L590 105 L620 30 H760 C860 30 900 130 1056 138" stroke="#0A6B67" stroke-width="6" stroke-linejoin="round"/><path d="M590 88 L606 116 H574 Z" fill="#954C00" stroke="#EDF2F2" stroke-width="3"/></svg>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("Wrote public/og.png");
