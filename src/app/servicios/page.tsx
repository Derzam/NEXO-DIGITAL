import type { Metadata } from "next";
import { CtaBand, PageIntro, ServiceCard } from "@/components/ui";
import { services } from "@/lib/content";
export const metadata:Metadata={alternates:{canonical:"/servicios"},title:"Servicios",description:"Servicios de desarrollo web, sistemas, apps móviles, automatización, inteligencia artificial y QA de Nexo Digital Studio."};
export default function ServicesPage(){return <><PageIntro title="El siguiente paso." text="Diseñamos, desarrollamos e integramos tecnología a medida. Explora nuestros servicios y encuentra el punto de partida para tu proyecto."/><section className="section-soft section"><div className="container service-grid">{services.map(service=><ServiceCard key={service.slug} service={service}/>)}</div></section><CtaBand/></>}
