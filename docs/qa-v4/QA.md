# Nexo Digital Studio — QA de migración V4

26 de octubre de 2026, America/Guayaquil. Rama **codex/interiors-shadcn-migration** desde **881817b5e6a67cdda3d17807d95ff30c64a7ec22**.

**Resultado técnico: PASS. Preparado para revisión visual y técnica del propietario, manteniendo Draft. TasteSkill estricto: FAIL.** El SHA final de publicación se identifica en el head del [PR #2](https://github.com/Derzam/NEXO-DIGITAL/pull/2) y en la entrega; este informe se versiona con las evidencias en ese commit.

Se migran las 15 páginas interiores comerciales y la 404. La Home aprobada conserva su contenido, imagen, logotipo, composición y animación. No se fusiona, se marca Ready for Review o se despliega ningún PR; main y las ramas anteriores se conservan.

## Resultados ejecutados

| Control | Resultado | Evidencia y alcance |
| --- | --- | --- |
| Git inicial | PASS | Base verificada y árbol limpio. Rama de destino inexistente antes de crearla; sin reset, rebase o force-push. |
| npm ci | PASS tras corrección de entorno | 445 paquetes instalados; 0 vulnerabilidades reportadas. Primer intento EPERM por SWC en uso; se cerraron solo previews verificados de este repositorio en 3110/3111. [Log inicial](phase-6-final/npm-ci-first.txt), [repetición](phase-6-final/npm-ci-pass.txt). |
| npm run lint | PASS | ESLint con max-warnings=0, incluyendo los helpers versionados. |
| npm run typecheck | PASS | TypeScript sin errores. |
| npm run build | PASS | Build de producción con 20 páginas/recursos estáticos. |
| npm run test:e2e | PASS | **105/105**, sin omitidas, fallos o flaky en la corrida final. Tres workers originales, timeout original de 45 s y sin reintentos locales. [Resultados](phase-6-final/results.json). |
| 90 escenarios anteriores | PASS | Tres archivos originales y configuración Playwright idénticos a V3.1. Ningún ajuste de selectores. [Contratos](phase-6-final/contracts.json). |
| 15 comprobaciones nuevas | PASS | Cinco recorridos en tres tamaños: industrias/portafolio, metodología/blog, errores/teclado/contraste, shell/menú/404 y cotización exacta de los nueve servicios. |
| axe WCAG 2/2.1 A/AA | PASS | **69 escaneos, cero infracciones**: 48 ruta/tamaño, 9 estados existentes de Home y 12 estados nuevos. Hay 60 resultados adjuntos en JSON y 9 aserciones inline en los archivos originales. |
| Teclado y foco | PASS | Menú con Escape y retorno de foco; Accordion por Enter; Tab en campos; navegación actual y enlace de salto; etiqueta y primer campo inválido visibles bajo el header. [Foco](phase-6-final/focus-errors.json). |
| Contraste básico | PASS | Ocho pares de tokens revisados. Texto secundario sobre panel 8,84:1; botón primario 5,18:1; errores 6,84:1; borde del campo 3,61:1 mínimo. El E2E verifica también el borde renderizado. [Ratios](phase-6-final/contracts.json). |
| Responsive | PASS | **51 vistas**: 17 rutas en 390×844, 768×1024 y 1440×900. Sin overflow horizontal; todos los contenedores medidos tienen márgenes equilibrados. [Geometría](phase-6-final/capture-results.json). |
| Home sin regresiones | PASS | **6/6 comparaciones exactas, 0 píxeles diferentes**: página completa y primer viewport en tres tamaños. [Comparación](phase-6-final/home-comparison.json). |
| Movimiento reducido | PASS | Contenido disponible y hero sin animación cuando se solicita reducción. No se introducen revelados que oculten contenido. |
| SEO y rutas | PASS local | H1, título, descripción, idioma, canonical y viewport en 16 rutas. Robots y sitemap de 16 URLs; dos rutas inexistentes devuelven 404 y noindex. [Metadatos](phase-6-final/metadata.json). |
| WhatsApp y formulario | PASS | Número y contexto correctos; validación, trim, correo, presupuesto opcional, caracteres especiales, confirmación y alternativa al popup bloqueado. Las pruebas interceptan el handoff y no envían mensajes reales. |
| Dependencias e imágenes | PASS | Manifiesto y lockfile intactos. Cero paquetes o imágenes de producto añadidos; assets aprobados con el mismo contenido. |
| Rendimiento | PASS de presupuesto local, con pendientes | JS menor de 350.000 bytes y CLS menor de 0,1. La transferencia JS crece 14.453–15.275 bytes y la LCP varía; se informa sin convertir datos locales en una afirmación de producción. [Comparación completa](PERFORMANCE.md). |
| TasteSkill visual | FAIL | **34 FAIL / 36 WARN**, suma de incidencias por ruta en 17 páginas; antes del pulido, 56 / 38. [Evaluación y todos los informes](DESIGN.md). |
| TasteSkill de fuente | FAIL | **26 FAIL / 6 WARN** en 44 archivos. Todos los registros y sus decisiones se conservan; no se desactivan reglas. [Fuente](taste-source.json). |

[Resultados estructurados](qa-results.json) · [Galería de 51 comparativas](GALLERY.md) · [Galería con selectores](gallery.html) · [Archivos modificados](MODIFIED-FILES.md).

## Entregas por fase

| Fase | Cambio | Commit de fase | Validación |
| --- | --- | --- | --- |
| 1 | Tokens compartidos, capas CSS, shell progresivo y primitivas | 8a6728c | Lint, TypeScript, build, 90 E2E y Home idéntica. |
| 2 | Servicios y nueve detalles; mismos contenidos, slugs y cotizaciones | 8e46f5e | 90 E2E y capturas de catálogo/detalle en tres tamaños. |
| 3 | Seis industrias y portafolio conceptual honesto | 57dc585 | 93 E2E tras repetición completa; primer fallo conservado. |
| 4 | Propósito, enfoque, compromiso, metodología y blog vacío | c1b66af | 96 E2E; teclado y axe del Accordion. |
| 5 | Campos shadcn nativos y errores; mismo flujo de WhatsApp | fc82875 | 99 E2E; validación, codificación y popup bloqueado. |
| 6 | Layout único, 404, pulido, contraste, foco y auditoría integral | Head final del PR #2 | 105 E2E; todos los tamaños y rutas; Home idéntica. |

Cada fase tiene capturas y datos conservados en [PHASES.md](PHASES.md). Se hicieron pushes normales y actualizaciones del PR Draft. El PR se basa en la rama V3.1 aprobada para aislar el diff de migración.

## Correcciones realizadas

- Conflicto CSS heredado que estrechaba las interfaces dentro de las tarjetas: se separa el ejemplo del enlace y se conserva el ancho disponible.
- Repetición de tarjetas y contornos en catálogo y relacionados: directorio y filas editoriales, con el contenido comercial completo.
- Leyendas repetidas extensas y escala de declaración excesiva: se acortan las leyendas de demos y se distingue el párrafo de Propósito de un título.
- Avisos importantes del formulario de 14 px y línea muy larga: 16 px con ancho máximo de 60ch.
- Borde de control con contraste inferior a 3:1: token específico para formularios, sin cambiar el input original del sistema aprobado. Se verifica el color renderizado en E2E.
- Etiqueta parcialmente cubierta al enfocar el primer campo inválido: margen local y desplazamiento inmediato limitado a Contacto; nueva aserción de visibilidad de la etiqueta bajo el header.
- Layout premium limitado por ruta: header y footer únicos, también en errores 404; estado actual de navegación en interiores.
- Bloqueo SWC de npm ci: cierre acotado a dos previews antiguos identificados por ruta, módulo y puerto.

La Home, el catálogo de datos comerciales, los dos assets, los tres archivos de E2E originales y la configuración de Playwright se verifican contra la base mediante Git. Son **15 archivos conservados exactamente**.

## Incidencias de ejecución y diagnóstico

La fase 3 registró inicialmente 86 PASS / 7 FAIL: seis timeouts anómalos de 20–44 minutos y una navegación chrome-error. La repetición completa dio 93/93 PASS sin cambiar código ni aserciones. [Primer resultado](phase-3-solutions-portfolio/interrupted-run.json).

La primera ejecución integral registró 99 PASS / 6 FAIL, todos por timeout, incluido el montaje de la página del navegador. Hubo además un timeout de captura. Los eventos de Windows confirman suspensión de 44 minutos durante la fase 3 y reposo moderno entre las 20:04 y las 20:19 durante la ejecución integral. Las duraciones coinciden con los periodos sin ejecución; no se presenta ese resultado como PASS ni se atribuye automáticamente el chrome-error al reposo.

Se conservan los [errores integrales](phase-6-final/parallel-run-failures.json) y los [eventos consultados](phase-6-final/environment-events.json). Una repetición secuencial dio 105/105 PASS; después se restauró la concurrencia original y se verificaron de nuevo las 105 pruebas tras cada corrección visual o de accesibilidad. La corrida final utiliza la configuración original.

La nueva aserción de etiqueta reveló además un fallo real de UI: 104 PASS / 1 FAIL, con la etiqueta de Nombre parcialmente cubierta en escritorio. El margen por sí solo no bastaba con el scroll suave heredado. Se desactiva ese desplazamiento animado únicamente mientras Contacto está presente, se conserva el margen local y la aserción permanece intacta. Se verifican movimiento normal y reducido en los tres tamaños. [Fallo conservado](phase-6-final/focus-label-failure.json).

Se utilizó una petición temporal de actividad de Windows, limitada a 15 minutos por ejecución y liberada al terminar. No se cambió el plan de energía; la API respeta la suspensión manual. [Referencia de Microsoft](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-setthreadexecutionstate).

## Decisiones técnicas

Se conservan las capas CSS heredadas para evitar una limpieza masiva que altere el sistema base. Tokens y reglas nuevas se aplican a los interiores; los antiguos componentes de layout dejan de montarse. Su retirada completa queda como mantenimiento independiente.

Input, Textarea y NativeSelect adaptan los patrones oficiales de shadcn al prefijo Tailwind existente. NativeSelect conserva selección móvil nativa, validación HTML, teclado y serialización, sin paquetes adicionales. El formulario sigue preparando el mensaje en memoria; no se añaden backend, almacenamiento, analítica ni servicios externos.

No se añaden clientes, testimonios, resultados o publicaciones ficticias. Las interfaces son estáticas y están identificadas como demostraciones. El portafolio y el blog esperan materiales reales aprobados.

## Límites, pendientes y recomendación

**Apto para revisión del propietario manteniendo el PR en Draft.** No constituye aprobación de producción ni certificación completa de accesibilidad.

- Confirmar visualmente la migración y aprobar textos, políticas y contenidos editoriales antes de una futura publicación.
- Validar Safari, Firefox, dispositivos físicos y lectores de pantalla; esta evidencia usa Chromium emulado. axe no cubre todos los criterios, por eso se añaden comprobaciones de contraste y foco.
- Revisar la transferencia JS adicional y la LCP móvil de Contacto en un perfil controlado y en la futura Preview; no hay mediciones de campo, INP o Lighthouse de producción.
- Definir NEXT_PUBLIC_SITE_URL con el dominio aprobado antes del build de cualquier entorno alojado. Localmente canonical/sitemap usan el fallback existente localhost:3000.
- Mantener los hallazgos estrictos de TasteSkill visibles. Su resolución futura depende en parte de material real autorizado y de decisiones del propietario sobre movimiento; no se reemplaza la identidad por una puntuación.
- npm avisó que ESLint 9.39.5 ya no tiene soporte. La actualización se propone como mantenimiento separado, conservando el lockfile de esta migración.

GitHub Actions no se reintentó manualmente ni se modificó facturación. El workflow existente solo se activa para PR hacia main; este PR Draft se apila sobre V3.1. No se afirma un PASS remoto de CI. PR #1 permanece abierto y Draft. No se realizan despliegues de producción, merges, force-push o cambios en main.
