# Nexo Digital Studio

Sitio corporativo multipágina con Next.js 16, React 19 y TypeScript. Esta rama propone una nueva Home con Tailwind CSS 4 y shadcn/ui; las páginas interiores conservan V2 hasta aprobación visual.

[Propuesta de Home y decisiones](docs/home-proposal/DESIGN.md) · [QA: 87/87 PASS](docs/home-proposal/QA.md) · [Comparativa con V2](docs/home-proposal/comparison-1440.jpg).

[Informe de QA V2](docs/QA-REPORT.md) · [Memoria de diseño](docs/qa-v2/DESIGN.md) · [Comparación antes/después](docs/qa-v2/comparison-1440.jpg).

## Instalación reproducible

Node.js 22 LTS (CI) o posterior compatible; npm. El lockfile se versiona.

```sh
npm ci
npm run dev
```

Abrir http://localhost:3000. Para ejecutar la versión de producción local:

```sh
npm run build
npm start
```

## Verificación

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright inicia y detiene un servidor de producción en `127.0.0.1:3100`; requiere un build previo y el puerto libre. En Linux, usar `npx playwright install --with-deps chromium`.

- Chromium en 390×844, 768×1024 y 1440×900.
- Las 16 páginas, enlaces internos, navegación, nueve servicios y errores 404.
- Validaciones y codificación del formulario, presupuesto opcional y alternativa cuando se bloquea una ventana emergente.
- Enlaces de WhatsApp al número configurado; las pruebas interceptan el salto externo y no envían mensajes.
- axe WCAG 2/2.1 A/AA, teclado, movimiento reducido, metadatos, canonical, sitemap y robots.
- Evidencia local de LCP/CLS/TTFB y presupuesto de JavaScript; no sustituye mediciones de campo.

`npm run test:e2e:report` abre el informe HTML. `test-results/` conserva JSON y trazas de fallos; `qa-artifacts/` contiene capturas de las páginas. Son artefactos generados, excluidos de Git. GitHub Actions usa `npm ci` y adjunta las evidencias durante siete días.

## Contenido y contacto

La portada, servicios, soluciones, nosotros, portafolio, blog y contacto se definen en `src/app`; el catálogo y número de WhatsApp, en `src/lib/content.ts`.

El formulario prepara un mensaje: la persona lo revisa y pulsa enviar dentro de WhatsApp. No existe un backend de cotizaciones, envío automático ni almacenamiento de datos en esta aplicación. Si el navegador bloquea la nueva pestaña, queda un enlace para abrir la solicitud preparada.

## Configuración antes de producción

Definir `NEXT_PUBLIC_SITE_URL` con el dominio oficial y sin barra final antes del build para canonical, sitemap y metadataBase. En Vercel se usa `VERCEL_URL` como alternativa; localmente se utiliza `http://localhost:3000`. No usar el dominio local como configuración de producción.

Pendientes editoriales: incorporar el logotipo oficial, aprobar textos comerciales y políticas legales necesarias, y añadir únicamente proyectos y publicaciones verificables. Validar la futura Preview y el número de WhatsApp en un dispositivo real antes de aprobar producción.

Esta revisión no fusiona el PR, no despliega producción ni modifica facturación. Véase `docs/QA-REPORT.md` para resultados y límites de la auditoría.
