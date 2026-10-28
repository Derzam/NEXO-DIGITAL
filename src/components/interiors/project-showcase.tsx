import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, ChartNoAxesCombined, ShoppingBag, ShoppingCart, Smartphone, Store, Truck, UsersRound, Warehouse } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { whatsappUrl } from "@/lib/content";
import styles from "./project-showcase.module.css";

const projects = [
  {
    id: "orventi",
    name: "ORVENTI",
    category: "Sistema web empresarial",
    subtitle: "Gestión empresarial para negocios y bodegas.",
    description: "Ejemplo de una plataforma administrativa que integra inventario, compras, ventas, clientes y control de bodegas en una misma experiencia digital.",
    image: "/images/projects/orventi.webp",
    imageHeight: 757,
    alt: "Pantalla de inventario y Kardex valorizado de ORVENTI Demo",
    note: "Captura del entorno Demo, con datos de prueba.",
    features: [[Boxes, "Control de inventario"], [ShoppingCart, "Compras y ventas"], [Warehouse, "Gestión de bodegas"], [UsersRound, "Clientes y proveedores"], [ChartNoAxesCombined, "Reportes administrativos"]] as const,
    cta: "Solicitar un sistema similar",
    message: "Hola, quiero solicitar un sistema web empresarial similar a ORVENTI para mi negocio.",
  },
  {
    id: "llevaki",
    name: "LlevaKí",
    category: "Plataforma digital",
    subtitle: "Tu ciudad, más cerca de lo que necesitas.",
    description: "Referencia de una plataforma que conecta comercios, clientes y repartidores mediante una experiencia digital integrada.",
    image: "/images/projects/llevaki.webp",
    imageHeight: 765,
    alt: "Página de LlevaKí con una muestra de la experiencia móvil de pedidos",
    note: "Captura de referencia; nombres y valoraciones de demostración.",
    features: [[Store, "Exploración de comercios"], [ShoppingBag, "Experiencia de pedidos"], [UsersRound, "Accesos para negocios"], [Smartphone, "Interfaces móviles"], [Truck, "Gestión de entregas"]] as const,
    cta: "Solicitar una plataforma similar",
    message: "Hola, quiero solicitar una plataforma web y aplicaciones móviles similares a LlevaKí para mi negocio.",
  },
];

function ProjectImage({ project }: { project: (typeof projects)[number] }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.device}>
        <div className={styles.deviceScreen}>
          <Image src={project.image} alt={project.alt} width={1600} height={project.imageHeight} sizes="(max-width: 1023px) 90vw, (max-width: 1279px) 44vw, 560px" />
        </div>
      </div>
      <figcaption>{project.note}</figcaption>
    </figure>
  );
}

export function ProjectShowcase({ variant = "services" }: { variant?: "services" | "portfolio" }) {
  const isServices = variant === "services";
  return (
    <section id={isServices ? "proyectos-referencia" : undefined} className={styles.section} aria-labelledby={isServices ? "showcase-title" : "portfolio-reference-title"}>
      <div className="proposal-container">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{isServices ? "Proyectos tecnológicos de referencia" : "Referencias de producto"}</p>
          <h2 id={isServices ? "showcase-title" : "portfolio-reference-title"}>{isServices ? "Sistemas web y aplicaciones a medida" : "Tecnología en contexto."}</h2>
          <p>{isServices ? "Desarrollamos soluciones digitales adaptadas a las necesidades de cada negocio, desde sistemas empresariales hasta plataformas y aplicaciones móviles." : "Dos referencias que muestran cómo una idea puede tomar forma en una interfaz y un producto digital."}</p>
        </div>
        <div className={isServices ? styles.grid : styles.portfolioGrid}>
          {projects.map(project => (
            <article key={project.id} className={`${styles.card} ${project.id === "llevaki" ? styles.violet : styles.cyan} ${!isServices ? styles.compact : ""}`}>
              <div className={styles.cardHeader}>
                <p className={styles.category}>{project.category}</p>
                <h3>{project.name}</h3>
                <p className={styles.subtitle}>{project.subtitle}</p>
                {isServices && <p className={styles.description}>{project.description}</p>}
              </div>
              <ProjectImage project={project} />
              {isServices ? <>
                <ul className={styles.features} aria-label={`Capacidades de referencia de ${project.name}`}>
                  {project.features.map(([Icon, label]) => <li key={label}><Icon size={18} aria-hidden="true" /><span>{label}</span></li>)}
                </ul>
                <Button asChild className={`${styles.cta} tw:h-auto tw:min-h-12 tw:whitespace-normal tw:text-left`}>
                  <a href={whatsappUrl(project.message)} target="_blank" rel="noopener noreferrer">{project.cta}<ArrowRight aria-hidden="true" /></a>
                </Button>
              </> : <Link className={styles.more} href="/servicios#proyectos-referencia">Ver referencias en servicios <ArrowRight size={18} aria-hidden="true" /></Link>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
