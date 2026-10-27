import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  HomeFaq,
  Methodology,
  ServicesBento,
  SolutionsExplorer,
} from "@/components/proposal/interactions";
import { PortfolioPreview } from "@/components/proposal/product-previews";
import { whatsappUrl } from "@/lib/content";

export function RefinedSections() {
  return (
    <>
      <section id="servicios" className="refinement-section">
        <div className="proposal-container">
          <div className="tw:mb-9 tw:grid tw:items-end tw:gap-6 tw:md:grid-cols-[1.15fr_.85fr]">
            <h2 className="refinement-heading">
              Lo que imaginas.
              <br />
              Lo que hacemos.
            </h2>
            <p className="tw:max-w-[450px] tw:text-[18px] tw:leading-relaxed tw:text-muted-foreground">
              De la primera pantalla a los procesos que la sostienen. Una
              solución pensada como un todo.
            </p>
          </div>
          <ServicesBento />
          <div className="tw:mt-6 tw:flex tw:justify-end">
            <Button
              asChild
              variant="link"
              className="tw:min-h-11 tw:px-0 tw:text-[16px] tw:text-[#cbe9ff]"
            >
              <Link href="/servicios">
                Ver todos los servicios <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="portafolio" className="refinement-section tw:bg-[#0a1423]">
        <div className="proposal-container tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <h2 className="refinement-heading">
              Del reto a<br />
              la experiencia.
            </h2>
            <p className="tw:mt-6 tw:max-w-[460px] tw:text-[18px] tw:leading-relaxed tw:text-muted-foreground">
              Estamos preparando casos de estudio para compartir qué había que
              resolver, cómo lo abordamos y qué aprendimos.
            </p>
            <p className="tw:mt-4 tw:max-w-[430px] tw:text-[16px] tw:leading-relaxed tw:text-muted-foreground">
              Mientras tanto, estas interfaces muestran una forma de pensar el
              producto. Los casos se publicarán con materiales y permisos
              verificados.
            </p>
            <Button
              asChild
              className="tw:mt-7 tw:h-12 tw:rounded-full tw:px-6 tw:text-[16px]"
            >
              <Link href="/portafolio">
                Conocer el portafolio <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <figure className="tw:m-0 tw:min-w-0">
            <PortfolioPreview />
            <figcaption className="tw:mt-4 tw:text-[14px] tw:leading-relaxed tw:text-muted-foreground">
              Concepto de interfaz, sin datos de clientes.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="soluciones" className="refinement-section">
        <div className="proposal-container tw:grid tw:gap-10 tw:lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <h2 className="refinement-heading">
              Tu negocio,
              <br />
              en foco.
            </h2>
            <p className="tw:mt-5 tw:max-w-[340px] tw:text-[18px] tw:leading-relaxed tw:text-muted-foreground">
              El mismo cuidado. Distintas formas de resolver lo que importa en
              tu sector.
            </p>
            <Button
              asChild
              variant="link"
              className="tw:mt-5 tw:min-h-11 tw:px-0 tw:text-[16px] tw:text-[#cbe9ff]"
            >
              <Link href="/soluciones">
                Explorar soluciones <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <SolutionsExplorer />
        </div>
      </section>

      <section
        id="metodologia"
        className="refinement-section refinement-compact tw:bg-[#0a1423]"
      >
        <div className="proposal-container tw:grid tw:gap-8 tw:lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <h2 className="refinement-heading">
              Un camino
              <br />
              claro.
            </h2>
            <p className="tw:mt-5 tw:max-w-[350px] tw:text-[17px] tw:leading-relaxed tw:text-muted-foreground">
              Un alcance compartido. Decisiones revisables. Una entrega que
              puedas entender.
            </p>
            <Button
              asChild
              variant="link"
              className="tw:mt-4 tw:min-h-11 tw:px-0 tw:text-[16px] tw:text-[#cbe9ff]"
            >
              <Link href="/nosotros">
                Conoce nuestra metodología <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <Methodology />
        </div>
      </section>

      <section id="preguntas" className="refinement-section refinement-compact">
        <div className="proposal-container tw:grid tw:gap-8 tw:lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <h2 className="refinement-heading">
              Antes de
              <br />
              empezar.
            </h2>
            <p className="tw:mt-5 tw:max-w-[330px] tw:text-[17px] tw:leading-relaxed tw:text-muted-foreground">
              Lo esencial para dar el primer paso con una idea más clara.
            </p>
          </div>
          <HomeFaq />
        </div>
      </section>

      <section id="conversemos" className="refinement-section tw:pt-5">
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
          <div className="tw:relative tw:z-10 tw:max-w-[700px] tw:px-8 tw:py-14 tw:md:px-14 tw:md:py-20">
            <h2 className="refinement-heading">
              Lo que sigue
              <br />
              empieza aquí.
            </h2>
            <p className="tw:mt-5 tw:max-w-[440px] tw:text-[18px] tw:leading-relaxed tw:text-[#c9d9eb]">
              Trae tu idea. Definamos juntos el primer paso para hacerla
              posible.
            </p>
            <div className="tw:mt-8 tw:flex tw:flex-wrap tw:items-center tw:gap-x-7 tw:gap-y-3">
              <Button
                asChild
                className="tw:h-13 tw:rounded-full tw:px-7 tw:text-[16px]"
              >
                <a
                  href={whatsappUrl(
                    "Hola, quiero conversar sobre un proyecto para mi negocio.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conversemos <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
              <Link
                href="/contacto"
                className="tw:inline-flex tw:min-h-12 tw:items-center tw:gap-3 tw:text-[16px] tw:hover:text-[#a8d9ff]"
              >
                Preparar mi solicitud{" "}
                <ArrowUpRight className="tw:size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
