import type { Metadata } from "next";
import { InteriorCta, InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { ServiceTile } from "@/components/interiors/service-tile";
import { services } from "@/lib/content";
export const metadata:Metadata={alternates:{canonical:"/servicios"},title:"Servicios",description:"Servicios de desarrollo web, sistemas, apps móviles, automatización, inteligencia artificial y QA de Nexo Digital Studio."};
export default function ServicesPage() {
  const featured = [services[0], services[2]];
  const remaining = services.filter(service => !featured.includes(service));
  return (
    <InteriorShell>
      <InteriorIntro title="El siguiente paso." text="Diseñamos, desarrollamos e integramos tecnología a medida. Explora nuestros servicios y encuentra el punto de partida para tu proyecto." />
      <section className="interior-section interior-catalog" aria-label="Catálogo de servicios">
        <div className="proposal-container">
          <div className="interior-feature-grid">{featured.map(service => <ServiceTile key={service.slug} service={service} featured />)}</div>
          <div className="interior-service-list">{remaining.map(service => <ServiceTile key={service.slug} service={service} editorial />)}</div>
        </div>
      </section>
      <InteriorCta />
    </InteriorShell>
  );
}
