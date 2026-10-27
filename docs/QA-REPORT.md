# Historial de QA — Nexo Digital Studio

## Gates V4.2

La rama independiente `codex/v4-2-release-gates`, desde V4.1 `08c3b1bc3bd54a2ce369366e45de302548441eb7`, corrige el acceso al skip link en WebKit automatizado y establece Webpack como build estándar. Las suites completas pasaron 111/111 por motor; la prueba reforzada de prehidratación pasó 9/9 por separado. La Home aprobada sigue idéntica en 6/6 capturas. Safari real, CI/Vercel y aceptación comercial siguen pendientes. El proyecto no está listo para producción. Detalle y evidencia: [QA V4.2](qa-v4-2/QA.md).

## Auditoría V4.1

La auditoría final de experiencia, compatibilidad y rendimiento corresponde a la rama independiente **codex/v4-1-preflight**, iniciada desde V4 `29d1925b4641bad49572c1ac582a45e5d693be04`. El detalle de los seis gates, resultados, riesgos y límites se documenta en [QA V4.1](qa-v4-1/QA.md), con [capturas comparativas](qa-v4-1/GALLERY.md), [rendimiento](qa-v4-1/PERFORMANCE.md), [seguridad y privacidad](qa-v4-1/SECURITY.md) y [plan de integración](qa-v4-1/INTEGRATION.md).

La Home aprobada quedó intacta (6/6 comparaciones exactas). Chromium y Firefox pasaron 108/108; WebKit pasó 105/108, con tres fallos del primer Tab al skip link. El build Webpack pasó; el Turbopack predeterminado no pudo iniciar su proceso auxiliar CSS en este host. Revisión legal/dominio y compatibilidad física continúan pendientes.

El [PR #3 V4.1](https://github.com/Derzam/NEXO-DIGITAL/pull/3) está abierto en Draft contra `codex/interiors-shadcn-migration`; sin integración a `main`. PR #1 y #2 siguen abiertos en Draft. No se desplegó producción, no se modificó facturación ni se reintentó GitHub Actions.

---

## Historial V4

La revisión de esa fase fue **V4, migración premium de interiores**, rama **codex/interiors-shadcn-migration**, desde **881817b5e6a67cdda3d17807d95ff30c64a7ec22**. El SHA de publicación se identifica en el head del [PR #2 Draft](https://github.com/Derzam/NEXO-DIGITAL/pull/2) y en su entrega.

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
