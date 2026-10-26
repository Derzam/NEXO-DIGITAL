import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site-header";
import { services, whatsappUrl } from "@/lib/content";
export function SiteFooter(){return <footer className="site-footer">
 <div className="container footer-top">
  <div className="footer-brand"><Logo/><p>Diseñamos y desarrollamos soluciones digitales que conectan ideas, tecnología y negocios.</p></div>
  <div><h3 className="footer-heading">EXPLORA</h3><div className="footer-links"><Link href="/">Inicio</Link><Link href="/servicios">Servicios</Link><Link href="/soluciones">Soluciones</Link><Link href="/portafolio">Portafolio</Link><Link href="/nosotros">Nosotros</Link></div></div>
  <div><h3 className="footer-heading">SERVICIOS</h3><div className="footer-links">{services.slice(0,5).map(s=><Link key={s.slug} href={"/servicios/"+s.slug}>{s.title}</Link>)}</div></div>
  <div><h3 className="footer-heading">CONTACTO</h3><div className="footer-links"><Link href="/contacto">Solicitar cotización</Link><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={12}/></a><Link href="/blog">Blog y recursos</Link><span>Ecuador · Atención digital</span></div></div>
 </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Nexo Digital Studio. Todos los derechos reservados.</span><span>Diseño y tecnología con propósito.</span></div>
 </footer>}
