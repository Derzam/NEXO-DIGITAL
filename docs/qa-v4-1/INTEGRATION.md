# Propuesta de integración segura

No se ejecutó integración ni se cambió `main`, PR #1 o PR #2.

## Estado comprobado

- PR #1 conserva su estado OPEN / Draft.
- PR #2 conserva su estado OPEN / Draft y se basa en V3.1.
- `main` sigue en `5902bd54b3ac5ccea08114398700551bfa3e3410`.
- V4 está 17 commits delante de `main` y sin commits detrás al momento de la auditoría; V4 contiene seis commits posteriores a V3.1.

## Orden recomendado cuando el propietario lo autorice

1. Revisar PR #1 y acordar qué versión será el primer cimiento de producción; aprobar e integrar PR #1 con su historia intacta y mediante la estrategia habitual del repositorio. No hacer squash si se quiere conservar la ascendencia necesaria para comparar el stack.
2. Confirmar que el commit V3.1 de PR #2 ya es ancestro de `main`. Si PR #1 integra otra base, conciliar V3.1 mediante un PR puente revisable antes de retargetear #2. No reescribir ramas históricas.
3. Retargetear PR #2 a `main` solo después de esa comprobación y revisar su diff resultante, sin modificar su head histórico.
4. Integrar PR #2 únicamente tras aceptación del propietario. Luego rebasear `codex/v4-1-preflight` sobre el V4 integrado, resolver conflictos sin sobrescribir cambios aprobados, repetir gates y abrir/actualizar un Draft PR de V4.1 contra `main`.
5. Mantener los PR en Draft hasta revisión visual, privacidad/legal y aceptación comercial. La autorización de producción sigue siendo exclusiva del propietario.

No solicitar reintentos de GitHub Actions mientras continúe el bloqueo conocido. No desplegar ni cambiar facturación.
