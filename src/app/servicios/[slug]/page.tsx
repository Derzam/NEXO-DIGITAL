import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { InteriorBreadcrumb, InteriorCta, InteriorShell } from "@/components/interiors/shell";
import { ServiceTile, serviceFamily } from "@/components/interiors/service-tile";
import { ProductPreview } from "@/components/proposal/product-previews";
import { services, siteUrl, whatsappUrl } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return services.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const service=services.find(s=>s.slug===slug);return service ? pageMetadata("/servicios/" + service.slug, service.title + " en Ecuador", service.short + " Conoce este servicio de Nexo Digital Studio en Ecuador.") : { title: "Servicio no encontrado" }}
export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const service = services.find(s => s.slug === slug);
  if (!service) notFound();
  const related = services.filter(s => s.slug !== slug).slice(0, 3);
  return (
    <InteriorShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl + "/" }, { "@type": "ListItem", position: 2, name: "Servicios", item: siteUrl + "/servicios" }, { "@type": "ListItem", position: 3, name: service.title, item: siteUrl + "/servicios/" + service.slug }] }).replace(/</g, "\\u003c") }} />
      <section className="interior-intro">
        <div className="proposal-container">
          <InteriorBreadcrumb title={service.title} services />
          <div className="interior-detail-grid">
            <div>
              <h1>{service.title}</h1>
              <p className="interior-lead">{service.description}</p>
              <div className="interior-actions">
                <Button asChild className="tw:h-13 tw:rounded-full tw:px-6 tw:text-[16px]">
                  <a href={whatsappUrl("Hola, quiero cotizar el servicio de " + service.title + " con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer">Cotizar este servicio <ArrowUpRight size={18} aria-hidden="true" /></a>
                </Button>
              </div>
            </div>
            <figure className="interior-demo">
              <ProductPreview family={serviceFamily(service.slug)} />
              <figcaption className="interior-note">Interfaz demostrativa. Ilustra posibilidades del servicio, no un proyecto de cliente.</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="interior-section interior-section-soft">
        <div className="proposal-container interior-scope-grid">
          <div>
            <h2>¿Qué podemos incluir?</h2>
            <ul className="interior-check-list">{service.bullets.map(item => <li key={item}><Check size={19} aria-hidden="true" /><span>{item}</span></li>)}</ul>
            <p className="interior-note tw:mt-6">Las funcionalidades definitivas se acuerdan durante el levantamiento de requerimientos.</p>
          </div>
          <div>
            <h2>Tu proyecto incluye</h2>
            <p className="interior-body tw:mt-5">Se definirá el alcance concreto de cada entrega en la propuesta técnica y comercial.</p>
            <ul className="interior-deliverables">{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="interior-section">
        <div className="proposal-container">
          <div className="interior-heading-row"><h2>Más conexiones.</h2><Button asChild variant="ghost" className="tw:h-12 tw:text-[16px]"><Link href="/servicios">Todos los servicios <ArrowRight size={18} aria-hidden="true" /></Link></Button></div>
          <div className="interior-related-grid">{related.map(s => <ServiceTile key={s.slug} service={s} editorial />)}</div>
        </div>
      </section>
      <InteriorCta />
    </InteriorShell>
  );
}
