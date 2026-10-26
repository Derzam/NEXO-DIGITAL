import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CtaBand, PageIntro } from "@/components/ui";
import { industries, whatsappUrl } from "@/lib/content";
export const metadata:Metadata={alternates:{canonical:"/soluciones"},title:"Soluciones por industria",description:"Soluciones digitales para comercios, restaurantes, transporte, delivery, emprendedores y empresas."};
export default function SolutionsPage(){return <><PageIntro title="Tecnología en contexto." text="Cada industria enfrenta desafíos distintos. Estas son algunas soluciones que podemos diseñar según tus objetivos y operaciones."/><section className="section section-soft"><div className="container industry-grid">{industries.map(industry=><article className="mini-card" key={industry.title}><h3>{industry.title}</h3><p>{industry.text}</p><a className="industry-link" href={whatsappUrl("Hola, me interesa una solución digital para "+industry.title+".")} target="_blank" rel="noopener noreferrer">Consultar solución <ArrowUpRight size={15}/></a></article>)}</div></section><CtaBand/></>}
