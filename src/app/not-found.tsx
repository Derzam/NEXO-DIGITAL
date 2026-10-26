import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound(){return <section className="container page-intro" style={{textAlign:"center",minHeight:470}}><span className="eyebrow">ERROR 404</span><h1 style={{marginInline:"auto"}}>Esta página no existe.</h1><p style={{marginInline:"auto",marginBottom:30}}>Puede que el enlace haya cambiado o que la dirección sea incorrecta.</p><Link className="button button-primary" href="/"><ArrowLeft size={16}/> Volver al inicio</Link></section>}
