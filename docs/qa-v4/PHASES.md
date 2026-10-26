# Estado de la migración V4

Base aprobada: `881817b5e6a67cdda3d17807d95ff30c64a7ec22`. Rama: `codex/interiors-shadcn-migration`. El PR permanece Draft y se basa en V3.1.

| Fase | Estado | Controles y evidencias |
| --- | --- | --- |
| 1. Fundamentos | PASS | Lint, TypeScript, build; 90/90 E2E; Home completa y primer viewport idénticos en 390, 768 y 1440 px. [Datos](phase-1-foundations/results.json), [píxeles](phase-1-foundations/home-comparison.json). |
| 2. Servicios | Pendiente | Catálogo y nueve detalles. |
| 3. Soluciones y Portafolio | Pendiente | Categorías y estados honestos. |
| 4. Nosotros y Blog | Pendiente | Identidad, metodología y estructura editorial. |
| 5. Contacto | Pendiente | Campos y validación; misma lógica de WhatsApp. |
| 6. Consistencia y QA | Pendiente | Shell global, 404, npm ci, suite completa y galería. |

Los estilos heredados se conservan; no se activa una página premium antes de migrar su contenido. Las limitaciones de CI remoto y las preferencias de TasteSkill se documentarán sin modificar facturación o desactivar reglas.
