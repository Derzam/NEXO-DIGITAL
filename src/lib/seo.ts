import type { Metadata } from "next";
import { brand, siteUrl } from "@/lib/content";

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${brand}`;
  const image = { url: "/images/nexo-threshold.webp", alt: "Nexo Digital Studio" };
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_EC", siteName: brand, url: new URL(path, siteUrl).toString(), title: fullTitle, description, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
