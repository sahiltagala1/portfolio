import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/content";
import { notes } from "@/lib/notes";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    ...caseStudies.map((p) => ({ url: `${SITE_URL}/work/${p.slug}/` })),
    { url: `${SITE_URL}/playground/` },
    { url: `${SITE_URL}/notes/` },
    ...notes.map((n) => ({ url: `${SITE_URL}/notes/${n.slug}/` })),
  ];
}
