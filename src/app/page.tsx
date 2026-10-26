import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { CtaBand, ServiceCard } from "@/components/ui";
import { ConnectionArtwork, OrbitArtwork } from "@/components/nexo-artwork";
import { processSteps, services, whatsappUrl } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-horizon" aria-hidden="true"/>
      <div className="container hero-inner">
        <div className="hero-text"><h1>Ideas que<br/>conectan.</h1><p>Diseño, software e inteligencia artificial.<br className="desktop-break"/> Conectamos lo que imaginas con lo que tu negocio necesita.</p><div className="hero-buttons"><Link className="button button-primary" href="/servicios">Explorar servicios <ArrowUpRight size={19} aria-hidden="true"/></Link><a className="text-link" href={whatsappUrl("Hola, quiero iniciar un proyecto digital con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer">Hablemos de tu idea <ArrowRight size={18} aria-hidden="true"/></a></div></div>
        <OrbitArtwork/>
        <div className="hero-bottom"><span>Estudio digital · Ecuador</span><p>Una visión. Todas las conexiones.</p><a href="#servicios" className="hero-scroll" >Descubre Nexo <span aria-hidden="true">↓</span></a></div>
      </div>
    </section>

    <section className="section home-services" id="servicios"><div className="container">
      <div className="section-topline"><h2>Tecnología{ " " }<br/>con propósito.</h2><p>De tu primera presencia digital a las herramientas que mueven tu operación. Elegimos la tecnología a partir del reto.</p></div>
      <div className="home-service-grid">{services.slice(0,2).map(service=><ServiceCard key={service.slug} service={service}/>)}</div>
      <div className="home-service-list">{services.slice(2,6).map(service=><ServiceCard key={service.slug} service={service}/>)}</div>
      <div className="section-actions"><Link href="/servicios" className="text-link">Ver todos los servicios <ArrowUpRight size={19} aria-hidden="true"/></Link></div>
    </div></section>

    <section className="section home-approach"><div className="container approach-layout"><div className="approach-visual"><ConnectionArtwork/><p>El valor está en cómo conectamos las piezas.</p></div><div className="approach-copy"><h2>Una mirada<br/>más completa.</h2><p>Una buena solución no empieza con una herramienta. Empieza por entender a las personas, el negocio y lo que debe cambiar.</p><p>Diseñamos la experiencia, construimos sobre una arquitectura clara y validamos cada entrega. Todo responde al mismo objetivo.</p><Link href="/nosotros" className="text-link">Conoce nuestra metodología <ArrowUpRight size={19} aria-hidden="true"/></Link></div></div></section>

    <section className="section home-method"><div className="container method-layout"><div className="method-intro"><h2>Del reto<br/>al resultado.</h2><p>Un proceso compartido, con decisiones claras y espacio para evolucionar.</p><Link href="/nosotros" className="text-link">Así trabajamos <ArrowRight size={18} aria-hidden="true"/></Link></div><div className="method-steps">{processSteps.map((step,index)=><details key={step.title} className="method-step" open={index===0}><summary><h3>{step.title}</h3><Plus size={20} aria-hidden="true"/></summary><p>{step.text}</p></details>)}</div></div></section>

    <section className="section home-industries"><div className="container editorial-split"><div><h2>Tu negocio.<br/>Conectado.</h2><p>Cada negocio tiene su forma de avanzar. Creamos soluciones que encajan con la tuya.</p><Link href="/soluciones" className="text-link">Explorar soluciones <ArrowUpRight size={19} aria-hidden="true"/></Link></div><div className="sector-list">{[["Comercio","Catálogos y ventas"],["Transporte","Apps y gestión"],["Delivery","Operaciones conectadas"],["Empresas","Automatización y software"]].map(([name,text])=><Link key={name} href="/soluciones"><h3>{name}</h3><span>{text}</span><ArrowUpRight size={20} aria-hidden="true"/></Link>)}</div></div></section>
    <CtaBand/>
  </>;
}
