import type { MetadataRoute } from "next";
import { services, siteUrl } from "@/lib/content";
export default function sitemap():MetadataRoute.Sitemap{
 const paths=["","/servicios","/soluciones","/nosotros","/contacto"];
 return [...paths.map(path=>({url:siteUrl+path,changeFrequency:"monthly" as const,priority:path===""?1:0.7})),...services.map(service=>({url:siteUrl+"/servicios/"+service.slug,changeFrequency:"monthly" as const,priority:0.7}))];
}
