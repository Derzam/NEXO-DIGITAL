import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { InteriorCta, InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { IndustryPreview } from "@/components/interiors/industry-preview";
import { Button } from "@/components/shadcn/button";
import { industries, whatsappUrl } from "@/lib/content";
export const metadata:Metadata={alternates:{canonical:"/soluciones"},title:"Soluciones por industria",description:"Soluciones digitales para comercios, restaurantes, transporte, delivery, emprendedores y empresas."};
export default function SolutionsPage() {
  return <InteriorShell>
    <InteriorIntro title="Tecnología en contexto." text="Cada industria enfrenta desafíos distintos. Estas son algunas soluciones que podemos diseñar según tus objetivos y operaciones." />
    <section className="interior-section interior-catalog" aria-label="Soluciones por industria">
      <div className="proposal-container industry-stories">
        {industries.map((industry, index) => <article className="industry-story" key={industry.title}>
          <div className="industry-story-copy">
            <h2>{industry.title}</h2><p className="interior-body tw:mt-6">{industry.text}</p>
            <Button asChild variant="secondary" className="tw:mt-7 tw:h-12 tw:rounded-full tw:px-5 tw:text-[16px]">
              <a href={whatsappUrl("Hola, me interesa una solución digital para " + industry.title + ".")} target="_blank" rel="noopener noreferrer">Consultar solución <ArrowUpRight size={18} aria-hidden="true" /></a>
            </Button>
          </div>
          <IndustryPreview index={index} />
        </article>)}
      </div>
    </section>
    <InteriorCta />
  </InteriorShell>;
}
