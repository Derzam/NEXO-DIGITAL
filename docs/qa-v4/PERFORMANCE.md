# Rendimiento local: V3.1 → V4

Local production build, Windows, Node 24.14.0, npm 11.9.0, Chromium via Playwright 1.64.1, 3 original workers, no CPU/network throttling; one sample per route and viewport. Historical approved V3.1 baseline. Not field CWV, Lighthouse, INP or a causal before/after experiment.

No se presentan estas muestras como rendimiento de producción. La concurrencia, la caché del sistema, el planificador y las fuentes introducen variación; las corridas interrumpidas por reposo se excluyen de esta comparación, conservando sus errores.

| Ruta | Ancho | LCP antes → después, ms | CLS final | JS antes → después, bytes | Diferencia JS |
| --- | --- | --- | --- | --- | --- |
| / | 390 | 364 → 260 | 0 | 173107 → 187560 | +14453 (8.35%) |
| /contacto | 390 | 232 → 224 | 0 | 174612 → 189887 | +15275 (8.75%) |
| / | 768 | 492 → 392 | 0 | 173107 → 187560 | +14453 (8.35%) |
| /contacto | 768 | 524 → 460 | 0 | 174612 → 189887 | +15275 (8.75%) |
| / | 1440 | 352 → 392 | 0 | 174612 → 189887 | +15275 (8.75%) |
| /contacto | 1440 | 504 → 424 | 0 | 174612 → 189887 | +15275 (8.75%) |

El JS observado aumenta aproximadamente 14–15 KB (8–9%). Permanece por debajo del presupuesto de 350.000 bytes. Cambió el grafo de componentes/chunks al compartir el shell premium y añadir controles; no se atribuye una causa exacta sin perfil de bundle. La LCP móvil de Contacto pasa de 232 a 224 ms en estas muestras. Debe verificarse bajo condiciones controladas y en la futura Preview, sin ocultar la diferencia mediante promedios.

CLS final máximo: 0. Cero solicitudes de fuentes externas durante los recorridos. No se mide INP.

| Imagen | V3.1 y V4, bytes | Cambio |
| --- | --- | --- |
| nexo-threshold.webp | 105014 | 0, mismo contenido |
| nexo-wordmark.webp | 20850 | 0, mismo contenido |

No hay nuevas dependencias ni imágenes de producto. Manifiesto, lockfile y los dos assets conservan sus contenidos de V3.1; ver [contratos](phase-6-final/contracts.json). Los PNG/JPG de docs son evidencia de QA y no forman parte de la carga de las páginas.

[Datos comparados](qa-results.json) · [Base aprobada](../qa-v3-1/qa-results.json) · [Corrida final](phase-6-final/results.json).