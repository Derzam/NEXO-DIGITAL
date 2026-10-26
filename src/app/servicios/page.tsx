import type { Metadata } from "next";
import { CtaBand, PageIntro, ServiceCard } from "@/components/ui";
import { services } from "@/lib/content";
export const metadata:Metadata={title:"Servicios",description:"Servicios de desarrollo web, sistemas, apps móviles, automatización, inteligencia artificial y QA de Nexo Digital Studio."};
export default function ServicesPage(){return <><PageIntro eyebrow="SERVICIOS DIGITALES" title="Todo lo que tu negocio necesita para evolucionar" text="Diseñamos, desarrollamos e integramos tecnología a medida. Explora nuestros servicios y encuentra el punto de partida para tu proyecto."/><section className="section-soft section"><div className="container service-grid">{services.map((service,index)=><ServiceCard key={service.slug} service={service} number={index+1}/>)}</div></section><CtaBand/></>}
