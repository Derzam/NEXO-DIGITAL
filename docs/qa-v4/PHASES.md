# Estado de la migración V4

Base aprobada: `881817b5e6a67cdda3d17807d95ff30c64a7ec22`. Rama: `codex/interiors-shadcn-migration`. El PR permanece Draft y se basa en V3.1.

| Fase | Estado | Controles y evidencias |
| --- | --- | --- |
| 1. Fundamentos | PASS | Lint, TypeScript, build; 90/90 E2E; Home completa y primer viewport idénticos en 390, 768 y 1440 px. [Datos](phase-1-foundations/results.json), [píxeles](phase-1-foundations/home-comparison.json). |
| 2. Servicios | PASS | Lint, TypeScript, build; 90/90 E2E. Catálogo y nueve detalles; mismas URLs, metadatos y cotizaciones. [Datos](phase-2-services/results.json), [Home idéntica](phase-2-services/home-comparison.json). |
| 3. Soluciones y Portafolio | Pendiente | Categorías y estados honestos. |
| 4. Nosotros y Blog | Pendiente | Identidad, metodología y estructura editorial. |
| 5. Contacto | Pendiente | Campos y validación; misma lógica de WhatsApp. |
| 6. Consistencia y QA | Pendiente | Shell global, 404, npm ci, suite completa y galería. |

Los estilos heredados se conservan; no se activa una página premium antes de migrar su contenido. Las limitaciones de CI remoto y las preferencias de TasteSkill se documentarán sin modificar facturación o desactivar reglas.

## Fase 2 — Servicios

Dos servicios destacados utilizan Card de shadcn e interfaces HTML del sistema aprobado. El resto se presenta en filas editoriales, sin una cuadrícula de nueve tarjetas idénticas. Los detalles separan contexto, posibilidades, entregables y servicios relacionados; conservan todo el contenido comercial de `content.ts` y el mensaje específico de WhatsApp. Las demostraciones se identifican como ejemplos, sin atribuirlas a clientes.

Se corrigió durante la revisión un conflicto de `align-items` heredado que estrechaba las interfaces dentro de los enlaces. La demostración ahora está fuera del enlace y ocupa el ancho disponible; el foco permanece visible. No se modificaron los 90 escenarios originales. Capturas de catálogo y Landing pages en 390/768/1440 px en `phase-2-services/`; Home completa y primer viewport con diferencia exacta de cero píxeles.
