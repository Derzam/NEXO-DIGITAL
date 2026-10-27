# Estado de la migración V4

Base aprobada: `881817b5e6a67cdda3d17807d95ff30c64a7ec22`. Rama: `codex/interiors-shadcn-migration`. El PR permanece Draft y se basa en V3.1.

| Fase | Estado | Controles y evidencias |
| --- | --- | --- |
| 1. Fundamentos | PASS | Lint, TypeScript, build; 90/90 E2E; Home completa y primer viewport idénticos en 390, 768 y 1440 px. [Datos](phase-1-foundations/results.json), [píxeles](phase-1-foundations/home-comparison.json). |
| 2. Servicios | PASS | Lint, TypeScript, build; 90/90 E2E. Catálogo y nueve detalles; mismas URLs, metadatos y cotizaciones. [Datos](phase-2-services/results.json), [Home idéntica](phase-2-services/home-comparison.json). |
| 3. Soluciones y Portafolio | PASS tras repetición | Lint, TypeScript, build; **93/93 E2E**, 0 flaky/skipped. [Datos](phase-3-solutions-portfolio/results.json), [Home idéntica](phase-3-solutions-portfolio/home-comparison.json). Primera ejecución: 86 PASS / 7 FAIL, [diagnóstico conservado](phase-3-solutions-portfolio/interrupted-run.json). |
| 4. Nosotros y Blog | PASS | Lint, TypeScript, build; **96/96 E2E**. Metodología con teclado y axe; blog vacío. [Datos](phase-4-about-blog/results.json), [Home idéntica](phase-4-about-blog/home-comparison.json). |
| 5. Contacto | PASS | Lint, TypeScript, build; **99/99 E2E**. Validación, codificación, presupuesto opcional, fallback y errores accesibles. [Datos](phase-5-contact/results.json), [foco](phase-5-contact/focus-errors.json), [Home idéntica](phase-5-contact/home-comparison.json). |
| 6. Consistencia y QA | PASS técnico / FAIL estético estricto | npm ci, lint, TypeScript y build PASS; **105/105 E2E**, configuración original. 69 escaneos axe, 0 infracciones; 51 vistas sin overflow; Home idéntica. [Datos](phase-6-final/results.json), [galería](GALLERY.md), [TasteSkill](DESIGN.md). |

Los estilos heredados se conservan; no se activa una página premium antes de migrar su contenido. Las limitaciones de CI remoto y las preferencias de TasteSkill se documentarán sin modificar facturación o desactivar reglas.

## Fase 2 — Servicios

Dos servicios destacados utilizan Card de shadcn e interfaces HTML del sistema aprobado. El resto se presenta en filas editoriales, sin una cuadrícula de nueve tarjetas idénticas. Los detalles separan contexto, posibilidades, entregables y servicios relacionados; conservan todo el contenido comercial de `content.ts` y el mensaje específico de WhatsApp. Las demostraciones se identifican como ejemplos, sin atribuirlas a clientes.

Se corrigió durante la revisión un conflicto de `align-items` heredado que estrechaba las interfaces dentro de los enlaces. La demostración ahora está fuera del enlace y ocupa el ancho disponible; el foco permanece visible. No se modificaron los 90 escenarios originales. Capturas de catálogo y Landing pages en 390/768/1440 px en `phase-2-services/`; Home completa y primer viewport con diferencia exacta de cero píxeles.

## Fase 3 — Soluciones y Portafolio

Las seis industrias alternan texto comercial e interfaces de ejemplo adaptadas a sus recorridos. Se mantienen las categorías, descripciones y mensajes de WhatsApp. El portafolio distingue el estudio conceptual de interfaz del futuro caso real autorizado; no se agregan clientes, métricas ni proyectos entregados. Capturas en `phase-3-solutions-portfolio/`, sin overflow, y seis comparaciones de Home idénticas.

La primera suite registró 86 PASS y 7 FAIL: seis timeouts con duraciones de 20–44 minutos pese al límite configurado de 45 segundos, y una navegación `chrome-error`. La anomalía sugiere interrupción del entorno, sin causa confirmada. Se conservan títulos, errores y tiempos del resultado fallido. Se exige una repetición completa sin modificar aserciones, reintentos o timeouts antes de la siguiente fase. La revisión automática de permisos impidió un intento de repetición por límite de uso; ese comando no se ejecutó. La repetición posterior pudo iniciarse tras la indicación del propietario de continuar.

La repetición completa terminó **93/93 PASS en 1,5 minutos**, sin cambios de código ni configuración entre ejecuciones. Los siete casos anteriores pasan de nuevo. No queda un fallo reproducible que bloquee la fase siguiente; la incidencia se mantiene documentada.

## Fase 4 — Nosotros y Blog

Propósito se presenta como declaración editorial; Enfoque y Compromiso conservan los textos originales. La metodología reutiliza el Accordion aprobado, con las cinco etapas originales y apertura por teclado. Blog mantiene el estado vacío y distingue los temas futuros de publicaciones reales, sin fechas, autores o artículos inventados. Se añaden tres escenarios de teclado, cierre, axe en estado expandido y navegación desde Blog. Los 90 escenarios originales siguen intactos. Capturas en los tres tamaños y seis comparaciones exactas de Home en `phase-4-about-blog/`.

## Fase 5 — Contacto

Input, Textarea y NativeSelect siguen los patrones oficiales de shadcn y los tokens existentes, con Tailwind prefijado. Se eligió [Native Select](https://ui.shadcn.com/docs/components/base/native-select) para conservar validación HTML, selectores móviles, teclado, serialización y la cobertura `selectOption` existente. No requiere dependencias nuevas. [Input](https://ui.shadcn.com/docs/components/base/input) y [Textarea](https://ui.shadcn.com/docs/components/radix/textarea) comparten tamaños, foco y estados inválidos.

Se conserva el manejador de WhatsApp: validación nativa y posterior recorte de nombre/proyecto, correo `type=email`, mínimos de contenido, presupuesto opcional, `encodeURIComponent`, apertura `noopener,noreferrer`, confirmación local y enlace alternativo. No se agregan almacenamiento, solicitudes de red con datos del formulario, backend ni servicios. Los errores en español usan `role=alert`, `aria-invalid` y `aria-describedby`; se retiran al editar el campo.

El formulario aparece antes del apoyo comercial en móvil, con campos de 52 px y texto de 16 px. Los tres escenarios nuevos comprueban errores, foco, orden de Tab y axe en estado inválido. El envío vacío deja el primer campo visible bajo el header en los tres tamaños ([mediciones](phase-5-contact/focus-errors.json)); capturas iniciales e inválidas en `phase-5-contact/`. Los 90 escenarios previos pasan sin cambios y Home completa/primer viewport tienen cero píxeles distintos.

## Fase 6 — Consistencia y QA integral

El layout utiliza un único header y footer premium para todas las rutas, incluida 404. Se conserva la configuración de metadata, robots y sitemap, y se añade foco/estado actual de navegación en interiores sin cambiar el aspecto de Home. Se conserva CSS heredado como capa base y por compatibilidad; los antiguos componentes de layout ya no se montan en el sitio. Su retirada completa puede hacerse como limpieza independiente, con sus propias comparaciones.

`npm ci` falló primero por un archivo SWC bloqueado. Se identificaron por módulo, ruta de ejecutable y puertos los dos previews antiguos de este repositorio (3110/3111), se cerraron únicamente esos procesos y la repetición instaló 445 paquetes con 0 vulnerabilidades reportadas. No cambian manifiesto ni lockfile. npm emitió una advertencia de soporte de ESLint 9.39.5; no se actualizan dependencias fuera del alcance.

La primera suite integral dio 99 PASS / 6 FAIL por timeout ([errores](phase-6-final/parallel-run-failures.json)); una captura agotó también su tiempo. Los eventos de Windows confirman reposo moderno entre las 20:04 y las 20:19, coincidiendo con las duraciones anómalas. Se confirmó también la suspensión de 44 minutos de la fase 3 ([eventos](phase-6-final/environment-events.json)). La primera navegación `chrome-error` no se atribuye de forma independiente a esa suspensión.

Una repetición completa secuencial dio 105/105 PASS. Se restauró después la concurrencia original y se verificó la suite tras el pulido visual. No se aumentan timeouts ni se modifican aserciones originales. Para las comprobaciones se utilizó una petición temporal de actividad de Windows, limitada por proceso y tiempo, sin modificar el plan de energía. La API respeta la suspensión manual del usuario; [documentación de Microsoft](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-setthreadexecutionstate).

El primer TasteSkill de las 17 rutas se conserva íntegro en `taste/`. La revisión elimina los divisores del catálogo y entregables, sustituye las tarjetas de relacionados por filas editoriales, acorta las leyendas repetidas de Soluciones, distingue la declaración de Propósito de un titular y amplía los avisos del formulario a 16 px y 60 caracteres de ancho. No cambia el contenido comercial ni la Home. El inspector se repitió en todas las rutas afectadas; los resultados se conservan sin excepciones o reglas desactivadas.

El cierre técnico pasa 105/105 E2E con tres workers y el timeout original. Se conserva el fallo real de etiqueta (104 PASS / 1 FAIL): el scroll suave heredado interfería con la validación nativa en escritorio. Contacto usa ahora desplazamiento inmediato y un margen de foco local; la etiqueta queda a 110 px del borde superior frente a un header de 88 px, también con movimiento normal. La aserción que detectó el defecto no se relaja. Se mejora además el contraste no textual del borde a un mínimo de 3,61:1 y se verifica su color renderizado en las tres resoluciones.

Resultado visual estricto acumulado: 34 FAIL / 36 WARN en 17 rutas, frente a 56 / 38 antes del pulido; fuente 26 FAIL / 6 WARN. Los 13 recorridos modificados se vuelven a inspeccionar y Contacto se repite tras las correcciones de contraste/foco. Se mantienen todos los informes de ambas pasadas. La evaluación no constituye un PASS estético automático. [Informe final](QA.md), [rendimiento](PERFORMANCE.md), [registros de fuente](taste-source.json).
