# Nexo Digital Studio — QA de UI Premium V2

> Refinamiento independiente actual: [QA V3.1](qa-v3-1/QA.md) y [galería de todas las secciones](qa-v3-1/GALLERY.md). Hero y logo V3 conservados; interiores sin migrar. El informe V2 que sigue es una referencia histórica.

> La rama `codex/home-shadcn-proposal` añade una propuesta independiente de Home sobre V2. Su [informe de QA](home-proposal/QA.md), [decisiones de diseño](home-proposal/DESIGN.md) y [comparativas](home-proposal/comparison-1440.jpg) documentan el alcance nuevo. El informe V2 que sigue permanece como referencia histórica.

26 de octubre de 2026 · America/Guayaquil. Rama `feat/nexo-website-v1`, PR #1 OPEN / DRAFT. Referencia conservada: `08eb734fb29ce693f3002143f0230bb662720b0f`.

**Resultado: listo para revisión visual y técnica en Draft.** Lint, TypeScript, build y las **75 pruebas E2E** pasan. Se conservaron las 72 pruebas originales y se añadieron tres comprobaciones de metodología, una por tamaño. No se cambiaron sus expectativas para eludir regresiones.

TasteSkill pasa de **14 FAIL / 6 WARN** a **1 FAIL / 3 WARN**. El resultado estricto sigue siendo FAIL por el mínimo de cuatro fotografías: la dirección aprobada utiliza ilustraciones vectoriales originales. Se documenta la decisión; no se desactivó ninguna regla.

## Qué cambió

- Hero completo: “Ideas que conectan.”, núcleo N orbital original, horizonte azul, texto editorial y dos acciones existentes.
- Sistema azul noche en las 16 rutas, títulos breves, lectura de 16–18 px y estados de foco visibles.
- Servicios con dos superficies principales y un directorio en Home; catálogo de anchos alternos y detalles sin numeración decorativa.
- Conexión gráfica entre idea y solución; metodología nativa con cinco desplegables accesibles.
- Header, navegación, CTA final y footer compartidos rediseñados.
- Portafolio y blog conservan sus estados vacíos honestos.
- Formulario, validación, enlaces de WhatsApp, metadatos, canonical, robots y sitemap conservados. `contact-form.tsx`, el catálogo y las configuraciones de paquetes no se modificaron.

La [memoria de diseño](qa-v2/DESIGN.md) explica las referencias y las decisiones frente a TasteSkill. Se usaron sus tres imágenes como referencias, sin copiar sus composiciones ni su contenido comercial. No hay dependencias nuevas ni WebGL, canvas, librerías de animación o peticiones de imágenes externas.

## Resultados ejecutados

| Verificación | Resultado | Evidencia |
| --- | --- | --- |
| Git y preservación | PASS | Rama inicial limpia en el SHA de referencia; no reset, rebase ni force push |
| Lint | PASS | `npm run lint`, cero errores/advertencias |
| TypeScript | PASS | `npm run typecheck` |
| Build de producción | PASS | `npm run build`; 20 entradas generadas, incluidas las 16 páginas comerciales |
| 72 pruebas existentes | PASS | Todas pasan sin modificar sus recorridos ni expectativas |
| Metodología nueva | PASS | Tres pruebas adicionales: apertura por puntero, Enter y preferencia de movimiento reducido |
| Total Playwright | PASS | 75 esperadas, 0 fallos, 0 omitidas, 0 inestables |
| Responsive | PASS | 390×844, 768×1024 y 1440×900; sin overflow horizontal |
| Accesibilidad automatizada | PASS | Cero infracciones axe WCAG 2/2.1 A/AA en 16 páginas × 3 tamaños |
| Teclado | PASS | Menú/Escape, retorno de foco, salto al contenido y desplegables |
| Cotización/WhatsApp | PASS | Requeridos, espacios, correo, caracteres especiales, presupuesto opcional, popup y alternativa |
| SEO | PASS | Un H1, títulos, descripción, canonical por página, sitemap y robots |
| Rendimiento local | PASS | CLS 0 en las seis mediciones; JS < 350 KB y ninguna petición externa a Google Fonts |
| TasteSkill inspector | FAIL | 1 FAIL y 3 WARN, detalle abajo |
| TasteSkill lint de fuente | FAIL justificado | 3 FAIL y 0 WARN: dos reglas de sombra y un gradiente del horizonte solicitado |
| GitHub Actions | BLOQUEO HISTÓRICO | Último diagnóstico: cuenta bloqueada por facturación; no se solicitó rerun ni se modificó facturación |

La ejecución final tardó **144,5 s** y usa Chromium instalado. El servidor revisado es `next start`, no el modo de desarrollo. Se revisaron capturas de las 16 rutas en los tres tamaños y las siete hojas finales del inspector. Los datos están en [qa-results.json](qa-results.json).

## Rendimiento

| Tamaño | Ruta | LCP (ms) | CLS | TTFB (ms) | JS transferido (bytes) |
| --- | --- | ---: | ---: | ---: | ---: |
| mobile-390 | `/` | 320 | 0.000 | 20.8 | 140016 |
| mobile-390 | `/contacto` | 332 | 0.000 | 12.1 | 141521 |
| tablet-768 | `/` | 296 | 0.000 | 8.0 | 140016 |
| tablet-768 | `/contacto` | 264 | 0.000 | 10.9 | 141521 |
| desktop-1440 | `/` | 308 | 0.000 | 6.1 | 141521 |
| desktop-1440 | `/contacto` | 268 | 0.000 | 15.8 | 141521 |

Mediciones locales sin limitar red o CPU, con capturas y QA simultáneos; no son métricas de campo ni Lighthouse. LCP 264–332 ms, CLS 0 y JavaScript 140,016–141,521 bytes. El presupuesto automatizado de 350 KB se mantiene sin dependencias nuevas. Las fuentes continúan servidas por Next.js.

Las animaciones usan transformaciones y no reducen la opacidad de los textos. El modo de movimiento reducido elimina las animaciones y el scroll suave. No hay carga de imágenes pesadas ni cambios de layout registrados.

## Evaluación estética real

Dirección **The dark room**, semilla **1640262902**, interpretada dentro de la dirección dark cosmic aprobada. La idea es convertir el significado de Nexo en un núcleo que conecta diseño, software e IA. Los objetos iluminados y el horizonte se limitan al hero; los controles y las demás superficies son planos.

| Medición | V1 | V2 |
| --- | ---: | ---: |
| FAIL de TasteSkill | 14 | 1 |
| WARN de TasteSkill | 6 | 3 |
| Titular Home en móvil | 4 líneas | 2 líneas |
| Títulos de Home sobre 2 líneas, 3 tamaños | Presentes | 0 |
| Tipografías en Home | 3 | 2 |
| Elementos animados observados | 0 | 25 |
| Overflow horizontal de Home | 0 | 0 |

Se resolvieron los títulos largos, rótulos previos, monospace decorativo, numeración, microetiquetas, botones con efectos, líneas y contornos de tarjetas, repetición de tarjetas con iconos, texto pequeño y ausencia de movimiento.

### Hallazgos conservados

- **FAIL `few-pictures`:** cero fotografías/raster contabilizadas; el inspector excluye SVG. La propuesta contiene dos ilustraciones vectoriales originales y el horizonte CSS. Añadir cuatro fotos genéricas o convertir dibujos en raster solo para aprobar el contador no aportaría evidencia del estudio. Se conserva como divergencia documentada de la dirección aprobada.
- **WARN `no-footage`:** sin video. Se priorizan peso y lectura; no existe material audiovisual propio aprobado.
- **WARN `size-count`:** 14 tamaños medidos. Los tamaños corresponden a marca, navegación, cuerpo y títulos responsive; sigue siendo una oportunidad de reducir tokens.
- **WARN `off-centre`:** el inspector registra 80/97 px. La medición DOM independiente del contenedor da **80/80 px**, ancho 1280 en viewport 1440; [evidencia](qa-v2/frame-measurement.json). No se alteró la regla para ocultar esta discrepancia.

El [lint de fuente](qa-v2/taste-source-lint.txt) también se ejecutó sin exclusiones: **3 FAIL / 0 WARN** por dos declaraciones de sombra (horizonte de escritorio y móvil) y un radial-gradient. Estas declaraciones construyen el horizonte luminoso pedido; no son sombras de tarjetas o botones.

El brillo y los gradientes puntuales del recurso orbital responden expresamente a las referencias y a la dirección aprobada, aunque contradicen la prohibición estética general de TasteSkill. No se extienden a todos los componentes. No se usó `--allow`, ni comentarios de exclusión o cambios al inspector.

### Crítica final — ROUND 3

- Seen in one second: titular breve, núcleo N y horizonte azul; acción principal visible.
- Idea (one sentence): el nombre Nexo se convierte en un centro de conexión entre disciplinas y en el hilo del recorrido.
- Live thing: explorar las etapas de trabajo y preparar una cotización de WhatsApp con datos reales del formulario.
- Layout words by section: hero=split-orbit / servicios=featured-directory / enfoque=graphic-split / metodología=disclosure-list / sectores=editorial-list / CTA=reply-band / footer=wordmark-columns.
- Scores, revisión según el brief aprobado: design 8 · usability 8,5 · creativity 7,5 · content 8 → **8,05/10**, evaluación subjetiva.
- Caps applied: con la rúbrica estricta de TasteSkill y su FAIL pendiente, el resultado limitado es **6,0/10**. La valoración del brief no reemplaza ese resultado ni constituye un PASS del inspector.
- Top three problems:
  1. `home-1440-full.png`: falta material real de proyectos que permita reemplazar los estados vacíos y enriquecer las secciones interiores.
  2. `home-390-full.png`: la Home sigue siendo un recorrido largo; conviene validarlo con usuarios y priorizar contenido según consultas reales.
  3. `contacto-390-full.png`: faltan validaciones con Safari y lectores de pantalla reales. El acceso persistente a WhatsApp se trasladó al header en móvil/tablet para evitar superposición de contenido.

No se atribuyen a Nexo clientes, cifras, resultados ni testimonios inventados. El símbolo N propuesto es una marca vectorial de trabajo, pendiente de validación oficial.

## Comparativas y capturas

- [Antes/después 1440 px](qa-v2/comparison-1440.jpg), [768 px](qa-v2/comparison-768.jpg), [390 px](qa-v2/comparison-390.jpg).
- [Home completa V1 móvil](qa-v2/before/home-390-full.png) y [V2 móvil](qa-v2/after/home-390-full.png).
- [Home V2 escritorio](qa-v2/after/home-1440-full.png), [contacto móvil](qa-v2/after/contacto-390-full.png), [detalle de servicio](qa-v2/after/landing-pages-1440-full.png).
- Vistas de 16 rutas: [escritorio](qa-v2/after/desktop-1440-overview.jpg), [tablet](qa-v2/after/tablet-768-overview.jpg), [móvil](qa-v2/after/mobile-390-overview.jpg).
- Findings crudos: [antes](qa-v2/before/taste-results.json), [después](qa-v2/after/taste-results.json).
- Historial: [informe V1](QA-REPORT-V1.md) y [datos V1](qa-results-v1.json).

## Archivos de producto y pruebas

- `src/app/globals.css`: tokens, superficies oscuras, composición, responsive, foco y movimiento.
- `src/app/page.tsx`: Home y metodología.
- `src/components/nexo-artwork.tsx`: símbolo N e ilustraciones originales.
- `src/components/ui.tsx`, `site-header.tsx`, `site-footer.tsx`: componentes compartidos.
- Páginas de `servicios`, `servicios/[slug]`, `soluciones`, `nosotros`, `portafolio`, `blog`, `contacto` y `not-found`: sistema visual y textos breves.
- `tests/e2e/site.spec.ts`: un caso nuevo por tamaño; conserva las 72 comprobaciones originales.
- `docs/QA-REPORT.md`, `docs/qa-results.json`, `docs/qa-v2/` y archivos históricos: resultados y evidencias.

## Riesgos y recomendación

**Recomendación: apto para revisión visual y técnica en Draft; todavía no aprobar producción.** Falta validación de marca y contenido, dominio/indexación de la futura Preview, WhatsApp real, Safari/Firefox, lectores de pantalla y rendimiento desde el alojamiento. Las pruebas usan Chromium emulado; axe no equivale a una certificación completa de accesibilidad.

GitHub Actions seguía bloqueado por facturación en el último diagnóstico confirmado de la V1. No se reintentó manualmente ni se intervino en facturación. La publicación en la rama conserva el workflow existente; este informe no afirma un PASS remoto de CI.

La rama existente recibe un commit normal, sin modificar main ni fusionar el PR. El SHA final publicado se identifica en la descripción del PR y la entrega. No se hicieron despliegues de producción.
