import { pendingPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { Button } from "@/components/shadcn/button";
export const metadata = pendingPageMetadata("/blog", "Blog de tecnología y recursos", "Próximos recursos de Nexo Digital Studio sobre desarrollo web, inteligencia artificial, automatización y calidad de software.");
export default function BlogPage() {
  return <InteriorShell>
    <InteriorIntro title="Pensar para crear." text="Un espacio para compartir lo que aprendemos sobre desarrollo, diseño, automatización e inteligencia artificial." />
    <section className="interior-section interior-section-soft">
      <div className="proposal-container interior-editorial-grid">
        <div><h2>Ideas en camino.</h2><p className="interior-note tw:mt-5">Contenido editorial en preparación.</p></div>
        <div>
          <p className="interior-body">Estamos preparando los primeros artículos y recursos. Publicaremos contenido con referencias comprobables y aplicaciones prácticas.</p>
          <Button asChild className="tw:mt-7 tw:h-12 tw:rounded-full tw:px-5 tw:text-[16px]"><Link href="/servicios">Explora nuestros servicios <ArrowRight size={18} aria-hidden="true" /></Link></Button>
        </div>
      </div>
    </section>
    <section className="interior-section" aria-labelledby="blog-topics">
      <div className="proposal-container interior-editorial-grid">
        <h2 id="blog-topics">Lo que queremos compartir.</h2>
        <div className="interior-body"><p>Los futuros recursos partirán de los temas que trabajamos en el estudio:</p><ul className="interior-topics"><li>Desarrollo web y diseño de experiencias</li><li>Automatización e integraciones</li><li>Inteligencia artificial aplicada</li><li>Calidad y validación de software</li></ul></div>
      </div>
    </section>
  </InteriorShell>;
}
