# Auditoría de Nexo Digital Studio v1

Fecha: 26 de octubre de 2026, America/Guayaquil. Repositorio: `Derzam/NEXO-DIGITAL`. Rama: `feat/nexo-website-v1`. [PR #1](https://github.com/Derzam/NEXO-DIGITAL/pull/1), conservado como borrador.

**Resultado funcional local: PASS. 72 pruebas E2E aprobadas, 0 fallos, 0 omitidas y 0 pruebas inestables en 80,2 s.** La evaluación estética estricta de TasteSkill sigue en FAIL y se detalla como pendiente; este informe no equivale a aprobación de producción.

## Preservación y entorno

La carpeta inicial contenía un repositorio sin commits, `.agents/` y `skills-lock.json`. Se conservaron intactos. El proyecto se clonó en `NEXO-DIGITAL/`; su rama estaba limpia y apuntaba a `9b10aad22c3d07852fabc0c7bee4315a29a42d58`. No se usó reset, force push ni rebase. El SHA final publicado queda identificado en el PR y en la entrega; `git rev-parse HEAD` lo obtiene desde este checkout.

Windows, Node 24.14.0, npm 11.9.0, Next.js 16.4.3, Playwright 1.64.1, Chromium 156.0.8078.4 y axe 4.14.0. La CI está configurada con Node 22. Se conservaron las dependencias de producción; se añadieron únicamente Playwright y axe para el QA pedido. Después de la indicación de reutilizar dependencias se trabajó con las instaladas, incluido `next/font` de Next.js.

## Pruebas ejecutadas

| Comprobación | Resultado | Evidencia |
| --- | --- | --- |
| Instalación y lockfile | PASS | `npm install` y después `npm ci --no-fund`: 351 paquetes instalados, 352 auditados, cero vulnerabilidades reportadas |
| Lint | PASS | `npm run lint`, cero errores y advertencias |
| TypeScript | PASS | `npm run typecheck` |
| Producción | PASS | `npm run build`; 20 entradas generadas, incluyendo 16 páginas comerciales, rutas auxiliares y 404 |
| Arranque | PASS | `next start` en localhost; Playwright usa el puerto 3100 |
| Páginas, enlaces y responsive | PASS | 16 rutas × 3 tamaños, HTTP 200, un H1, sin overflow horizontal ni errores JS/consola |
| Navegación y servicios | PASS | Menú, siete destinos principales, Escape y foco, nueve servicios, descubrimiento y regreso al catálogo |
| Cotización y WhatsApp | PASS | Validación, codificación, presupuesto opcional, mensaje preparado y alternativa a ventana bloqueada |
| Errores 404 | PASS | Ruta inexistente y servicio inexistente responden 404; enlace de regreso funcional |
| Accesibilidad básica | PASS | Cero infracciones axe WCAG 2/2.1 A/AA en las 48 combinaciones; salto al contenido, teclado y movimiento reducido |
| SEO técnico local | PASS | Títulos, descripciones, idioma español, viewport, canonical por página, sitemap de 16 URLs y robots |
| Rendimiento local | PASS | CLS 0 y JavaScript transferido menor a 350 KB en las seis mediciones; cero peticiones a Google Fonts desde el navegador |
| `git diff --check` | PASS | Sin errores de whitespace |
| GitHub Actions remoto | FAIL / BLOQUEADO | El job no inició: cuenta bloqueada por un problema de facturación; no ejecutó pruebas |
| TasteSkill, criterio estético estricto | FAIL | Inspector final: 14 FAIL y 6 WARN; no se ocultan ni se desactivan reglas |

Los tamaños fueron **390×844**, **768×1024** y **1440×900**, todos con Chromium. La matriz y las métricas están en [qa-results.json](qa-results.json). El workflow usa `npm ci`, lint, tipos, build, Chromium y Playwright; publica el reporte HTML, JSON, capturas y trazas de fallos durante siete días. La ejecución remota [40353422820](https://github.com/Derzam/NEXO-DIGITAL/actions/runs/40353422820/job/121679347200), sobre el commit de código `71ea361685d597326b7613407ed953a6f7b4c252`, terminó en failure sin iniciar el job. GitHub indica: “The job was not started because your account is locked due to a billing issue.” Este es un bloqueo de la cuenta, no un fallo de lint/build/E2E remoto observado. No se modificó facturación ni se reintentó automáticamente. El commit posterior solo documenta este resultado; no cambia el código probado.

## Errores corregidos

1. **Colisión con `process`:** el catálogo exportaba una lista llamada `process` que ocultaba el global usado en `process.env`. Se renombró a `processSteps` y se actualizaron ambos consumidores.
2. **Lint bloqueado:** ocho comillas de JSX sin escapar y exportación anónima de la configuración ESLint. Se corrigieron sin desactivar las reglas.
3. **Formulario aceptaba espacios:** nombre y proyecto se recortan y validan antes de generar WhatsApp; el error se limpia al editar. Se mantiene la validación nativa de correo, selección y longitudes.
4. **Ventanas emergentes bloqueadas:** ahora se muestra un estado y un enlace accesible al mensaje preparado, que se elimina al cambiar los datos.
5. **Controles en móvil:** el botón de envío puede envolver el texto dentro de su contenedor; los campos usan 16 px y el botón del menú tiene un objetivo de al menos 44×44 px.
6. **Accesibilidad:** colores de texto con contraste insuficiente, nombre accesible del logotipo, falta de Escape y devolución del foco en el menú, salto al contenido y preferencia de movimiento reducido.
7. **SEO:** se añadió un canonical específico a las 16 páginas.
8. **Salto de diseño por fuentes:** una ejecución registró CLS 0,264 en la portada de escritorio. Se sustituyó el `@import` remoto por `next/font` con fuentes servidas por la aplicación y fallback ajustado. La medición final registró CLS 0 en los seis casos.
9. **Reproducibilidad:** lockfile versionado, CI con `npm ci`, pruebas E2E y documentación de ejecución.
10. **Legibilidad:** siguiendo UI/UX Pro Max y TasteSkill, texto principal de tarjetas y secciones a 16 px, notas del formulario a 13 px, enlaces del pie a 14 px y botones principales con color plano.

Durante el trabajo se resolvieron dos incidencias del entorno: instalaciones npm concurrentes que se regeneraron secuencialmente y un EPERM del sandbox de Windows al escribir `.next`, resuelto compilando con permisos adecuados. Un selector del test móvil se corrigió para admitir el cambio de nombre de “Abrir menú” a “Cerrar menú”. No eran fallos pendientes del producto.

## Rendimiento

Mediciones del build de producción local, sin limitación de CPU o red, con procesos de QA simultáneos. No representan rendimiento de campo, Lighthouse ni INP.

| Tamaño | Ruta | LCP (ms) | CLS | TTFB (ms) | JS transferido (bytes) |
| --- | --- | ---: | ---: | ---: | ---: |
| mobile-390 | `/` | 244 | 0.000 | 20.5 | 139947 |
| mobile-390 | `/contacto` | 188 | 0.000 | 8.6 | 141452 |
| tablet-768 | `/` | 288 | 0.000 | 9.3 | 139947 |
| tablet-768 | `/contacto` | 276 | 0.000 | 27.9 | 141452 |
| desktop-1440 | `/` | 308 | 0.000 | 7.0 | 141452 |
| desktop-1440 | `/contacto` | 228 | 0.000 | 3.7 | 141452 |

Presupuestos automatizados: CLS ≤ 0,1 y JavaScript transferido < 350.000 bytes. Las páginas se prerenderizan. Las fuentes se descargan durante el build y se sirven desde la aplicación; un build sin caché necesita acceso a Google Fonts. No se incorporaron paquetes de tipografía nuevos.

## Revisión visual y TasteSkill

Se usaron UI/UX Pro Max y `design-taste-frontend` (TasteSkill), junto con las revisiones de verificación y React. Se aplicó el flujo de **revisión de un sitio existente**, sin sortear una dirección nueva, sin semilla ni redibujos, y sin reemplazar la identidad del sitio. No se añadieron imágenes, clientes, testimonios o métricas comerciales inventados.

El inspector de la portada se ejecutó en los tres anchos. Pasó de **16 FAIL / 6 WARN** a **14 FAIL / 6 WARN** al mejorar el cuerpo de texto y eliminar los efectos del botón principal. Se revisaron las nueve capturas finales que produjo, las vistas de las 16 rutas y el formulario móvil. El criterio estético estricto queda pendiente, aunque los recorridos funcionales y axe pasan.

ROUND 3

- Seen in one second: titular y panel conceptual sobre fondo oscuro; acción de explorar servicios visible.
- Idea (one sentence): Nexo presenta su catálogo y metodología mediante una estética tecnológica común, todavía sin un recurso visual propio que distinga al estudio.
- Live thing: la cotización transforma los datos del proyecto en un mensaje editable de WhatsApp.
- Layout words by section: hero=split / servicios=grid / metodología=split / proceso=list / sectores=split-grid / contacto=band / footer=columns.
- Scores: design 6 · usability 8 · creativity 5 · content 6 → overall **6,0**, aplicando el límite por FAIL del inspector (aritmético 6,4).
- Caps applied: FAIL pendientes, titular móvil de cuatro líneas, ausencia de imágenes reales y lenguaje visual de categoría.
- Top three problems:
  1. `mobile-fold.jpg`: el título principal ocupa cuatro líneas. Acortar la propuesta de valor en una siguiente revisión editorial.
  2. `desktop-page-01.jpg`: tarjetas, numeración y rótulos repetidos. Replantear la composición con ejemplos reales del trabajo del estudio cuando estén disponibles.
  3. `tablet-fold.jpg`: el panel es conceptual y conserva efectos decorativos. Sustituirlo por material propio aprobado y simplificar efectos, sin inventar proyectos.

Las 14 marcas FAIL son: títulos largos (dos mediciones), eyebrows, monospace fuera de código semántico, numeración decorativa, rótulos pequeños, degradados, sombras, líneas, cajas delineadas, tarjetas repetidas, escasez de imágenes, texto decorativo pequeño y ausencia de animación de entrada. Las seis WARN son vidrio, número de tipografías y tamaños, texto gris, ausencia de video y márgenes visuales. Son criterios de dirección artística; no se presentan como infracciones WCAG. La ausencia de animaciones no bloquea la lectura ni la interacción.

## Pendientes antes de aprobar producción

- Resolver por el titular el bloqueo de facturación de GitHub y volver a ejecutar Website QA. El agente no cambió esa configuración.

- Aprobar una dirección visual propia y resolver los hallazgos de TasteSkill si se exige su conformidad completa.
- Integrar logotipo oficial y materiales reales para portafolio/blog; revisar textos y requisitos legales.
- Definir el dominio oficial mediante `NEXT_PUBLIC_SITE_URL` y validar canonical, robots e indexación de la futura Preview/producción. Localmente el fallback sigue siendo localhost.
- Comprobar el número de WhatsApp en un dispositivo real con la cuenta del negocio. Se verificaron URL, número y texto; no se envió ningún mensaje ni se certificó la existencia de esa cuenta externa.
- Probar Safari/Firefox, lector de pantalla y dispositivos reales. Chromium emulado y axe no constituyen una certificación completa de accesibilidad.
- Medir rendimiento desde el alojamiento real y red móvil; añadir seguimiento de métricas de campo si corresponde.
- npm advierte que ESLint 9 está fuera de soporte. Se conservó la versión compatible instalada; su actualización mayor queda para una revisión separada. El audit de esta instalación no reportó vulnerabilidades.

No se fusionó el PR, no se hizo despliegue de producción y no se modificó facturación.

## Evidencias y reproducción

- [Portada escritorio](qa-evidence/desktop-fold.jpg), [tablet](qa-evidence/tablet-fold.jpg), [móvil](qa-evidence/mobile-fold.jpg).
- [Vista de 16 páginas en escritorio](qa-evidence/desktop-1440-overview.jpg), [tablet](qa-evidence/tablet-768-overview.jpg), [móvil](qa-evidence/mobile-390-overview.jpg).
- [Formulario completo en 390 px](qa-evidence/mobile-390-contacto.png).
- [Resultados estructurados y hallazgos de TasteSkill](qa-results.json).

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:e2e:report
```

Las capturas completas de las 48 combinaciones y el HTML de Playwright se generan localmente en `qa-artifacts/` y `playwright-report/`; no se incluyen dependencias ni builds en Git.
