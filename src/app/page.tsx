import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MoveDown, FolderOpen } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  HomeFaq,
  Methodology,
  ServicesBento,
  MethodSignal,
} from "@/components/proposal/interactions";
import { whatsappUrl } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <div data-proposal className="proposal-shell">
      <section className="tw:relative tw:isolate tw:min-h-[790px] tw:overflow-hidden tw:max-sm:min-h-[900px]">
        <div className="cinematic-scene" aria-hidden="true">
          <Image
            src="/images/nexo-threshold.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            unoptimized
          />
        </div>
        <div className="proposal-container tw:relative tw:z-10 tw:flex tw:min-h-[790px] tw:flex-col tw:justify-between tw:pb-10 tw:pt-24 tw:max-sm:min-h-[900px] tw:max-sm:pb-7 tw:max-sm:pt-10">
          <div className="tw:max-w-[670px]">
            <div className="threshold-signal tw:mb-8" aria-hidden="true" />
            <h1 className="tw:text-[clamp(58px,6.8vw,98px)] tw:leading-[1.03] tw:tracking-[-.065em] tw:max-sm:text-[56px]">
              Construye
              <br />
              lo que sigue.
            </h1>
            <p className="tw:mt-7 tw:max-w-[480px] tw:text-[19px] tw:leading-[1.7] tw:text-[#c7d7e9] tw:max-sm:text-[18px]">
              Software, diseño e inteligencia artificial para dar forma a tu
              próxima idea.
            </p>
            <div className="tw:mt-9 tw:flex tw:flex-wrap tw:items-center tw:gap-x-7 tw:gap-y-4">
              <Button
                asChild
                size="lg"
                className="tw:h-13 tw:rounded-full tw:px-7 tw:text-[15px] tw:shadow-none"
              >
                <Link href="/servicios">
                  Explorar servicios{" "}
                  <ArrowUpRight className="tw:size-5" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href={whatsappUrl(
                  "Hola, quiero iniciar un proyecto digital con Nexo Digital Studio.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="tw:inline-flex tw:min-h-12 tw:items-center tw:gap-3 tw:text-[16px] tw:text-[#edf5ff] tw:hover:text-[#a9dfff]"
              >
                Hablemos de tu idea{" "}
                <ArrowRight className="tw:size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="tw:flex tw:items-end tw:justify-between tw:gap-8 tw:max-sm:items-center">
            <p className="tw:max-w-[310px] tw:text-[14px] tw:leading-relaxed tw:text-[#b8cce2]">
              Una visión clara.
              <br />
              Diseño e ingeniería para hacerla realidad.
            </p>
            <a
              href="#servicios"
              className="tw:inline-flex tw:min-h-11 tw:items-center tw:gap-4 tw:text-[14px] tw:text-foreground"
            >
              Explora Nexo <MoveDown className="tw:size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="servicios" className="proposal-section">
        <div className="proposal-container">
          <div className="tw:mb-10 tw:grid tw:items-end tw:gap-6 tw:md:grid-cols-[1.15fr_.85fr]">
            <h2 className="tw:max-w-[620px] tw:text-[clamp(36px,4.2vw,60px)] tw:leading-[1.12]">
              Lo que imaginas.
              <br />
              Lo que hacemos.
            </h2>
            <p className="tw:max-w-[460px] tw:text-[18px] tw:leading-relaxed tw:text-muted-foreground">
              La tecnología es el medio. El punto de partida es lo que tu
              negocio necesita resolver.
            </p>
          </div>
          <ServicesBento />
          <div className="tw:mt-8 tw:flex tw:justify-end">
            <Button
              asChild
              variant="link"
              className="tw:h-12 tw:px-0 tw:text-[16px] tw:text-[#cbe9ff]"
            >
              <Link href="/servicios">
                Ver todos los servicios <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="proposal-section tw:bg-[#0a1423]">
        <div className="proposal-container tw:grid tw:items-center tw:gap-12 tw:lg:grid-cols-[1.1fr_.9fr]">
          <div className="case-art" aria-hidden="true">
            <div className="case-folder">
              <FolderOpen className="tw:size-9 tw:text-[#9ad7ff]" />
              <strong>
                Reto y<br />
                solución.
              </strong>
              <span>Casos de estudio · Próximamente</span>
            </div>
          </div>
          <div>
            <h2 className="tw:text-[clamp(36px,3.8vw,54px)] tw:leading-[1.12]">
              El trabajo habla.
              <br />
              Con contexto.
            </h2>
            <p className="tw:mt-6 tw:text-[18px] tw:leading-relaxed tw:text-muted-foreground">
              Estamos preparando casos de estudio para compartir qué había que
              resolver, cómo lo abordamos y qué aprendimos.
            </p>
            <p className="tw:mt-5 tw:text-[16px] tw:leading-relaxed tw:text-muted-foreground">
              Publicaremos proyectos con sus materiales y permisos verificados.
            </p>
            <Button
              asChild
              variant="outline"
              className="tw:mt-8 tw:h-12 tw:rounded-full tw:border-border tw:bg-transparent tw:px-6 tw:text-[15px] tw:shadow-none"
            >
              <Link href="/portafolio">
                Conocer el portafolio <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="proposal-section">
        <div className="proposal-container tw:grid tw:gap-14 tw:lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <h2 className="tw:text-[clamp(36px,4vw,58px)] tw:leading-[1.12]">
              Claridad en
              <br />
              cada paso.
            </h2>
            <p className="tw:mt-6 tw:max-w-[390px] tw:text-[18px] tw:leading-relaxed tw:text-muted-foreground">
              Avanzamos con un alcance compartido, decisiones revisables y una
              entrega que puedas entender.
            </p>
            <div className="tw:mt-9">
              <MethodSignal />
            </div>
            <Button
              asChild
              variant="link"
              className="tw:mt-6 tw:h-12 tw:px-0 tw:text-[16px] tw:text-[#cbe9ff]"
            >
              <Link href="/nosotros">
                Conoce nuestra metodología <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <Methodology />
        </div>
      </section>

      <section className="proposal-section tw:bg-[#0a1423]">
        <div className="proposal-container tw:grid tw:gap-12 tw:lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <h2 className="tw:text-[clamp(36px,3.8vw,54px)] tw:leading-[1.12]">
              Antes de
              <br />
              dar el paso.
            </h2>
            <p className="tw:mt-6 tw:max-w-[340px] tw:text-[17px] tw:text-muted-foreground">
              Algunas respuestas para empezar con una idea más clara.
            </p>
          </div>
          <HomeFaq />
        </div>
      </section>

      <section className="proposal-section">
        <div className="proposal-container tw:relative tw:overflow-hidden tw:rounded-[24px] tw:bg-[#112b48] tw:px-8 tw:py-14 tw:md:px-16 tw:md:py-20">
          <div className="tw:grid tw:items-center tw:gap-9 tw:lg:grid-cols-[1.25fr_.75fr]">
            <div>
              <h2 className="tw:max-w-[650px] tw:text-[clamp(36px,4.5vw,64px)] tw:leading-[1.1]">
                Tu idea
                <br />
                empieza aquí.
              </h2>
              <p className="tw:mt-6 tw:max-w-[490px] tw:text-[18px] tw:leading-relaxed tw:text-[#c3d7ed]">
                Cuéntanos qué estás imaginando. Conectemos los puntos y
                encontremos una forma de hacerlo posible.
              </p>
            </div>
            <div className="tw:lg:justify-self-end">
              <Button
                asChild
                size="lg"
                className="tw:h-14 tw:rounded-full tw:bg-[#e0f1ff] tw:px-7 tw:text-[16px] tw:text-[#0b1a2b] tw:hover:bg-white"
              >
                <a
                  href={whatsappUrl(
                    "Hola, quiero conversar sobre un proyecto para mi negocio.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hablemos de tu proyecto{" "}
                  <ArrowUpRight className="tw:size-5" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
