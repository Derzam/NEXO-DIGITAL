import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Bot, Code2, Globe2, Network, Search, ShieldCheck, Smartphone, Store, Workflow } from "lucide-react";
import { type Service, whatsappUrl } from "@/lib/content";

export function ServiceIcon({ kind, size = 26 }: { kind: Service["icon"]; size?: number }) {
  const icons = { globe: Globe2, code: Code2, smartphone: Smartphone, bot: Bot, workflow: Workflow, shield: ShieldCheck, search: Search, store: Store, network: Network };
  const Icon = icons[kind];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
export function SectionHeading({ title, children, align = "left" }: { eyebrow?: string; title: string; children?: ReactNode; align?: "left" | "center" }) {
  return <div className={"section-heading " + (align === "center" ? "align-center" : "")}><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}
export function ServiceCard({ service }: { service: Service; number?: number }) {
  return <Link href={"/servicios/" + service.slug} className="service-card">
    <div className="service-card-heading"><h3>{service.title}</h3><ArrowUpRight size={24} aria-hidden="true"/></div>
    <p>{service.short}</p>
  </Link>;
}
export function CtaBand() {
  return <section className="container cta-band"><div className="cta-copy"><h2>Hagamos que suceda.</h2><p>Tu idea merece una buena conversación. Cuéntanos qué necesitas y definamos el siguiente paso.</p></div><a href={whatsappUrl("Hola, quiero conversar sobre un proyecto para mi negocio.")} target="_blank" rel="noopener noreferrer" className="button button-primary">Hablemos de tu proyecto <ArrowUpRight size={19} aria-hidden="true"/></a></section>;
}
export function PageIntro({ title, text }: { eyebrow?: string; title: string; text: string }) {
  return <section className="page-intro container"><h1>{title}</h1><p>{text}</p></section>;
}
