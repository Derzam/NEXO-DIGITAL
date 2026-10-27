# JavaScript en Contacto móvil — V4.2

Se compararon tres copias aisladas del mismo SHA V4.1 (`08c3b1b`), con las mismas dependencias y el mismo build Webpack. Chromium midió `/contacto` a 390×844, con caché deshabilitada, CPU 4×, latencia de 150 ms, descarga de 200 000 B/s y subida de 93 750 B/s. Cada variante se midió cinco veces en orden intercalado, con espera de 3,5 s tras `networkidle`. Todas las respuestas fueron HTTP 200.

| Variante experimental | JS codificado, mediana | Cambio frente a base | LCP mediano | CLS |
| --- | ---: | ---: | ---: | ---: |
| Base | 250 113 B | — | 1 340 ms | 0 |
| Sin header | 235 315 B | −14 798 B (−5,92 %) | 1 332 ms | 0 |
| Sin formulario | 240 890 B | −9 223 B (−3,69 %) | 1 232 ms | 0 |

Los bytes fueron idénticos en las cinco repeticiones de cada variante. Las páginas de control eliminan funcionalidad y contenido; además, el empaquetador y el prefetch pueden reorganizar las peticiones. Por ello las diferencias describen el efecto conjunto observado, no el peso exclusivo de cada componente. Sus LCP tampoco prueban una mejora aplicable al sitio completo. No se adoptó ninguna de las dos variantes como optimización.

La prueba identifica oportunidades para un futuro prototipo que conserve el menú, el formulario y sus recorridos. Una división de código solo debería adoptarse si una medición equivalente demuestra una mejora sin regresiones. Las [muestras, sonda y diffs de control](performance-lab/README.md) permiten reconstruir el experimento. Los [resultados V4.1](../qa-v4-1/PERFORMANCE.md) se conservan; el cambio histórico V3.1→V4 no queda explicado de forma exclusiva por estos controles.
