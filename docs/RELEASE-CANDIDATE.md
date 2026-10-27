# Trazabilidad del candidato

Base de integración propuesta: `main` en `5902bd54b3ac5ccea08114398700551bfa3e3410`. Fuente aprobada V4.2: `25f2b9fd9b84ba97f253dd89e417240710b47a54`. El candidato es una selección nueva sobre `main`; no implica integración ni autorización de producción.

Las revisiones históricas permanecen en [PR #1](https://github.com/Derzam/NEXO-DIGITAL/pull/1), [PR #2](https://github.com/Derzam/NEXO-DIGITAL/pull/2), [PR #3](https://github.com/Derzam/NEXO-DIGITAL/pull/3) y [PR #4](https://github.com/Derzam/NEXO-DIGITAL/pull/4). Los [resultados y riesgos V4.2](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v4-2/QA.md) y la [galería V4](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/docs/qa-v4/GALLERY.md) están vinculados al commit histórico inmutable.

El candidato conserva aplicación, assets, configuración, lockfile, todas las pruebas y las seis referencias Home. El [manifiesto](CANDIDATE-MANIFEST.json) identifica los archivos incluidos y sus hashes. El README cambia enlaces históricos a URLs del commit V4.2 y describe la comparación actual de Home.

Dos herramientas de archivo histórico se conservan en V4.2 pero se excluyen de esta selección operativa: [gallery.cjs](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/scripts/qa-v4/gallery.cjs) requiere 96 capturas históricas adicionales, y [record-phase.cjs](https://github.com/Derzam/NEXO-DIGITAL/blob/25f2b9fd9b84ba97f253dd89e417240710b47a54/scripts/qa-v4/record-phase.cjs) registra estados PASS sin ejecutar los controles. Ninguna forma parte de las suites actuales. Para reproducir la galería histórica deben restaurarse deliberadamente sus entradas desde el commit histórico, sin tratar su ausencia como una prueba superada.

La [guía de herramientas](TOOLS.md) identifica las entradas generadas o suministradas para cada script. Las herramientas de rendimiento y atribución requieren que el operador suministre las versiones y builds indicados en sus argumentos. Las herramientas que generan capturas o metadatos requieren un servidor local y escriben sus propias salidas. No se incluyen resultados históricos pesados en este snapshot.

La [matriz comercial](ACCEPTANCE.md) y las validaciones de Safari real, dispositivos, lectores de pantalla, CI y Vercel siguen pendientes. Ningún resultado local constituye aprobación de producción.
