import { pendingPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InteriorCta, InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { PortfolioPreview } from "@/components/proposal/product-previews";
import { ProjectShowcase } from "@/components/interiors/project-showcase";
import { Button } from "@/components/shadcn/button";
export const metadata = pendingPageMetadata("/portafolio", "Portafolio de soluciones digitales", "Explora las áreas de trabajo de Nexo Digital Studio y conoce la preparación de sus próximos casos de estudio.");
export default function PortfolioPage() {
  return <InteriorShell>
    <InteriorIntro title="Trabajo con propósito." text="Estamos preparando casos de estudio para compartir el reto, las decisiones y el resultado detrás de cada solución." />
    <ProjectShowcase variant="portfolio" />
    <section className="interior-section interior-catalog">
      <div className="proposal-container interior-portfolio-layout">
          <figure className="interior-demo" aria-label="Concepto de interfaz de Nexo">
            <PortfolioPreview />
            <figcaption className="interior-note">Concepto de diseño y exploración de Nexo. No representa un cliente ni un producto entregado.</figcaption>
          </figure>
          <div>
            <h2>Estudio conceptual.</h2>
            <p className="interior-body tw:mt-6">Esta exploración es un concepto visual. Los casos de clientes se publicarán con materiales y permisos verificados.</p>
          <Button asChild variant="secondary" className="tw:mt-7 tw:h-auto tw:min-h-12 tw:rounded-full tw:px-5 tw:py-3 tw:text-[16px] tw:whitespace-normal tw:text-left"><Link href="/contacto">Cotizar proyecto <ArrowUpRight size={18} aria-hidden="true" /></Link></Button>
        </div>
      </div>
    </section>
    <section className="interior-section interior-section-soft">
        <div className="proposal-container interior-editorial-grid">
          <h2>Casos de estudio reales.</h2>
          <div className="interior-body"><p>Cuando haya un caso listo, aquí se presentarán el contexto del problema, las decisiones de diseño e ingeniería y las evidencias que podamos publicar.</p><p className="tw:mt-5">Esta sección permanece en preparación hasta contar con material real y autorización de publicación.</p></div>
      </div>
    </section>
    <InteriorCta />
  </InteriorShell>;
}
