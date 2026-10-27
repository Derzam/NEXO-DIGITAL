# Evaluación visual V4

Se conserva la dirección aprobada de Home V3.1: portal cinematográfico, logotipo, azul noche, iluminación azul, Manrope y DM Sans. UI/UX Pro Max se aplica a jerarquía, controles, foco y lectura; TasteSkill se usa como inspector, sin redefinir la identidad. La dirección guardada mantiene seed 1057675573, palette/type conservados y allow vacío.

Servicios combina dos Card destacados con interfaces y un directorio editorial. Los detalles separan contexto, alcance, entregables y navegación relacionada. Soluciones conserva seis categorías y hace explícitas las interfaces conceptuales. Portafolio y Blog mantienen estados honestos. Nosotros utiliza una declaración editorial y el Accordion existente. Contacto usa Input, NativeSelect, Textarea y Button, con errores asociados a los campos.

## Inspección real

Build de producción local en 1440, 768 y 390 px. Primera pasada: 17 rutas. Segunda: las 13 rutas afectadas por el pulido. Contacto se inspecciona otra vez tras su corrección de contraste y foco. Las cuatro rutas sin cambios de la segunda pasada conservan sus informes iniciales. No se usa --allow, no se desactivan reglas, no se usa --app para estas páginas y no se amplía data-ui fuera de las interfaces demostrativas.

Los totales siguientes acumulan incidencias por ruta, deduplicadas por el propio inspector dentro de cada página; no son 34 problemas distintos del sistema. Resultado estricto visual: **34 FAIL / 36 WARN** (primera pasada: 56 / 38). Fuente: **26 FAIL / 6 WARN**, 44 archivos.

| Ruta | Antes FAIL / WARN | Final FAIL / WARN | Reglas finales | Evidencia |
| --- | --- | --- | --- | --- |
| /blog | 2 / 2 | 2 / 2 | FAIL: few-pictures; WARN: no-footage; WARN: off-centre; FAIL: still-page | [JSON](taste/blog/report.json) |
| /contacto | 3 / 3 | 2 / 2 | FAIL: few-pictures; WARN: no-footage; WARN: off-centre; FAIL: still-page | [JSON](taste-final/contacto/report.json) |
| / | 2 / 2 | 2 / 2 | WARN: size-count; WARN: no-footage; FAIL: still-page; FAIL: icon-cards | [JSON](taste/home/report.json) |
| /no-existe | 2 / 2 | 2 / 2 | FAIL: few-pictures; WARN: no-footage; WARN: hero-void; FAIL: still-page | [JSON](taste/no-existe/report.json) |
| /nosotros | 4 / 3 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/nosotros/report.json) |
| /portafolio | 2 / 1 | 2 / 1 | FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste/portafolio/report.json) |
| /servicios | 3 / 3 | 2 / 3 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; WARN: off-centre; FAIL: still-page | [JSON](taste-final/servicios/report.json) |
| /servicios/aplicaciones-moviles | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-aplicaciones-moviles/report.json) |
| /servicios/auditoria-qa | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-auditoria-qa/report.json) |
| /servicios/automatizacion | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-automatizacion/report.json) |
| /servicios/integraciones | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-integraciones/report.json) |
| /servicios/inteligencia-artificial | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-inteligencia-artificial/report.json) |
| /servicios/landing-pages | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-landing-pages/report.json) |
| /servicios/seo | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-seo/report.json) |
| /servicios/sistemas-web | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-sistemas-web/report.json) |
| /servicios/sitios-corporativos | 4 / 2 | 2 / 2 | WARN: size-count; FAIL: few-pictures; WARN: no-footage; FAIL: still-page | [JSON](taste-final/servicios-sitios-corporativos/report.json) |
| /soluciones | 2 / 4 | 2 / 4 | WARN: size-count; WARN: no-real-pictures; WARN: no-footage; WARN: off-centre; FAIL: still-page; FAIL: eyebrow | [JSON](taste-final/soluciones/report.json) |

## Decisiones y discrepancias conservadas

- few-pictures / no-real-pictures / no-footage: no existen casos, fotografías o clips propios aprobados que justifiquen rellenar las páginas. Se prioriza el estado editorial honesto y los ejemplos de software solicitados. No se añaden imágenes genéricas o proyectos inventados para cumplir una cuota.
- still-page: se conservan microinteracciones de controles, foco y Accordion; no se añaden ocho animaciones de entrada a páginas de lectura o formularios. La Home y su animación aprobada permanecen intactas.
- icon-cards de Home: hallazgo heredado de su composición aprobada. Se mantiene. En los servicios relacionados sí se sustituyeron las tarjetas repetidas por filas editoriales y se resolvió su hallazgo.
- eyebrow de Soluciones: el inspector interpreta cinco figcaption de la figura anterior como rótulos de la industria siguiente. El DOM los mantiene dentro de su figure, debajo de la interfaz y con sentido de transparencia. Se conserva el hallazgo bruto y la leyenda de demostración.
- size-count: incluye tamaños de navegación, notas e interfaces estáticas. Queda como oportunidad de normalización; no se altera la Home para perseguir el contador.
- off-centre: el inspector mide bordes de contenido. La geometría independiente registra contenedores con márgenes iguales en las 51 vistas, sin overflow. No se desactiva la advertencia.
- hero-void de 404: la página tiene una tarea breve, explicar el error y volver al inicio. Se conserva una pausa de composición sin añadir contenido o imágenes de relleno.
- Fuente: cuenta CSS legado sin uso, variantes de biblioteca no renderizadas, sombras de overlays, scrims aprobados sobre imágenes, líneas dentro de interfaces y bordes de campos. También marca box-shadow:none por la expresión regular y from-right-52 como si fuera un gradiente. Se conservan todos los registros; el informe de fuente sigue en FAIL.

## Crítica de capturas

ROUND 1
Seen in one second: identidad compartida, catálogo con dos ejemplos destacados y títulos claros.
Idea (one sentence): extender el umbral de Nexo a un directorio de soluciones legibles y herramientas de contacto.
Live thing: descubrir un servicio, consultar su alcance y preparar una cotización específica.
Layout words by section: servicios=destacados/directorio / detalle=contexto/alcance/relacionados / soluciones=relatos alternos / portafolio=estudio/estado editorial / nosotros=declaración/método / blog=estado vacío / contacto=formulario/apoyo.
Scores: design 6.5 · usability 7.5 · creativity 6 · content 8 → overall 6.9.
Caps applied: FAIL del inspector y falta de imágenes propias; resultado estricto limitado a 6.0.
Top three problems:
1. taste/servicios/desktop-page-01.jpg: divisores repetidos y tres tarjetas similares en relacionados; cambiar por espacio y filas editoriales.
2. taste/soluciones/mobile-page-01.jpg: leyendas explicativas demasiado repetidas; acortarlas manteniendo la identificación de demostración.
3. taste/contacto/mobile-fold.jpg: avisos de 14 px y bordes poco distinguibles; ampliar a 16 px y comprobar contraste no textual y foco.

ROUND 2
Seen in one second: mayor continuidad editorial entre páginas y formularios más distinguibles.
Idea (one sentence): la tecnología se explica desde su contexto y el siguiente paso comercial queda accesible.
Live thing: navegación completa, Accordion por teclado, selección nativa y preparación segura de WhatsApp.
Layout words by section: catálogo=dos muestras/directorio sin divisores / relacionados=filas / propósito=párrafo editorial / formulario=campos/errores/alternativa.
Scores: design 6.5 · usability 8.2 · creativity 6 · content 8 → overall 7.1.
Caps applied: TasteSkill continúa en FAIL; resultado estricto 6.0, sin presentar esa diferencia como PASS estético.
Top three problems:
1. phase-6-final/soluciones-390-full.png: seis industrias generan una lectura móvil larga; validar prioridades con consultas reales en una iteración futura.
2. phase-6-final/portafolio-1440-full.png y blog-390-full.png: faltan casos y artículos reales autorizados; mantener el estado vacío hasta recibirlos.
3. phase-6-final/servicios-1440-full.png: las familias comparten ejemplos del sistema; incorporar en el futuro material real específico, sin convertir demos en casos publicados.

## Todos los registros de fuente

| Nivel | Regla | Archivo y línea | Coincidencia |
| --- | --- | --- | --- |
| FAIL | shadow | src/app/globals.css:327 | box-shadow: |
| FAIL | gradient | src/app/globals.css:334 | radial-gradient( |
| FAIL | shadow | src/app/globals.css:1460 | box-shadow: |
| WARN | outlined-box | src/components/proposal/interactions.tsx:186 | border |
| FAIL | eyebrow | src/components/proposal/product-previews.tsx:47 | className="screen-kicker |
| FAIL | eyebrow | src/components/proposal/product-previews.tsx:199 | className="screen-kicker |
| FAIL | hairline | src/components/shadcn/accordion.tsx:21 | border-b |
| WARN | transition-all | src/components/shadcn/accordion.tsx:37 | transition-all |
| WARN | transition-all | src/components/shadcn/button.tsx:7 | transition-all |
| FAIL | hairline | src/components/shadcn/card.tsx:22 | border-b |
| FAIL | hairline | src/components/shadcn/card.tsx:78 | border-t |
| WARN | outlined-box | src/components/shadcn/input.tsx:5 | border |
| FAIL | gradient | src/components/shadcn/navigation-menu.tsx:92 | from-right-52 |
| FAIL | shadow | src/components/shadcn/navigation-menu.tsx:93 | shadow |
| FAIL | shadow | src/components/shadcn/navigation-menu.tsx:114 | shadow |
| WARN | transition-all | src/components/shadcn/navigation-menu.tsx:131 | transition-all |
| FAIL | shadow | src/components/shadcn/navigation-menu.tsx:152 | shadow-md |
| FAIL | shadow | src/components/shadcn/sheet.tsx:62 | shadow-lg |
| FAIL | hairline | src/components/shadcn/sheet.tsx:64 | border-l |
| FAIL | hairline | src/components/shadcn/sheet.tsx:66 | border-r |
| FAIL | hairline | src/components/shadcn/sheet.tsx:68 | border-b |
| FAIL | hairline | src/components/shadcn/sheet.tsx:70 | border-t |
| WARN | transition-all | src/components/shadcn/tabs.tsx:66 | transition-all |
| FAIL | gradient | src/styles/app.css:91 | linear-gradient( |
| FAIL | gradient | src/styles/app.css:92 | linear-gradient( |
| FAIL | gradient | src/styles/app.css:100 | linear-gradient( |
| FAIL | shadow | src/styles/app.css:193 | box-shadow: |
| FAIL | gradient | src/styles/app.css:258 | linear-gradient( |
| FAIL | shadow | src/styles/interiors.css:86 | box-shadow: |
| FAIL | hairline | src/styles/interiors.css:131 | border-bottom: 1px |
| FAIL | gradient | src/styles/refinement.css:405 | linear-gradient( |
| FAIL | gradient | src/styles/refinement.css:529 | linear-gradient( |

[Fuente completa](taste-source.json) · [Primera fuente](taste-source-round-1.json) · [Capturas comparativas](GALLERY.md) · [Geometría](phase-6-final/capture-results.json).