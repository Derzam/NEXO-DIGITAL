import type { Metadata } from "next";
import { MessageCircle, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { whatsappUrl } from "@/lib/content";
export const metadata:Metadata={alternates:{canonical:"/contacto"},title:"Contacto y cotizaciones",description:"Solicita una cotización de páginas web, aplicaciones, sistemas e IA con Nexo Digital Studio en Ecuador."};
export default function ContactPage() {
  return <InteriorShell>
    <InteriorIntro title="Conectemos tu idea." text="Explícanos tu idea, las necesidades de tu negocio y las funcionalidades que imaginas. Con esa información podremos conversar sobre el alcance." />
    <section className="interior-section interior-catalog">
      <div className="proposal-container interior-contact-grid">
        <div className="interior-form-panel"><h2>Cuéntanos qué necesitas.</h2><ContactForm /></div>
        <aside>
          <h2>De la idea al plan.</h2><p className="interior-body tw:mt-6">Si tienes una idea, un sistema que mejorar o un proceso que automatizar, podemos revisar las alternativas y definir la mejor forma de empezar.</p>
          <div className="interior-contact-details"><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={21} aria-hidden="true" /> +593 98 444 7960</a><span><MapPin size={21} aria-hidden="true" /> Ecuador · Atención online</span></div>
          <p className="interior-price-note">El precio final puede variar según los requerimientos y funcionalidades de cada proyecto. La cotización se define después de evaluar el alcance.</p>
        </aside>
      </div>
    </section>
  </InteriorShell>;
}
