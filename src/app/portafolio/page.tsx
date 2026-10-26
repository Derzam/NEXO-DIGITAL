import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { CtaBand, PageIntro } from "@/components/ui";
export const metadata:Metadata={alternates:{canonical:"/portafolio"},title:"Portafolio",description:"Conoce las áreas de trabajo y los próximos casos de estudio del portafolio de Nexo Digital Studio."};
export default function PortfolioPage(){return <><PageIntro title="Trabajo con propósito." text="Estamos preparando casos de estudio para compartir el reto, las decisiones y el resultado detrás de cada solución."/><section className="section section-soft"><div className="container empty-state"><div className="empty-state-art" aria-hidden="true"><FolderGit2/></div><div className="empty-state-content"><h2>Lo que viene.</h2><p>Los proyectos se publicarán con sus materiales y permisos de exhibición verificados. Mientras tanto, podemos conversar sobre lo que quieres construir.</p><Link className="text-link" href="/contacto">Conversemos sobre tu proyecto <ArrowUpRight size={19} aria-hidden="true"/></Link></div></div></section><CtaBand/></>}
