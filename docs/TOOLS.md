# Herramientas de QA incluidas

El build y las seis suites E2E de `tests/e2e/` no dependen de capturas históricas. Los scripts siguientes son herramientas opcionales: las entradas indicadas como suministradas o generadas son requisitos explícitos de cada ejecución, no archivos de datos comerciales.

| Herramienta | Entradas y salidas necesarias |
| --- | --- |
| `scripts/qa-v4/compare-home.cjs` | Directorio de capturas nuevas como argumento y las seis imágenes Home incluidas en `docs/qa-v4/before/`; escribe allí `home-comparison.json`. |
| `scripts/qa-v4/capture.cjs` | Servidor local en puerto 3120 y directorio de salida como argumento; genera capturas y JSON. |
| `scripts/qa-v4/metadata.cjs` | Servidor local en puerto 3120; escribe en `docs/qa-v4/phase-6-final/`, directorio incluido. |
| `scripts/qa-v4-1/capture.cjs` | URL base y directorio de salida como argumentos. |
| `scripts/qa-v4-1/module-attribution.cjs` | Dos directorios de builds suministrados por el operador, con sus manifiestos `.next` y mapas de fuente cuando se requieran. |
| `scripts/qa-v4-1/performance.cjs` | JSON suministrado con versiones `{name, sha, url}` y ruta de salida; las URLs deben apuntar a builds locales disponibles. |
| `scripts/qa-v4-1/security-scan.cjs` | Checkout Git con los archivos del candidato rastreados; su escaneo es heurístico y no sustituye revisión de seguridad. |
| `scripts/qa-v4-2/capture-home.cjs` | URL base y directorio de salida; sirve para la comparación exacta de Home. |
| `scripts/qa-v4-2/skip-link.cjs` | URL base y directorio de salida; usa navegadores Playwright instalados y navegación de teclado. |
| `scripts/qa-v4-2/skip-minimal.cjs` | Ruta de salida JSON cuyo directorio exista y navegadores Playwright instalados. |

La galería histórica y el registrador de fase se mantienen accesibles mediante enlaces inmutables en [la trazabilidad del candidato](RELEASE-CANDIDATE.md). No son requisitos de las pruebas actuales.
