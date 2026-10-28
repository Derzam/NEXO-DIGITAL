import { pageMetadata } from "@/lib/seo";
import { InteriorCta, InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { Methodology } from "@/components/proposal/interactions";
export const metadata = pageMetadata("/nosotros", "Sobre Nexo Digital Studio", "Conoce la visión y metodología de Nexo Digital Studio para diseñar y desarrollar soluciones digitales a medida en Ecuador.");
export default function AboutPage() {
  return <InteriorShell>
    <InteriorIntro title="Visión e ingeniería." text="Somos un estudio digital enfocado en diseñar soluciones útiles, comprensibles y sostenibles para negocios, equipos y emprendedores." />
    <section className="interior-section interior-section-soft">
      <div className="proposal-container interior-editorial-grid">
        <h2>Propósito</h2>
        <p className="interior-statement">Acercar el desarrollo de software profesional a quienes buscan transformar una idea en una herramienta real.</p>
      </div>
    </section>
    <section className="interior-section">
      <div className="proposal-container interior-about-grid">
        <div className="interior-principles">
          <div><h2>Enfoque</h2><p className="interior-body tw:mt-5">Comprender el problema antes de escribir código, definir un alcance claro y construir de manera incremental.</p></div>
          <div><h2>Compromiso</h2><p className="interior-body tw:mt-5">Comunicación transparente, decisiones técnicas justificadas y validación de cada entrega.</p></div>
        </div>
        <div className="interior-method">
          <h2>Cada decisión cuenta.</h2>
          <p className="interior-body tw:mt-5 tw:mb-6">Cada etapa tiene objetivos, revisiones y entregables acordados.</p>
          <Methodology />
        </div>
      </div>
    </section>
    <InteriorCta />
  </InteriorShell>;
}
