# Informe de QA vigente — Nexo Digital Studio

La revisión vigente es **V4, migración premium de interiores**, rama **codex/interiors-shadcn-migration**, desde **881817b5e6a67cdda3d17807d95ff30c64a7ec22**. El SHA de publicación se identifica en el head del [PR #2 Draft](https://github.com/Derzam/NEXO-DIGITAL/pull/2) y en la entrega.

**Resultado técnico: PASS. TasteSkill estricto: FAIL.** Preparado para revisión visual y técnica del propietario manteniendo Draft.

| Control | Resultado |
| --- | --- |
| npm ci, lint, TypeScript y build | PASS |
| E2E finales | 105/105 PASS; 90 originales intactos y 15 nuevos |
| Axe | 69 escaneos, 0 infracciones |
| Responsive | 51 vistas en 390, 768 y 1440 px; sin overflow |
| Home aprobada | 6/6 comparaciones exactas, 0 píxeles distintos |
| TasteSkill visual | 34 FAIL / 36 WARN acumulados en 17 rutas |
| TasteSkill de fuente | 26 FAIL / 6 WARN; todos los registros conservados |

[Informe completo V4](qa-v4/QA.md) · [Resultados estructurados](qa-results.json) · [Fases](qa-v4/PHASES.md) · [Capturas comparativas](qa-v4/GALLERY.md) · [Evaluación estética](qa-v4/DESIGN.md) · [Rendimiento](qa-v4/PERFORMANCE.md) · [Archivos modificados](qa-v4/MODIFIED-FILES.md).

Se documentan las ejecuciones fallidas, la suspensión de Windows confirmada, el bloqueo de SWC y la corrección real de foco del formulario. El JS observado crece aproximadamente 14–15 KB; las mediciones son locales y requieren contraste en una futura Preview. Quedan pendientes validación visual, contenido real autorizado, dominio, navegadores/dispositivos físicos y tecnologías de asistencia.

PR #1 permanece abierto y Draft. No se fusiona, se marca Ready for Review, se modifica main, se despliega producción o se cambia facturación. No se reintenta manualmente GitHub Actions.

Historial: [V3.1](qa-v3-1/QA.md), [V3](home-proposal/QA.md), [V2](QA-REPORT-V2.md), [datos V2](qa-results-v2.json), [V1](QA-REPORT-V1.md).
