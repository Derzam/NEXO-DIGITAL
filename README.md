# Nexo Digital Studio

Sitio corporativo multipágina con Next.js 16, React 19, TypeScript, Tailwind CSS 4 y shadcn/ui. La rama `codex/interiors-shadcn-migration` extiende el sistema premium aprobado en Home V3.1 a las páginas interiores, sin modificar la Home, el hero ni el logotipo.

[Migración V4 y QA](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v4/QA.md) · [Fases y evidencias](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v4/PHASES.md) · [Galería antes/después](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v4/GALLERY.md) · [PR #2 Draft](https://github.com/Derzam/NEXO-DIGITAL/pull/2).

[Refinamiento V3.1](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v3-1/DESIGN.md) · [QA V3.1](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v3-1/QA.md) · [Capturas de todas las secciones](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v3-1/GALLERY.md).

[Propuesta de Home y decisiones](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/home-proposal/DESIGN.md) · [QA de V3: 87 escenarios](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/home-proposal/QA.md) · [Comparativa con V2](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/home-proposal/comparison-1440.jpg).

[Informe de QA V2](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/QA-REPORT-V2.md) · [Memoria de diseño](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v2/DESIGN.md) · [Comparación antes/después](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v2/comparison-1440.jpg).

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
npx playwright install chromium firefox webkit
npm run test:e2e
```

Playwright inicia y detiene un servidor de producción en `127.0.0.1:3100`; requiere un build previo y el puerto libre. En Linux, usar `npx playwright install --with-deps chromium firefox webkit` cuando el entorno necesite instalar los navegadores y sus dependencias.

Para ejecutar cada motor con la configuración compatible en PowerShell:

```powershell
$env:PREFLIGHT_BROWSER='chromium'; npm run test:e2e -- --config=playwright.compat.config.ts --workers=2
$env:PREFLIGHT_BROWSER='firefox'; npm run test:e2e -- --config=playwright.compat.config.ts --workers=2
$env:PREFLIGHT_BROWSER='webkit'; npm run test:e2e -- --config=playwright.compat.config.ts --workers=2
```

La [guía de herramientas](docs/TOOLS.md) detalla los archivos y servidores que cada script necesita.

- Chromium en 390×844, 768×1024 y 1440×900.
- Las 16 páginas, enlaces internos, navegación, nueve servicios y errores 404.
- Validaciones y codificación del formulario, presupuesto opcional y alternativa cuando se bloquea una ventana emergente.
- Enlaces de WhatsApp al número configurado; las pruebas interceptan el salto externo y no envían mensajes.
- axe WCAG 2/2.1 A/AA, teclado, movimiento reducido, metadatos, canonical, sitemap y robots.
- Evidencia local de LCP/CLS/TTFB y presupuesto de JavaScript; no sustituye mediciones de campo.

La suite actual reúne 111 ejecuciones por motor en los tres tamaños. Para comparar la Home con la referencia aprobada, iniciar el build en `127.0.0.1:3155` en una terminal y ejecutar las capturas desde otra:

```sh
npm run start -- --hostname 127.0.0.1 --port 3155
node scripts/qa-v4-2/capture-home.cjs http://127.0.0.1:3155 qa-artifacts/home-rc
node scripts/qa-v4/compare-home.cjs qa-artifacts/home-rc
```

Ejecutar capturas e inspectores de forma secuencial a los E2E en equipos con recursos limitados. `compare-home.cjs` exige igualdad exacta de Home completa y primer viewport en los tres tamaños. Los helpers de imágenes utilizan Sharp, ya incluido en las dependencias de Next.js; no agregan paquetes al proyecto. La galería histórica V4 requiere capturas adicionales conservadas en el commit histórico y no forma parte de la verificación operativa mínima; la fuente de sus herramientas queda enlazada en [la documentación del candidato](docs/RELEASE-CANDIDATE.md).

`npm run test:e2e:report` abre el informe HTML. `test-results/` conserva JSON y trazas de fallos; `qa-artifacts/` contiene capturas de las páginas. Son artefactos generados, excluidos de Git. GitHub Actions usa `npm ci` y adjunta las evidencias durante siete días.

## Contenido y contacto

La portada, servicios, soluciones, nosotros, portafolio, blog y contacto se definen en `src/app`; el catálogo y número de WhatsApp, en `src/lib/content.ts`.

El formulario prepara un mensaje: la persona lo revisa y pulsa enviar dentro de WhatsApp. No existe un backend de cotizaciones, envío automático ni almacenamiento de datos en esta aplicación. Si el navegador bloquea la nueva pestaña, queda un enlace para abrir la solicitud preparada.

## Configuración antes de producción

Definir `NEXT_PUBLIC_SITE_URL` con el dominio HTTPS oficial antes del build para canonical, sitemap y metadataBase. Si no se define, se usa `VERCEL_PROJECT_PRODUCTION_URL` cuando Vercel expone sus variables de sistema; localmente se utiliza `http://localhost:3000`. Una compilación Vercel de producción falla si no dispone de un origen HTTPS. Los previews reciben `noindex, nofollow`. Confirma el dominio canónico con el propietario antes de integrar este cambio.

El logotipo aprobado por el propietario ya está incorporado. Pendientes editoriales: aprobación final de textos y políticas legales necesarias, y añadir únicamente proyectos y publicaciones verificables. Validar la futura Preview y el número de WhatsApp en un dispositivo real antes de aprobar producción.

La trazabilidad de los PR #1–#4, la selección del candidato y sus controles se describen en [la documentación del candidato](docs/RELEASE-CANDIDATE.md). El workflow existente solo se dispara para PR dirigidos a `main`; una ejecución local no acredita su resultado remoto.
