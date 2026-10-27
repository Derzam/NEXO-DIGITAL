# Alternativas de integración — V4.2

Esta comparación es una propuesta; no se ejecutó ninguna integración. El análisis cuantitativo usa como referencia `main` en `5902bd54b3ac5ccea08114398700551bfa3e3410` y V4.1 en `08c3b1bc3bd54a2ce369366e45de302548441eb7`; V4.2 añade los cambios y evidencias de este PR.

La ascendencia comprobada es `main` → PR #1 (`c5c0e85`) → V3.1 (`881817b`) → PR #2 (`29d1925`) → PR #3 (`08c3b1b`). El diff de `main` a V4.1 comprende 1 003 archivos: 929 en `docs/`, con 770 archivos binarios en todo el diff. El árbol `docs/` contiene aproximadamente 179,7 MB de blobs sin comprimir; esto no predice el tamaño de transferencia Git, que comprime y deduplica. Los tramos medidos son 89 archivos hasta PR #1, 189 hasta V3.1, 662 hasta PR #2 y 94 hasta PR #3.

| Alternativa | Ventajas | Riesgos y reversión |
| --- | --- | --- |
| A. Integración secuencial | Diffs por etapa más pequeños y reversión por hitos; conserva la historia si se integran los commits con su ascendencia. | PR #2 apunta a V3.1, que requiere un puente o incorporación explícita antes de retargetearlo a `main`. Hay que comprobar cada base y evitar squash si se depende de esa ascendencia. Publicar estados intermedios podría activar despliegues automáticos si existen; se debe comprobar la configuración antes de cualquier integración. |
| B. PR consolidado V4.2 → `main` | Un solo candidato para aceptación; un merge commit conserva la historia y permite revertir el cambio como una unidad. Evita hacer pasar versiones intermedias por `main`. | Diff grande y pesado en evidencias, que exige revisión separada de código y artefactos. Una reversión unitaria también revierte todo el release. Un merge con ascendencia puede hacer que GitHub marque PR #1 como integrado indirectamente; sus revisiones quedan en el historial, pero no debe prometerse que conserve el estado Draft. Un squash cambia esa relación y sacrifica trazabilidad por commit. |

**Recomendación condicionada: B**, una vez resueltos los gates técnicos y la aceptación comercial. Revisar el diff por grupos de código y evidencia, confirmar la política de archivos grandes y la configuración de despliegue, y elegir la estrategia de merge con el propietario. No eliminar evidencias en esta fase. Antes de crear o integrar el PR consolidado, comprobar el `main` real, las bases, los checks y los efectos sobre los PR históricos. La autorización de producción corresponde al propietario.

GitHub documenta los [merges indirectos](https://docs.github.com/en/pull-requests/reference/pull-request-merges) y la [reversión de un PR](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/reverting-a-pull-request). No se reintentó GitHub Actions, ni se modificaron facturación o despliegues.
