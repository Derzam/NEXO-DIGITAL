import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InteriorIntro, InteriorShell } from "@/components/interiors/shell";
import { Button } from "@/components/shadcn/button";

export default function NotFound() {
  return <InteriorShell>
    <InteriorIntro title="Esta página no existe." text="Puede que el enlace haya cambiado o que la dirección sea incorrecta." />
    <section className="interior-section interior-catalog"><div className="proposal-container"><Button asChild className="tw:h-13 tw:rounded-full tw:px-6 tw:text-[16px]"><Link href="/"><ArrowLeft size={18} aria-hidden="true" /> Volver al inicio</Link></Button></div></section>
  </InteriorShell>;
}
