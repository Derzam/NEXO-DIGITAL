# Nexo — propuesta de Home con Tailwind y shadcn/ui

> Actualización posterior: [wordmark del propietario en header y footer](wordmark/QA.md), con capturas y nueve comprobaciones de regresión. Los resultados completos de este informe corresponden a la propuesta anterior a ese ajuste de marca.

26 de octubre de 2026. Rama `codex/home-shadcn-proposal`, creada desde `c5c0e857984a0ecea3c4f41735a64a6c19ca6e28`. Alcance: Home, su header/footer y fundamentos de estilo. Las páginas interiores quedan en V2 hasta aprobación visual.

**Resultado técnico: PASS. Propuesta lista para revisión visual.** El resultado estricto de TasteSkill permanece **FAIL**, con sus hallazgos documentados y sin reglas excluidas. El SHA de entrega se identifica en el commit de esta rama y en la entrega del chat; este documento no intenta incluir su propio hash de commit.

## Pruebas ejecutadas sobre el build final

| Comprobación              | Resultado | Evidencia                                                                                                                             |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Manifiesto / lockfile     | PASS      | Dependencias y devDependencies coinciden exactamente en ambos archivos.                                                               |
| `npm run lint`            | PASS      | ESLint con `--max-warnings=0`.                                                                                                        |
| `npm run typecheck`       | PASS      | `tsc --noEmit`.                                                                                                                       |
| `npm run build`           | PASS      | 20 páginas/recursos estáticos generados, sin error de compilación o TypeScript.                                                       |
| `npm run test:e2e`        | PASS      | **87/87**; 0 fallos, 0 omitidas, 0 flaky; 203,38 s.                                                                                             |
| 75 escenarios anteriores  | PASS      | Mismos recorridos y aserciones funcionales; adaptación legítima de selectores de metodología.                                         |
| 12 escenarios nuevos      | PASS      | Resolución del hero en recortes verticales; Tabs por ratón y flechas; FAQ por ratón y Enter; contenido honesto y acceso a portafolio. |
| axe WCAG 2/2.1 A/AA       | PASS      | 48 combinaciones de ruta/tamaño y 6 estados nuevos: **54 escaneos, 0 infracciones**.                                                  |
| Responsive / overflow     | PASS      | Chromium 390×844, 768×1024 y 1440×900; sin desbordamiento horizontal.                                                                 |
| Navegación / teclado      | PASS      | 7 rutas principales, Sheet, Escape y retorno de foco, enlaces de servicio, 404 y salto al contenido.                                  |
| Cotización / WhatsApp     | PASS      | Validación, espacios, correo inválido, caracteres especiales, presupuesto opcional y fallback si se bloquea el popup.                 |
| SEO básico                | PASS      | H1 único, idioma español, título, descripción, canonical, viewport, robots y sitemap con 16 rutas.                                    |
| Movimiento reducido       | PASS      | Escena sin animación; scroll automático; contenido e interacciones disponibles.                                                       |
| Comparación de interiores | PASS      | Contacto y Landing pages en los tres anchos: **6/6 capturas idénticas, 0 píxeles cambiados**.                                         |
| TasteSkill visual         | FAIL      | **2 FAIL / 2 WARN**; detalles abajo.                                                                                                  |
| TasteSkill de fuente      | FAIL      | **20 FAIL / 5 WARN** en `src`, incluyendo V2 conservada y variantes base/overlays de shadcn.                                          |

Datos verificables: [qa-results.json](qa-results.json), [comparación de interiores](interior-comparison.json), [Taste visual crudo](taste-final.json), [Taste fuente crudo](taste-source.json).

Las pruebas existentes no se desactivaron ni perdieron sus expectativas. Solo las tres comprobaciones de metodología pasan de `summary` a botones de Accordion y de `.orbit-rings` a `.cinematic-scene`, conservando apertura por puntero, teclado, visibilidad y movimiento reducido. Los mensajes de WhatsApp se interceptan: no se envían mensajes reales.

## Rendimiento local

Build de producción, Chromium sin limitar CPU o red. Estas mediciones no representan datos de campo, INP ni una puntuación Lighthouse.

| Ruta     | Ancho | LCP    | CLS | JS transferido |
| -------- | ----- | ------ | --- | -------------- |
| Home | 390 | 336 ms | 0 | 171.009 bytes |
| Home | 768 | 368 ms | 0 | 171.009 bytes |
| Home | 1440 | 356 ms | 0 | 172.514 bytes |
| Contacto | 390 | 600 ms | 0 | 172.514 bytes |
| Contacto | 768 | 472 ms | 0 | 172.514 bytes |
| Contacto | 1440 | 464 ms | 0 | 172.514 bytes |

El JS aumenta aproximadamente 31 KB respecto a V2 al incorporar los controles Radix/shadcn; permanece bajo el presupuesto existente de 350 KB. La ilustración WebP pesa 105.014 bytes. El hero reserva su espacio, usa `next/image` con precarga del WebP ya optimizado, sin generar variantes de resolución insuficiente para el recorte vertical, y no depende de video, canvas, motor 3D ni librería adicional de animación. Las fuentes se sirven localmente; 0 solicitudes a Google Fonts en ejecución.

Next avisa que ignora un lockfile situado fuera del repositorio, en el perfil local de Windows. El build termina correctamente y usa el lockfile de este proyecto. No se modificó la configuración del equipo para ocultar ese aviso.

## Correcciones realizadas durante la revisión

- Aislamiento mediante prefijo `tw`, capas CSS y tokens limitados al nuevo shell. Sin Preflight global para evitar regresiones en V2.
- Componentes nuevos en `components/shadcn`; el componente anterior `components/ui.tsx` se conserva.
- Acordeones con texto de 20–22 px y cuerpo de 16 px; se eliminó la herencia del tamaño compacto predeterminado de shadcn.
- Titulares visibles en dos líneas o menos, incluido el cierre móvil y la inscripción principal de la carpeta.
- Eliminación de rótulos redundantes sobre servicios y la carpeta editorial, numeración decorativa, bordes de tarjetas y sombras en reposo del bento.
- Hero servido desde el WebP ya optimizado a 1600 px: evita ampliar una variante pequeña en el recorte vertical de móvil. Nueva prueba de regresión en los tres tamaños.
- Menú Sheet con nombre accesible, cierre por Escape y foco devuelto al disparador. Las acciones móviles tienen controles de 44 px.
- Configuración PostCSS con exportación nombrada y retirada del `@charset` al importar el CSS heredado dentro de una capa; desaparecen sus avisos de lint/compilación.
- Lockfile generado con las dependencias de Tailwind, Radix y utilidades; ninguna dependencia visual pesada añadida.

## Evaluación estética real

Dirección TasteSkill: **The well-kept board**, `dense-tiles`, semilla **1057675573**, sin redibujos. Se adapta a la dirección cinematográfica azul solicitada. La interpretación de las tres referencias del propietario y los tokens se documentan en [DESIGN.md](DESIGN.md).

| Inspección                    | FAIL | WARN |
| ----------------------------- | ---- | ---- |
| V2 conservada, informe previo | 1    | 3    |
| Propuesta, primera ronda      | 10   | 2    |
| Propuesta, segunda ronda      | 3    | 2    |
| Propuesta, ronda final        | 2    | 2    |

No se interpreta este resultado como un PASS estético ni como una mejora numérica de la rúbrica sobre V2. La propuesta cambia la dirección artística; las comparativas permiten evaluarla visualmente.

Hallazgos visuales restantes:

1. **`few-pictures` — FAIL.** El inspector cuenta un raster; se trata de una ilustración generada, no de una fotografía. Se mantiene una imagen protagonista porque el encargo pide un hero cinematográfico y no existen materiales verificados para mostrar cuatro proyectos o fotografías propios.
2. **`still-page` — FAIL.** Solo dos elementos se movieron durante la inspección de carga/scroll. Se mantiene el movimiento discreto y el feedback de controles. No se añaden entradas a cada bloque o un video para satisfacer un contador; Tabs, Accordion y Sheet son las interacciones reales.
3. **`size-count` — WARN.** Mide 18 tamaños computados, incluyendo escalas fluidas y tamaños de controles. Hay más variaciones que las cinco preferidas por TasteSkill. Se acepta en esta propuesta y se recomienda consolidar roles al aprobar el sistema global.
4. **`no-footage` — WARN.** No hay video. La imagen original y los controles cumplen esta propuesta sin añadir transferencia o reproducción continua.

La inspección de fuente permanece visible: 20 FAIL y 5 WARN. Detecta CSS de V2 que debe conservarse, scrims de legibilidad y luz del hero, sombras/líneas de overlays y variantes base de shadcn aunque no estén visibles en reposo, y `transition-all` de componentes generados. Los avisos no se suprimieron con comentarios, `--allow`, `data-ui` o reglas desactivadas. El inspector renderizado ya no encuentra sombras en reposo, tarjetas delineadas, icon cards repetidas ni titulares de más de dos líneas.

### Crítica final

ROUND 3

Seen in one second: un umbral azul monumental y un titular breve.

Idea (one sentence): Nexo convierte la próxima idea de un negocio en un producto digital que puede ponerse en marcha.

Live thing: explorar familias de servicios con Tabs y abrir metodología/FAQ, con navegación y cotización reales.

Layout words by section: hero=escena / servicios=bento / proyectos=editorial / método=lista interactiva / FAQ=preguntas / cierre=campo tonal.

Scores: design 6.5 · usability 8 · creativity 7 · content 7.5 → overall 7.1; **resultado estricto limitado a 6.0 por los FAIL**.

Caps applied: mínimo de fotografías no satisfecho; una metáfora espacial podría adaptarse a otros estudios tecnológicos; FAIL vigentes. La valoración es una autoevaluación, no un premio o una auditoría independiente.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. [Bento y bloque editorial](inspection/desktop-page-01.jpg): los dibujos no prueban trabajo real. Sustituir la carpeta por casos autorizados cuando existan; mantener el estado honesto mientras tanto.
2. [Recorrido móvil](inspection/mobile-page-01.jpg): metodología y FAQ alargan la página. Los acordeones reducen su contenido inicial; revisar la selección de preguntas con el propietario durante aprobación.
3. [Hero](inspection/desktop-fold.jpg): la metáfora arquitectónica es memorable, pero sigue siendo conceptual. La siguiente iteración de identidad debería incorporar materiales propios y verificados del estudio.

Se abrieron los siete archivos finales del inspector y las capturas completas de Home. No hay escenas fijadas de scroll; `scenes.mjs` no aplica a esta implementación.

## Capturas comparativas

- V2 frente a nueva Home: [390 px](comparison-390.jpg), [768 px](comparison-768.jpg), [1440 px](comparison-1440.jpg).
- Nueva Home completa: [390 px](after/home-390-full.png), [768 px](after/home-768-full.png), [1440 px](after/home-1440-full.png).
- V2 completa conservada: [390 px](../qa-v2/after/home-390-full.png), [768 px](../qa-v2/after/home-768-full.png), [1440 px](../qa-v2/after/home-1440-full.png).
- Hojas de inspección: [escritorio](inspection/desktop-page-01.jpg), [cierre escritorio](inspection/desktop-page-02.jpg), [tablet](inspection/tablet-page-01.jpg), [móvil](inspection/mobile-page-01.jpg).

## Archivos modificados

| Área            | Archivos                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Fundamentos     | `package.json`, `package-lock.json`, `components.json`, `postcss.config.mjs`, `src/lib/utils.ts`, `src/styles/app.css` |
| Integración     | `src/app/layout.tsx`, `src/components/site-header.tsx`, `src/app/globals.css` (solo retirada de charset)               |
| Home            | `src/app/page.tsx`, `src/components/proposal/header.tsx`, `footer.tsx`, `interactions.tsx`, `route-footer.tsx`         |
| shadcn          | `src/components/shadcn/button.tsx`, `card.tsx`, `navigation-menu.tsx`, `sheet.tsx`, `tabs.tsx`, `accordion.tsx`        |
| Imagen original | `public/images/nexo-threshold.webp`                                                                                    |
| Pruebas         | `tests/e2e/site.spec.ts`, `tests/e2e/home-proposal.spec.ts`                                                            |
| Documentación   | `README.md`, índice de `docs/QA-REPORT.md`, `docs/home-proposal/` con memoria, resultados, crítica y capturas          |

## Riesgos, alcance y recomendación

**Apto para revisión visual y técnica de la Home.** Migración completa pendiente de aprobación visual. La Home nueva y los interiores V2 tienen sistemas distintos de forma deliberada durante esta evaluación; no se presenta como una migración global terminada.

Quedan por verificar dispositivos reales, Safari/Firefox, lector de pantalla y rendimiento desde el alojamiento con red/CPU limitadas. Axe y Chromium emulado cubren esta validación básica, no una certificación completa. Faltan casos con permisos y materiales verificables; no se inventaron proyectos, clientes, testimonios o métricas.

`feat/nexo-website-v1` y PR #1 continúan en `c5c0e857984a0ecea3c4f41735a64a6c19ca6e28`, OPEN / DRAFT, sin fusionar. Esta propuesta se publica en su rama independiente. No se modifica main, no se despliega a producción y no se modifica facturación. No se solicitó un rerun de GitHub Actions ni se afirma un PASS remoto; el workflow existente no se cambia.
