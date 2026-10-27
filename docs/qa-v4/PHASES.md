# Estado de la migración V4

Base aprobada: `881817b5e6a67cdda3d17807d95ff30c64a7ec22`. Rama: `codex/interiors-shadcn-migration`. El PR permanece Draft y se basa en V3.1.

| Fase | Estado | Controles y evidencias |
| --- | --- | --- |
| 1. Fundamentos | PASS | Lint, TypeScript, build; 90/90 E2E; Home completa y primer viewport idénticos en 390, 768 y 1440 px. [Datos](phase-1-foundations/results.json), [píxeles](phase-1-foundations/home-comparison.json). |
| 2. Servicios | PASS | Lint, TypeScript, build; 90/90 E2E. Catálogo y nueve detalles; mismas URLs, metadatos y cotizaciones. [Datos](phase-2-services/results.json), [Home idéntica](phase-2-services/home-comparison.json). |
| 3. Soluciones y Portafolio | PASS tras repetición | Lint, TypeScript, build; **93/93 E2E**, 0 flaky/skipped. [Datos](phase-3-solutions-portfolio/results.json), [Home idéntica](phase-3-solutions-portfolio/home-comparison.json). Primera ejecución: 86 PASS / 7 FAIL, [diagnóstico conservado](phase-3-solutions-portfolio/interrupted-run.json). |
| 4. Nosotros y Blog | PASS | Lint, TypeScript, build; **96/96 E2E**. Metodología con teclado y axe; blog vacío. [Datos](phase-4-about-blog/results.json), [Home idéntica](phase-4-about-blog/home-comparison.json). |
| 5. Contacto | PASS | Lint, TypeScript, build; **99/99 E2E**. Validación, codificación, presupuesto opcional, fallback y errores accesibles. [Datos](phase-5-contact/results.json), [foco](phase-5-contact/focus-errors.json), [Home idéntica](phase-5-contact/home-comparison.json). |
| 6. Consistencia y QA | Pendiente | Shell global, 404, npm ci, suite completa y galería. |

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
