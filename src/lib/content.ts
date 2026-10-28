export type Service = {
  slug: string;
  title: string;
  short: string;
  eyebrow: string;
  icon: "globe" | "code" | "smartphone" | "bot" | "workflow" | "shield" | "search" | "store" | "network";
  bullets: string[];
  description: string;
  deliverables: string[];
};

export const brand = "Nexo Digital Studio";
export const whatsappNumber = "593984447960";
export const whatsappUrl = (message = "Hola, quiero información sobre los servicios de Nexo Digital Studio.") =>
  "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);

const canonicalUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : undefined);
if (process.env.VERCEL_ENV === "production" && (!canonicalUrl || new URL(canonicalUrl).protocol !== "https:")) {
  throw new Error("Set NEXT_PUBLIC_SITE_URL to the approved HTTPS production domain, or expose VERCEL_PROJECT_PRODUCTION_URL.");
}
export const siteUrl = canonicalUrl || "http://localhost:3000";

export const services: Service[] = [
  {
    slug: "landing-pages",
    title: "Landing pages",
    short: "Páginas enfocadas en presentar tu oferta y convertir visitas en oportunidades.",
    eyebrow: "Presencia digital",
    icon: "globe",
    bullets: ["Diseño orientado a conversión", "Adaptación a móviles", "Botones de contacto y formularios"],
    description: "Diseñamos páginas de aterrizaje claras, rápidas y alineadas con los objetivos de tu negocio. Cada proyecto parte de un mensaje comercial concreto y una experiencia optimizada para distintos dispositivos.",
    deliverables: ["Diseño responsive", "Secciones comerciales personalizadas", "Integración de contacto", "Configuración SEO básica"]
  },
  {
    slug: "sitios-corporativos",
    title: "Sitios web corporativos",
    short: "Sitios multipágina que transmiten confianza y explican tus servicios.",
    eyebrow: "Presencia digital",
    icon: "store",
    bullets: ["Arquitectura multipágina", "Portafolio y catálogo", "Contenido optimizado"],
    description: "Construimos experiencias web profesionales para empresas y profesionales que necesitan mostrar su propuesta de valor, servicios, proyectos y canales de comunicación.",
    deliverables: ["Páginas de servicios", "Navegación responsive", "Metadatos y estructura SEO", "Preparación para dominio personalizado"]
  },
  {
    slug: "sistemas-web",
    title: "Sistemas web a medida",
    short: "Plataformas empresariales para ordenar procesos y gestionar información.",
    eyebrow: "Software empresarial",
    icon: "code",
    bullets: ["Paneles administrativos", "Roles y permisos", "Bases de datos e integraciones"],
    description: "Diseñamos sistemas adaptados al flujo operativo de cada empresa: paneles de control, inventarios, CRM, reservas y gestión interna, con alcance definido en el análisis inicial.",
    deliverables: ["Levantamiento de requerimientos", "Arquitectura y desarrollo", "Pruebas y validación", "Documentación de entrega"]
  },
  {
    slug: "aplicaciones-moviles",
    title: "Aplicaciones móviles",
    short: "Experiencias Android y iOS para conectar servicios con usuarios.",
    eyebrow: "Producto digital",
    icon: "smartphone",
    bullets: ["Interfaces intuitivas", "Integración con APIs", "Flujos para clientes y operadores"],
    description: "Desarrollamos aplicaciones móviles pensadas para resolver necesidades reales de usuarios y negocios. Desde una idea inicial hasta prototipos, funciones e integraciones según el alcance acordado.",
    deliverables: ["Diseño de flujos", "Implementación móvil", "Pruebas de funcionalidades", "Preparación técnica para publicación"]
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligencia artificial",
    short: "Asistentes y agentes que mejoran la atención y los procesos internos.",
    eyebrow: "Innovación aplicada",
    icon: "bot",
    bullets: ["Asistentes conversacionales", "Integración con información empresarial", "Supervisión y controles"],
    description: "Incorporamos capacidades de IA a productos y procesos, evaluando límites, calidad de respuestas, seguridad y operación responsable antes de un despliegue.",
    deliverables: ["Definición de casos de uso", "Prototipos y evaluación", "Integración técnica", "Monitoreo y límites operativos"]
  },
  {
    slug: "automatizacion",
    title: "Automatización con n8n",
    short: "Conecta herramientas y elimina tareas repetitivas con flujos automáticos.",
    eyebrow: "Eficiencia operativa",
    icon: "workflow",
    bullets: ["Flujos de trabajo", "Correos y notificaciones", "Integración entre sistemas"],
    description: "Diseñamos automatizaciones para ahorrar pasos manuales y reducir errores entre aplicaciones, usando integraciones, APIs y herramientas como n8n.",
    deliverables: ["Mapa de procesos", "Implementación de workflows", "Manejo de errores", "Documentación y transferencia"]
  },
  {
    slug: "auditoria-qa",
    title: "Auditoría y QA de software",
    short: "Revisiones técnicas y pruebas para publicar con mayor confianza.",
    eyebrow: "Calidad de software",
    icon: "shield",
    bullets: ["Auditoría técnica", "Pruebas E2E", "Revisión de staging y regresiones"],
    description: "Analizamos aplicaciones existentes y ayudamos a detectar errores, riesgos y problemas de calidad. Aplicamos pruebas técnicas apropiadas al producto y reportamos evidencia verificable.",
    deliverables: ["Diagnóstico priorizado", "Plan de pruebas", "Ejecución y evidencias", "Recomendaciones de mejora"]
  },
  {
    slug: "seo",
    title: "SEO y optimización",
    short: "Bases técnicas para mejorar descubrimiento, velocidad y usabilidad.",
    eyebrow: "Rendimiento digital",
    icon: "search",
    bullets: ["SEO técnico", "Rendimiento web", "Accesibilidad básica"],
    description: "Optimizamos la estructura técnica de tu web para facilitar su rastreo, mejorar su velocidad y ofrecer una experiencia clara. No prometemos posiciones específicas en buscadores.",
    deliverables: ["Revisión técnica", "Metadatos y sitemap", "Mejoras de rendimiento", "Informe de acciones"]
  },
  {
    slug: "integraciones",
    title: "APIs e integraciones",
    short: "Conectamos aplicaciones, datos y servicios para construir flujos sólidos.",
    eyebrow: "Conectividad",
    icon: "network",
    bullets: ["APIs a medida", "Integración con servicios", "Validación y manejo de errores"],
    description: "Creamos conexiones entre sistemas para centralizar información y reducir trabajo duplicado, con atención a permisos, autenticación y trazabilidad.",
    deliverables: ["Diseño de contratos", "Conexión e implementación", "Pruebas de integración", "Documentación técnica"]
  }
];

export const industries = [
  { title: "Restaurantes y comercios", text: "Catálogos digitales, pedidos, inventario y presencia web." },
  { title: "Taxis y flotas", text: "Aplicaciones de reservas, gestión operativa y experiencias móviles." },
  { title: "Delivery y logística", text: "Soluciones para pedidos, seguimiento y coordinación de operaciones." },
  { title: "Profesionales", text: "Sitios, agendas, formularios e integración con canales de contacto." },
  { title: "Equipos empresariales", text: "Herramientas internas, reportes, integraciones y automatizaciones." },
  { title: "Emprendedores", text: "Validación de ideas, productos mínimos viables y plataformas escalables." }
];

export const processSteps = [
  { title: "Descubrimiento", text: "Escuchamos la necesidad, objetivos, usuarios y restricciones." },
  { title: "Diseño y alcance", text: "Definimos la solución, entregables y criterios de aceptación." },
  { title: "Desarrollo", text: "Construimos por etapas con revisiones técnicas y funcionales." },
  { title: "Validación", text: "Probamos los recorridos principales antes de la entrega." },
  { title: "Entrega y evolución", text: "Documentamos y definimos el soporte posterior si aplica." }
];
