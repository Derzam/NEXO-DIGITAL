import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ProposalFooter } from "@/components/proposal/footer";
import { ProposalHeader } from "@/components/proposal/header";
import { brand, siteUrl } from "@/lib/content";
import { DM_Sans, Manrope } from "next/font/google";
import "../styles/app.css";
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:"Nexo Digital Studio | Soluciones digitales a medida",template:"%s | Nexo Digital Studio"},description:"Desarrollamos páginas web, sistemas empresariales, aplicaciones móviles, automatizaciones e inteligencia artificial para negocios en Ecuador.",applicationName:brand,openGraph:{type:"website",locale:"es_EC",siteName:brand,title:"Nexo Digital Studio | Soluciones digitales a medida",description:"Desarrollo web, apps, sistemas e inteligencia artificial para empresas y emprendedores."},verification:{google:"_giaGOSE7_ORb7c3inf8k_JPfYCygYD1uX8kLg30XA8"},robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true }};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#081221"};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className="dark">
    <body className={`${dmSans.variable} ${manrope.variable}`}>
      <a className="skip-link" href="#contenido" tabIndex={0}>Saltar al contenido</a>
      <ProposalHeader />
      <main id="contenido" tabIndex={-1}>{children}</main>
      <ProposalFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: brand, url: siteUrl, logo: new URL("/images/nexo-wordmark.webp", siteUrl).toString() }).replace(/</g, "\\u003c") }} />
      <Analytics />
    </body>
  </html>;
}
