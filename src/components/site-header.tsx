"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { whatsappUrl } from "@/lib/content";
const links = [{ href: "/", label: "Inicio" },{href:"/servicios",label:"Servicios"},{href:"/soluciones",label:"Soluciones"},{href:"/portafolio",label:"Portafolio"},{href:"/nosotros",label:"Nosotros"},{href:"/blog",label:"Blog"},{href:"/contacto",label:"Contacto"}];
export function Logo(){return <Link className="logo" href="/" aria-label="Nexo Digital Studio — inicio"><span className="logo-mark">N</span><span>NEXO DIGITAL<small>STUDIO</small></span></Link>}
export function SiteHeader(){
 const [opened,setOpened]=useState(false);const path=usePathname();
 return <header className="site-header"><div className="container header-inner"><Logo/>
  <nav className="nav-links desktop-nav" aria-label="Navegación principal">{links.map(link=><Link key={link.href} href={link.href} aria-current={path===link.href?"page":undefined}>{link.label}</Link>)}</nav>
  <div className="header-actions"><a className="button button-primary desktop-cta" href={whatsappUrl("Hola, quiero cotizar un proyecto con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer">Cotizar proyecto <ArrowUpRight size={16}/></a><button className="menu-button" aria-label={opened?"Cerrar menú":"Abrir menú"} aria-expanded={opened} aria-controls="mobile-site-navigation" onClick={()=>setOpened(!opened)}>{opened?<X size={21}/>:<Menu size={21}/>}</button></div>
 </div>{opened&&<nav id="mobile-site-navigation" className="mobile-nav" aria-label="Navegación móvil">{links.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpened(false)} aria-current={path===link.href?"page":undefined}>{link.label}</Link>)}<a href={whatsappUrl("Hola, quiero cotizar un proyecto con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer" onClick={()=>setOpened(false)}>Cotizar proyecto <ArrowUpRight size={15}/></a></nav>}</header>;
}
export function WhatsAppFloat(){return <a className="whatsapp-float" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Escribir a Nexo Digital Studio por WhatsApp"><MessageCircle size={26}/></a>}
