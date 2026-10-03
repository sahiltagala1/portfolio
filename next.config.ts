import type { NextConfig } from "next";

// Static export: every page is plain HTML at build time, so the site can be
// hosted on any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
const nextConfig: NextConfig = {
  output: "export",
  // The browser tests build a separate copy (see scripts/e2e-build.mjs) so ./out is never a test build.
  ...(process.env.E2E_OUT ? { distDir: process.env.E2E_OUT } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
