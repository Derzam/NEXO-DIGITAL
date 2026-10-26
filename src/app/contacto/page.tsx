import type { Metadata } from "next";
import { MessageCircle, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/ui";
import { whatsappUrl } from "@/lib/content";
export const metadata:Metadata={alternates:{canonical:"/contacto"},title:"Contacto y cotizaciones",description:"Solicita una cotización de páginas web, aplicaciones, sistemas e IA con Nexo Digital Studio en Ecuador."};
export default function ContactPage(){return <><PageIntro title="Conectemos tu idea." text="Explícanos tu idea, las necesidades de tu negocio y las funcionalidades que imaginas. Con esa información podremos conversar sobre el alcance."/><section className="container contact-layout"><div className="contact-copy"><h2>De la idea al plan.</h2><p>Si tienes una idea, un sistema que mejorar o un proceso que automatizar, podemos revisar las alternativas y definir la mejor forma de empezar.</p><div className="contact-details"><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/> +593 98 444 7960</a><span className="contact-location"><MapPin size={21}/> Ecuador · Atención online</span></div><div className="notice">El precio final puede variar según los requerimientos y funcionalidades de cada proyecto. La cotización se define después de evaluar el alcance.</div></div><ContactForm/></section></>}
