import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/shadcn/card";
import { ProductPreview } from "@/components/proposal/product-previews";
import type { Service } from "@/lib/content";

export function serviceFamily(slug: string): "web" | "software" | "ia" {
  if (["inteligencia-artificial", "automatizacion"].includes(slug)) return "ia";
  if (["sistemas-web", "integraciones", "auditoria-qa"].includes(slug)) return "software";
  return "web";
}

export function ServiceTile({ service, featured = false, editorial = false }: { service: Service; featured?: boolean; editorial?: boolean }) {
  return (
    <Card className={"interior-service-tile tw:gap-0 tw:p-0 " + (featured ? "interior-service-featured" : "") + (editorial ? " tw:bg-transparent tw:rounded-none" : "")}>
      <Link className="service-card" href={"/servicios/" + service.slug}>
        <div className="interior-service-copy">
          <span className="interior-note">{service.eyebrow}</span>
          <h2>{service.title}</h2>
          <p>{service.short}</p>
          <span className="interior-text-link">Explorar servicio <ArrowUpRight size={18} aria-hidden="true" /></span>
        </div>
      </Link>
      {featured ? <div className="interior-service-preview"><ProductPreview family={serviceFamily(service.slug)} /><span className="interior-note">Interfaz demostrativa. Datos de ejemplo.</span></div> : null}
    </Card>
  );
}
