"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { navigationCurrent } from "@/lib/premium-routes";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/shadcn/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/shadcn/sheet";
import { NexoWordmark } from "@/components/nexo-wordmark";
import { whatsappUrl } from "@/lib/content";
const links = [
  ["/", "Inicio"],
  ["/servicios", "Servicios"],
  ["/soluciones", "Soluciones"],
  ["/portafolio", "Portafolio"],
  ["/nosotros", "Nosotros"],
  ["/blog", "Blog"],
  ["/contacto", "Contacto"],
];
export function ProposalBrand() {
  return (
    <Link
      href="/"
      aria-label="Nexo Digital Studio — inicio"
      className="tw:inline-flex tw:items-center tw:gap-3 tw:text-foreground"
    >
      <NexoWordmark eager />
    </Link>
  );
}
export function ProposalHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header
      data-proposal
      className="proposal-shell tw:sticky tw:top-0 tw:z-40 tw:bg-background/95"
    >
      <div className="proposal-container tw:flex tw:min-h-[88px] tw:items-center tw:justify-between tw:gap-5 tw:max-sm:min-h-[76px]">
        <ProposalBrand />
        <NavigationMenu
          viewport={false}
          aria-label="Navegación principal"
          className="tw:hidden tw:xl:flex"
        >
          <NavigationMenuList className="tw:m-0 tw:gap-0 tw:p-0">
            {links.map(([href, label]) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink
                  asChild
                  active={!!navigationCurrent(pathname, href)}
                  className="tw:rounded-md tw:px-3 tw:py-3 tw:text-[14px] tw:text-muted-foreground tw:transition-colors tw:hover:bg-transparent tw:hover:text-foreground tw:focus:bg-transparent tw:data-[active=true]:bg-transparent tw:data-[active=true]:text-foreground"
                >
                  <Link
                    href={href}
                    aria-current={navigationCurrent(pathname, href)}
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="tw:flex tw:items-center tw:gap-2">
          <Button
            asChild
            className="tw:hidden tw:h-11 tw:rounded-full tw:px-5 tw:text-[14px] tw:xl:inline-flex"
          >
            <a
              href={whatsappUrl(
                "Hola, quiero cotizar un proyecto con Nexo Digital Studio.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar proyecto <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="tw:size-11 tw:p-0 tw:text-foreground tw:xl:hidden"
          >
            <a
              aria-label="Escribir por WhatsApp"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="tw:size-5" aria-hidden="true" />
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                className="tw:size-11 tw:p-0 tw:xl:hidden"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={open}
              >
                <Menu className="tw:size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              showCloseButton={false}
              className="proposal-shell tw:z-[150] tw:w-[min(90vw,400px)] tw:border-border tw:p-7 tw:sm:max-w-[400px]"
              aria-describedby="proposal-menu-description"
            >
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-5">
                <SheetTitle className="tw:text-[24px] tw:font-medium">
                  Explora Nexo
                </SheetTitle>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="tw:size-11 tw:p-0"
                    aria-label="Cerrar menú"
                    aria-expanded={open}
                  >
                    <X className="tw:size-5" aria-hidden="true" />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription
                id="proposal-menu-description"
                className="tw:text-[15px]"
              >
                Diseño, software e ideas que avanzan.
              </SheetDescription>
              <nav
                aria-label="Navegación móvil"
                className="tw:mt-6 tw:grid tw:gap-2"
              >
                {links.map(([href, label]) => (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      aria-current={navigationCurrent(pathname, href)}
                      className="tw:rounded-lg tw:px-3 tw:py-3 tw:text-[20px] tw:text-foreground tw:hover:bg-accent"
                    >
                      {label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <Button asChild className="tw:mt-auto tw:h-12 tw:text-[15px]">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conversemos <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
