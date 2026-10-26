"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Blocks,
  MoveRight,
  Sparkles,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn/tabs";
import { Card, CardContent } from "@/components/shadcn/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/shadcn/accordion";
import { processSteps } from "@/lib/content";
const groups = [
  {
    id: "web",
    label: "Web y apps",
    lead: {
      title: "Tu marca merece su lugar.",
      text: "Sitios y experiencias digitales donde claridad, diseño y tecnología trabajan juntos.",
      href: "/servicios/sitios-corporativos",
    },
    secondary: {
      title: "De la pantalla a la acción.",
      text: "Aplicaciones que conectan tus servicios con las personas.",
      href: "/servicios/aplicaciones-moviles",
    },
    small: {
      title: "Una oferta. Un objetivo.",
      text: "Landing pages enfocadas en tu siguiente lanzamiento.",
      href: "/servicios/landing-pages",
    },
  },
  {
    id: "software",
    label: "Sistemas",
    lead: {
      title: "Software que sigue tu ritmo.",
      text: "Herramientas a medida para ordenar la operación y gestionar información.",
      href: "/servicios/sistemas-web",
    },
    secondary: {
      title: "Todo conectado.",
      text: "APIs e integraciones para que tus herramientas trabajen juntas.",
      href: "/servicios/integraciones",
    },
    small: {
      title: "Calidad desde el inicio.",
      text: "Auditoría y QA para validar los recorridos que importan.",
      href: "/servicios/auditoria-qa",
    },
  },
  {
    id: "ia",
    label: "IA y flujos",
    lead: {
      title: "Más tiempo para lo importante.",
      text: "Automatizaciones con n8n que conectan procesos y reducen pasos manuales.",
      href: "/servicios/automatizacion",
    },
    secondary: {
      title: "Inteligencia aplicada.",
      text: "Asistentes e IA con objetivos, límites y evaluación.",
      href: "/servicios/inteligencia-artificial",
    },
    small: {
      title: "Bases para crecer.",
      text: "SEO técnico, rendimiento y una experiencia más clara.",
      href: "/servicios/seo",
    },
  },
];
export function ServicesBento() {
  return (
    <Tabs defaultValue="web" className="tw:gap-8">
      <TabsList
        aria-label="Familias de servicios"
        className="tw:h-12 tw:max-w-full tw:rounded-full tw:bg-secondary tw:p-1"
      >
        {groups.map((group) => (
          <TabsTrigger
            key={group.id}
            value={group.id}
            className="tw:h-10 tw:rounded-full tw:px-5 tw:text-[14px] tw:text-muted-foreground tw:data-[state=active]:bg-[#dcefff] tw:data-[state=active]:text-[#0b1a2c] tw:dark:data-[state=active]:bg-[#dcefff] tw:dark:data-[state=active]:text-[#0b1a2c] tw:max-sm:px-4"
          >
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map((group) => (
        <TabsContent key={group.id} value={group.id}>
          <div className="tw:grid tw:grid-cols-12 tw:gap-5">
            <Card className="proposal-grid-card tw:col-span-12 tw:gap-0 tw:overflow-hidden tw:rounded-2xl tw:p-0 tw:lg:col-span-7 tw:lg:row-span-2">
              <Link
                href={group.lead.href}
                className="tw:flex tw:h-full tw:flex-col"
              >
                <CardContent className="tw:p-8 tw:md:p-10">
                  <h3 className="tw:max-w-[470px] tw:text-[clamp(30px,3vw,44px)] tw:leading-[1.12]">
                    {group.lead.title}
                  </h3>
                  <p className="tw:mt-5 tw:max-w-[430px] tw:text-[17px] tw:leading-relaxed tw:text-muted-foreground">
                    {group.lead.text}
                  </p>
                </CardContent>
                <div
                  className="bento-art tw:mt-auto tw:md:min-h-[235px]"
                  aria-hidden="true"
                >
                  <div className="bento-panels" />
                </div>
              </Link>
            </Card>
            <Card className="proposal-grid-card tw:col-span-12 tw:gap-0 tw:rounded-2xl tw:p-0 tw:lg:col-span-5">
              <Link
                href={group.secondary.href}
                className="tw:block tw:h-full tw:p-8"
              >
                <div className="tw:flex tw:items-start tw:justify-between tw:gap-6">
                  <h3 className="tw:max-w-[320px] tw:text-[28px] tw:leading-tight">
                    {group.secondary.title}
                  </h3>
                  <ArrowUpRight
                    className="tw:size-5 tw:text-[#93cfff]"
                    aria-hidden="true"
                  />
                </div>
                <p className="tw:mt-4 tw:text-[16px] tw:text-muted-foreground">
                  {group.secondary.text}
                </p>
                <div className="bento-network" aria-hidden="true">
                  <span>
                    <Blocks className="tw:mx-auto tw:size-7" />
                  </span>
                  <MoveRight className="tw:size-5 tw:text-[#72b8ff]" />
                  <span>Experiencia</span>
                  <MoveRight className="tw:size-5 tw:text-[#72b8ff]" />
                  <span>Conexión</span>
                </div>
              </Link>
            </Card>
            <Card className="proposal-grid-card tw:col-span-12 tw:gap-0 tw:rounded-2xl tw:bg-[#10243c] tw:p-0 tw:lg:col-span-5">
              <Link
                href={group.small.href}
                className="tw:flex tw:items-start tw:gap-5 tw:p-8"
              >
                <div>
                  <h3 className="tw:text-[25px] tw:leading-tight">
                    {group.small.title}
                  </h3>
                  <p className="tw:mt-3 tw:text-[16px] tw:text-muted-foreground">
                    {group.small.text}
                  </p>
                  <span className="tw:mt-5 tw:inline-flex tw:items-center tw:gap-3 tw:text-[14px] tw:text-[#d0eaff]">
                    Conocer servicio{" "}
                    <ArrowRight className="tw:size-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
const triggerStyle =
  "tw:items-center tw:rounded-none tw:border-0 tw:bg-transparent tw:py-6 tw:text-[22px] tw:leading-[1.4] tw:tracking-[-.035em] tw:text-foreground tw:hover:text-[#9bd8ff] tw:hover:no-underline tw:max-sm:text-[20px]";
export function Methodology() {
  return (
    <Accordion
      type="multiple"
      defaultValue={["Descubrimiento"]}
      className="proposal-method"
    >
      {processSteps.map((step) => (
        <AccordionItem
          key={step.title}
          value={step.title}
          className="method-step tw:border-0 tw:rounded-none tw:bg-transparent tw:p-0"
        >
          <AccordionTrigger className={triggerStyle}>
            <span>{step.title}</span>
          </AccordionTrigger>
          <AccordionContent className="tw:text-[16px] tw:leading-[1.8]">
            <p className="tw:max-w-[530px] tw:pb-3 tw:pr-6 tw:pt-0 tw:text-muted-foreground">
              {step.text}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
const questions = [
  [
    "¿Por dónde empezamos?",
    "Con una conversación sobre tu negocio, tus usuarios y lo que necesitas resolver. A partir de ahí definimos el alcance y la propuesta.",
  ],
  [
    "¿Trabajan con nuevos negocios?",
    "Sí. Podemos comenzar con una landing page o una solución de alcance acotado y plantear su evolución según las necesidades del negocio.",
  ],
  [
    "¿Cómo se define el precio?",
    "Depende del alcance, las funciones, las integraciones y los materiales disponibles. La cotización se prepara después de revisar esos requisitos.",
  ],
  [
    "¿Pueden mejorar una aplicación existente?",
    "Podemos revisar su estado, detectar prioridades y proponer mejoras de diseño, desarrollo, automatización o calidad de software.",
  ],
  [
    "¿Cómo solicito una cotización?",
    "Desde Contacto puedes preparar tu solicitud por WhatsApp. El mensaje se abre para que lo revises y lo envíes; no se envía automáticamente.",
  ],
];
export function HomeFaq() {
  return (
    <Accordion type="single" collapsible className="proposal-faq">
      {questions.map(([question, answer]) => (
        <AccordionItem key={question} value={question} className="tw:border-0">
          <AccordionTrigger className={triggerStyle}>
            {question}
          </AccordionTrigger>
          <AccordionContent className="tw:text-[16px] tw:leading-[1.8]">
            <p className="tw:max-w-[720px] tw:pb-3 tw:pr-6 tw:text-muted-foreground">
              {answer}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
export function MethodSignal() {
  return (
    <div className="tw:flex tw:items-center tw:gap-4 tw:text-[#a8d9ff]">
      <Sparkles className="tw:size-6" aria-hidden="true" />
      <span className="tw:text-[15px]">
        Pensado con claridad. Construido con criterio.
      </span>
    </div>
  );
}
