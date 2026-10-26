import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { PageIntro } from "@/components/ui";
export const metadata:Metadata={alternates:{canonical:"/blog"},title:"Blog y recursos",description:"Próximos recursos sobre desarrollo web, inteligencia artificial, automatización y calidad de software."};
export default function BlogPage(){return <><PageIntro title="Pensar para crear." text="Un espacio para compartir lo que aprendemos sobre desarrollo, diseño, automatización e inteligencia artificial."/><section className="section section-soft"><div className="container empty-state"><div className="empty-state-art" aria-hidden="true"><BookOpenText/></div><div className="empty-state-content"><h2>Ideas en camino.</h2><p>Estamos preparando los primeros artículos y recursos. Publicaremos contenido con referencias comprobables y aplicaciones prácticas.</p><Link href="/servicios" className="text-link">Explora nuestros servicios <ArrowRight size={19} aria-hidden="true"/></Link></div></div></section></>}
