import type { MetadataRoute } from "next";
import { services, siteUrl } from "@/lib/content";

const publicPaths = ["/", "/servicios", "/soluciones", "/nosotros", "/contacto"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep preparation-only routes (/blog and /portafolio) out until they are indexable.
  const paths = [...publicPaths, ...services.map((service) => `/servicios/${service.slug}`)];
  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
