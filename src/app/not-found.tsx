import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound(){return <section className="container not-found-page section"><h1>Esta página no existe.</h1><p>Puede que el enlace haya cambiado o que la dirección sea incorrecta.</p><Link className="button button-primary" href="/"><ArrowLeft size={18} aria-hidden="true"/> Volver al inicio</Link></section>}
