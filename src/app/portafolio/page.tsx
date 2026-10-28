import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InteriorCta, InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { PortfolioPreview } from "@/components/proposal/product-previews";
import { Button } from "@/components/shadcn/button";
export const metadata = pageMetadata("/portafolio", "Portafolio de soluciones digitales", "Explora las áreas de trabajo de Nexo Digital Studio y conoce la preparación de sus próximos casos de estudio.");
export default function PortfolioPage() {
  return <InteriorShell>
    <InteriorIntro title="Trabajo con propósito." text="Estamos preparando casos de estudio para compartir el reto, las decisiones y el resultado detrás de cada solución." />
    <section className="interior-section interior-catalog">
      <div className="proposal-container interior-portfolio-layout">
        <figure className="interior-demo">
          <PortfolioPreview />
          <figcaption className="interior-note">Estudio de interfaz de Nexo. Demostración conceptual, no un caso de cliente ni un producto entregado.</figcaption>
        </figure>
        <div>
          <h2>Lo que viene.</h2>
          <p className="interior-body tw:mt-6">Los proyectos se publicarán con sus materiales y permisos de exhibición verificados. Mientras tanto, podemos conversar sobre lo que quieres construir.</p>
          <Button asChild variant="secondary" className="tw:mt-7 tw:h-auto tw:min-h-12 tw:rounded-full tw:px-5 tw:py-3 tw:text-[16px] tw:whitespace-normal tw:text-left"><Link href="/contacto">Conversemos sobre tu proyecto <ArrowUpRight size={18} aria-hidden="true" /></Link></Button>
        </div>
      </div>
    </section>
    <section className="interior-section interior-section-soft">
      <div className="proposal-container interior-editorial-grid">
        <h2>El proceso también cuenta.</h2>
        <div className="interior-body"><p>Cuando un caso esté listo, compartiremos el contexto del problema, las decisiones de diseño e ingeniería y las evidencias que podamos publicar.</p><p className="tw:mt-5">Este espacio permanece en preparación hasta contar con material real y autorizado.</p></div>
      </div>
    </section>
    <InteriorCta />
  </InteriorShell>;
}
