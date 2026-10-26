import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, WhatsAppFloat } from "@/components/site-header";
import { brand, siteUrl } from "@/lib/content";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:"Nexo Digital Studio | Soluciones digitales a medida",template:"%s | Nexo Digital Studio"},description:"Desarrollamos páginas web, sistemas empresariales, aplicaciones móviles, automatizaciones e inteligencia artificial para negocios en Ecuador.",applicationName:brand,openGraph:{type:"website",locale:"es_EC",siteName:brand,title:"Nexo Digital Studio | Soluciones digitales a medida",description:"Desarrollo web, apps, sistemas e inteligencia artificial para empresas y emprendedores."},robots:{index:true,follow:true}};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#081221"};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body><SiteHeader/><main id="contenido">{children}</main><SiteFooter/><WhatsAppFloat/></body></html>}
