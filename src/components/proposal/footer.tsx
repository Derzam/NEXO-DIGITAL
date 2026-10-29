import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NexoWordmark } from "@/components/nexo-wordmark";
import { whatsappUrl } from "@/lib/content";
export function ProposalFooter() {
  return (
    <footer
      data-proposal
      className="proposal-shell tw:bg-[#050b15] tw:pb-8 tw:pt-16"
    >
      <div className="proposal-container">
        <div className="tw:grid tw:gap-12 tw:md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="Nexo Digital Studio — inicio"
              className="tw:inline-flex tw:items-center tw:gap-3 tw:text-[23px] tw:tracking-[-.04em]"
            >
              <NexoWordmark className="tw:w-[240px] tw:max-sm:w-[220px]" />
            </Link>
            <p className="tw:mt-6 tw:max-w-[330px] tw:text-[17px] tw:leading-relaxed tw:text-muted-foreground">
              Diseño, software e inteligencia artificial para lo que viene.
            </p>
          </div>
          <nav
            aria-label="Explora Nexo"
            className="tw:grid tw:grid-cols-2 tw:content-start tw:gap-x-5 tw:gap-y-3 tw:text-[15px] tw:text-muted-foreground"
          >
            {[
              ["/servicios", "Servicios"],
              ["/soluciones", "Soluciones"],
              ["/nosotros", "Nosotros"],
              ["/portafolio", "Portafolio"],
              ["/#resenas", "Reseñas"],
              ["/blog", "Blog"],
              ["/contacto", "Contacto"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="tw:py-1 tw:hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div>
            <p className="tw:text-[16px] tw:text-foreground">
              La próxima conexión empieza aquí.
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="tw:mt-5 tw:inline-flex tw:min-h-11 tw:items-center tw:gap-3 tw:text-[18px] tw:text-[#b7e1ff]"
            >
              Cotizar proyecto{" "}
              <ArrowUpRight className="tw:size-5" aria-hidden="true" />
            </a>
            <p className="tw:mt-3 tw:text-[14px] tw:text-muted-foreground">
              Ecuador · Atención online
            </p>
          </div>
        </div>
        <div className="tw:mt-16 tw:flex tw:flex-wrap tw:justify-between tw:gap-5 tw:text-[13px] tw:text-muted-foreground">
          <span>© {new Date().getFullYear()} Nexo Digital Studio</span>
          <span>Construido con visión. Hecho a medida.</span>
        </div>
      </div>
    </footer>
  );
}
