import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    // Exclude administrative routes from web crawlers.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/"] },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
