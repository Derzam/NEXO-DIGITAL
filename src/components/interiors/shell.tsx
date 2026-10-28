import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { whatsappUrl } from "@/lib/content";

export function InteriorShell({ children }: { children: ReactNode }) {
  return (
    <div data-proposal className="proposal-shell interior-shell">
      {children}
    </div>
  );
}

export function InteriorIntro({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section className="interior-intro">
      <div
        className={
          "proposal-container" + (children ? " interior-intro-grid" : "")
        }
      >
        <div>
          <h1>{title}</h1>
          <p className="interior-lead">{text}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export function InteriorBreadcrumb({
  title,
  services = false,
}: {
  title: string;
  services?: boolean;
}) {
  return (
    <nav aria-label="Ruta de navegación" className="interior-breadcrumb">
      <Link href="/">Inicio</Link>
      <ChevronRight size={14} aria-hidden="true" />
      {services ? (
        <>
          <Link href="/servicios">Servicios</Link>
          <ChevronRight size={14} aria-hidden="true" />
        </>
      ) : null}
      <span aria-current="page">{title}</span>
    </nav>
  );
}

export function InteriorCta() {
  return (
    <section className="interior-section">
      <div className="proposal-container refinement-cta">
        <div className="refinement-cta-scene" aria-hidden="true">
          <Image
            src="/images/nexo-threshold.webp"
            alt=""
            fill
            unoptimized
            sizes="100vw"
          />
        </div>
        <div className="interior-cta-copy">
          <h2>
            Lo que sigue
            <br />
            empieza aquí.
          </h2>
          <p>
            Tu idea merece una buena conversación. Cuéntanos qué necesitas y
            definamos el siguiente paso.
          </p>
          <Button
            asChild
            className="tw:mt-7 tw:h-13 tw:rounded-full tw:px-6 tw:text-[16px]"
          >
            <a
              href={whatsappUrl(
                "Hola, quiero conversar sobre un proyecto para mi negocio.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar proyecto{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
