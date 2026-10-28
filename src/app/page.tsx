import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MoveDown } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { RefinedSections } from "@/components/proposal/refined-sections";
import { whatsappUrl } from "@/lib/content";
export const metadata = pageMetadata("/", "Páginas web y software a medida en Ecuador | Nexo Digital Studio", "Diseñamos páginas web, sistemas empresariales, aplicaciones móviles y soluciones de inteligencia artificial para negocios en Ecuador.");

export default function Home() {
  return (
    <div data-proposal className="proposal-shell">
      <section className="tw:relative tw:isolate tw:min-h-[790px] tw:overflow-hidden tw:max-sm:min-h-[790px]">
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
        <div className="proposal-container tw:relative tw:z-10 tw:flex tw:min-h-[790px] tw:flex-col tw:justify-between tw:pb-10 tw:pt-24 tw:max-sm:min-h-[790px] tw:max-sm:pb-7 tw:max-sm:pt-10">
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
                Cotizar proyecto{" "}
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

      <RefinedSections />
    </div>
  );
}
