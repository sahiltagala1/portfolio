import type { MetadataRoute } from "next";
import { IS_PRODUCTION_URL, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** Previews and local builds stay out of search results until a real URL is set. */
export default function robots(): MetadataRoute.Robots {
  return IS_PRODUCTION_URL
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
