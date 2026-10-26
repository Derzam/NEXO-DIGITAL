import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import { CtaBand, ServiceCard } from "@/components/ui";
import { services, whatsappUrl } from "@/lib/content";
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return services.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const service=services.find(s=>s.slug===slug);return service?{alternates:{canonical:"/servicios/"+service.slug},title:service.title,description:service.short}:{title:"Servicio no encontrado"}}
export default async function ServiceDetail({params}:Props){const {slug}=await params;const service=services.find(s=>s.slug===slug);if(!service)notFound();const related=services.filter(s=>s.slug!==slug).slice(0,3);return <>
 <section className="container detail-hero"><div><nav className="breadcrumb" aria-label="Ruta de navegación"><Link href="/">Inicio</Link><ChevronRight size={13}/><Link href="/servicios">Servicios</Link><ChevronRight size={13}/><span>{service.title}</span></nav><h1>{service.title}</h1><p>{service.description}</p><a href={whatsappUrl("Hola, quiero cotizar el servicio de "+service.title+" con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer" className="button button-primary detail-actions">Cotizar este servicio <ArrowUpRight size={17}/></a></div>
 <aside className="detail-list"><h2>¿Qué podemos incluir?</h2><ul>{service.bullets.map(item=><li key={item}><CheckCircle2 size={19}/>{item}</li>)}</ul><p className="form-note">Las funcionalidades definitivas se acuerdan durante el levantamiento de requerimientos.</p></aside></section>
 <section className="section section-soft detail-copy"><div className="container"><h2>Tu proyecto incluye</h2><div className="deliverable-grid">{service.deliverables.map(item=><div className="mini-card" key={item}><h3>{item}</h3><p>Se definirá su alcance concreto en la propuesta técnica y comercial.</p></div>)}</div></div></section>
 <section className="section"><div className="container"><div className="section-heading"><h2>Más conexiones.</h2></div><div className="service-grid">{related.map(s=><ServiceCard key={s.slug} service={s}/>)}</div><div className="section-actions"><Link className="button button-ghost" href="/servicios">Todos los servicios <ArrowRight size={17}/></Link></div></div></section><CtaBand/></>}
