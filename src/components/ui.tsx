import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Bot, Code2, Globe2, Network, Search, ShieldCheck, Smartphone, Store, Workflow } from "lucide-react";
import { Service, whatsappUrl } from "@/lib/content";

export function ServiceIcon({ kind, size = 26 }: { kind: Service["icon"]; size?: number }) {
  const icons = { globe: Globe2, code: Code2, smartphone: Smartphone, bot: Bot, workflow: Workflow, shield: ShieldCheck, search: Search, store: Store, network: Network };
  const Icon = icons[kind];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
export function SectionHeading({ eyebrow, title, children, align = "left" }: { eyebrow: string; title: string; children?: ReactNode; align?: "left" | "center" }) {
  return <div className={"section-heading " + (align === "center" ? "align-center" : "")}>
    <span className="eyebrow"><span className="eyebrow-line" />{eyebrow}</span>
    <h2>{title}</h2>{children && <p>{children}</p>}
  </div>;
}
export function ServiceCard({ service, number }: { service: Service; number?: number }) {
  return <Link href={"/servicios/" + service.slug} className="service-card">
    <span className="service-icon"><ServiceIcon kind={service.icon} /></span>
    <span className="card-top-right">{number ? String(number).padStart(2, "0") : <ArrowUpRight size={20} />}</span>
    <h3>{service.title}</h3><p>{service.short}</p>
    <span className="card-more">Conocer servicio <ArrowRight size={16}/></span>
  </Link>;
}
export function CtaBand() {
  return <section className="container cta-band">
    <div className="cta-orbit" aria-hidden="true"/>
    <div className="cta-copy">
      <span className="eyebrow eyebrow-light"><span className="eyebrow-line"/>HAGAMOS ALGO EXTRAORDINARIO</span>
      <h2>Tu próximo proyecto empieza con una conversación.</h2>
      <p>Cuéntanos qué necesitas. Te ayudamos a definir la solución ideal para tu negocio.</p>
    </div>
    <a href={whatsappUrl("Hola, quiero conversar sobre un proyecto para mi negocio.")} target="_blank" rel="noopener noreferrer" className="button button-white">Hablemos de tu proyecto <ArrowUpRight size={18}/></a>
  </section>;
}
export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="page-intro container"><span className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</span><h1>{title}</h1><p>{text}</p></section>;
}
