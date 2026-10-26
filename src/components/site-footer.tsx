import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site-header";
import { services, whatsappUrl } from "@/lib/content";
export function SiteFooter(){return <footer className="site-footer"><div className="container">
  <div className="footer-top"><div className="footer-brand"><Logo/><p>Diseño e ingeniería.<br/>Una misma dirección.</p><span>Ecuador · Conexiones sin fronteras</span></div>
  <nav className="footer-column" aria-label="Explora Nexo"><h2>Explora</h2><div className="footer-links"><Link href="/">Inicio</Link><Link href="/servicios">Servicios</Link><Link href="/soluciones">Soluciones</Link><Link href="/portafolio">Portafolio</Link><Link href="/nosotros">Nosotros</Link><Link href="/blog">Blog</Link></div></nav>
  <nav className="footer-column" aria-label="Servicios destacados"><h2>Qué hacemos</h2><div className="footer-links">{services.slice(0,5).map(s=><Link key={s.slug} href={"/servicios/"+s.slug}>{s.title}</Link>)}</div></nav>
  <div className="footer-column"><h2>Conversemos</h2><div className="footer-links"><Link href="/contacto">Solicitar cotización</Link><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={17} aria-hidden="true"/></a><span>Atención online</span></div></div></div>
  <p className="footer-signature" aria-hidden="true">Todo empieza<br/>con una conexión.</p>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} Nexo Digital Studio</span><span>Ideas conectadas. Soluciones reales.</span></div>
</div></footer>}
