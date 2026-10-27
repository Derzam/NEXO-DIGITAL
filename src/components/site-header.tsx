"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { isPremiumRoute } from "@/lib/premium-routes";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { NexoMark } from "@/components/nexo-artwork";
import { whatsappUrl } from "@/lib/content";
const links = [{ href: "/", label: "Inicio" },{href:"/servicios",label:"Servicios"},{href:"/soluciones",label:"Soluciones"},{href:"/portafolio",label:"Portafolio"},{href:"/nosotros",label:"Nosotros"},{href:"/blog",label:"Blog"},{href:"/contacto",label:"Contacto"}];
export function Logo(){return <Link className="logo" href="/" title="Nexo Digital Studio — inicio"><NexoMark className="logo-mark"/><span>Nexo Digital<small>Studio</small></span></Link>}
const ProposalHeader=dynamic(()=>import("@/components/proposal/header").then(module=>module.ProposalHeader));
export function SiteHeader(){const path=usePathname();return isPremiumRoute(path)?<ProposalHeader/>:<LegacySiteHeader/>}
function LegacySiteHeader(){
 const menuButton=useRef<HTMLButtonElement>(null);
 const [opened,setOpened]=useState(false);const path=usePathname();
 return <header className="site-header" onKeyDown={event=>{if(event.key==="Escape"&&opened){setOpened(false);menuButton.current?.focus();}}}><div className="container header-inner"><Logo/>
  <nav className="nav-links desktop-nav" aria-label="Navegación principal">{links.map(link=><Link key={link.href} href={link.href} aria-current={path===link.href?"page":undefined}>{link.label}</Link>)}</nav>
  <div className="header-actions"><a className="button button-primary desktop-cta" href={whatsappUrl("Hola, quiero cotizar un proyecto con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer">Cotizar proyecto <ArrowUpRight size={16}/></a><a className="mobile-whatsapp" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp"><MessageCircle size={22} aria-hidden="true"/></a><button ref={menuButton} type="button" className="menu-button" aria-label={opened?"Cerrar menú":"Abrir menú"} aria-expanded={opened} aria-controls="mobile-site-navigation" onClick={()=>setOpened(!opened)}>{opened?<X size={21}/>:<Menu size={21}/>}</button></div>
 </div>{opened&&<nav id="mobile-site-navigation" className="mobile-nav" aria-label="Navegación móvil">{links.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpened(false)} aria-current={path===link.href?"page":undefined}>{link.label}</Link>)}<a href={whatsappUrl("Hola, quiero cotizar un proyecto con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer" onClick={()=>setOpened(false)}>Cotizar proyecto <ArrowUpRight size={15}/></a></nav>}</header>;
}
export function WhatsAppFloat(){return <a className="whatsapp-float" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Escribir a Nexo Digital Studio por WhatsApp"><MessageCircle size={26}/></a>}
