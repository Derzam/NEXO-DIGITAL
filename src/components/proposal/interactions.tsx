"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check } from "lucide-react";
import {
  ProductPreview,
  CompanionPreview,
  DeliveryPreview,
} from "@/components/proposal/product-previews";
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
] as const;
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
                <div className="tw:mx-6 tw:mb-6 tw:mt-auto tw:md:mx-8 tw:md:mb-8">
                  <ProductPreview family={group.id} />
                </div>
              </Link>
            </Card>
            <Card className="proposal-grid-card tw:col-span-12 tw:gap-0 tw:rounded-2xl tw:p-0 tw:lg:col-span-5">
              <Link
                href={group.secondary.href}
                className="tw:flex tw:h-full tw:flex-col"
              >
                <div className="tw:p-7">
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
                </div>
                <div className="tw:mx-6 tw:mb-6 tw:mt-auto">
                  <CompanionPreview family={group.id} />
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
                  <DeliveryPreview family={group.id} />
                </div>
              </Link>
            </Card>
          </div>
        </TabsContent>
      ))}
      <p className="tw:text-[14px] tw:leading-relaxed tw:text-muted-foreground">
        Conceptos de diseño y exploración. Datos ficticios, sin clientes ni productos entregados.
      </p>
    </Tabs>
  );
}
const triggerStyle =
  "tw:items-center tw:rounded-none tw:border-0 tw:bg-transparent tw:py-4 tw:text-[20px] tw:leading-[1.4] tw:tracking-[-.035em] tw:text-foreground tw:hover:text-[#9bd8ff] tw:hover:no-underline tw:max-sm:text-[18px]";
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
const solutions = [
  {
    id: "commerce",
    label: "Comercios",
    title: (
      <>
        Del catálogo
        <br />
        al pedido.
      </>
    ),
    description:
      "Una presencia digital que ayuda a encontrar tu oferta y dar el siguiente paso.",
    items: [
      "Catálogos y canales de contacto",
      "Pedidos e inventario, según tu alcance",
    ],
    flow: ["Tu oferta", "La consulta", "La atención"],
  },
  {
    id: "professionals",
    label: "Profesionales",
    title: (
      <>
        De la consulta
        <br />a la cita.
      </>
    ),
    description:
      "Servicios bien explicados y una experiencia clara para organizar la atención.",
    items: [
      "Sitio profesional y solicitud de citas",
      "Agenda e integración con tus canales",
    ],
    flow: ["Tu servicio", "La reserva", "La agenda"],
  },
  {
    id: "teams",
    label: "Equipos",
    title: (
      <>
        Menos pasos.
        <br />
        Más contexto.
      </>
    ),
    description:
      "Herramientas internas que siguen el proceso de tu equipo y conectan su información.",
    items: [
      "Gestión, roles e información compartida",
      "Integraciones y automatización de procesos",
    ],
    flow: ["La solicitud", "El proceso", "El seguimiento"],
  },
];

export function SolutionsExplorer() {
  return (
    <Tabs defaultValue="commerce" className="tw:gap-7">
      <TabsList
        aria-label="Soluciones por negocio"
        className="tw:h-12 tw:max-w-full tw:flex-nowrap tw:justify-start tw:gap-1 tw:rounded-lg tw:bg-transparent tw:p-0 tw:group-data-[orientation=horizontal]/tabs:h-12"
      >
        {solutions.map((solution) => (
          <TabsTrigger
            key={solution.id}
            value={solution.id}
            className="tw:h-11 tw:flex-none tw:rounded-lg tw:px-4 tw:text-[14px] tw:data-[state=active]:bg-[#dcefff] tw:data-[state=active]:text-[#0b1a2c] tw:dark:data-[state=active]:bg-[#dcefff] tw:dark:data-[state=active]:text-[#0b1a2c] tw:sm:text-[16px] tw:max-sm:px-3"
          >
            {solution.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {solutions.map((solution) => (
        <TabsContent key={solution.id} value={solution.id}>
          <div className="solution-layout">
            <div>
              <h3 className="tw:text-[clamp(32px,3.2vw,44px)] tw:leading-[1.15]">
                {solution.title}
              </h3>
              <p className="tw:mt-5 tw:max-w-[530px] tw:text-[18px] tw:leading-relaxed tw:text-muted-foreground">
                {solution.description}
              </p>
              <ul className="tw:mt-6 tw:grid tw:list-none tw:gap-3 tw:p-0">
                {solution.items.map((item) => (
                  <li
                    className="tw:flex tw:items-start tw:gap-3 tw:text-[16px] tw:text-[#c4d6ea]"
                    key={item}
                  >
                    <Check
                      className="tw:mt-1 tw:size-4 tw:shrink-0 tw:text-[#94ceff]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="solution-chain" aria-label="Recorrido propuesto">
              {solution.flow.map((step, index) => (
                <div key={step}>
                  <span>{step}</span>
                  {index < 2 ? (
                    <ArrowRight size={20} aria-hidden="true" />
                  ) : (
                    <Check size={20} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
