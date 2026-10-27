# Rendimiento y atribución de JavaScript — V4.1

## Método

La comparación base usa compilaciones de producción aisladas de V3.1 (`881817b5e6a67cdda3d17807d95ff30c64a7ec22`) y V4 (`29d1925b4641bad49572c1ac582a45e5d693be04`). Chromium se ejecutó con caché deshabilitada, CPU 4× más lenta, latencia de 150 ms, descarga de 200 000 B/s y subida de 93 750 B/s. Se tomaron cinco repeticiones en `/` y `/contacto`, a 390, 768 y 1440 px: 60 muestras. La carga y orden se alternaron; estos valores describen el laboratorio, no usuarios reales.

El tamaño de JavaScript suma `encodedBodySize` de todos los recursos `.js` observados, incluidos los iniciados por preload/prefetch. LCP y CLS son observaciones de la página cargada, no métricas de campo ni una auditoría Core Web Vitals completa.

## Resultado de la comparación base

| Ruta / ancho | JS V3.1 | JS V4 | Δ V4−V3.1 |
|---|---:|---:|---:|
| Home, todos los anchos | 191 612 B | 189 605 B | −2 007 B |
| Contacto, 390 px | 160 554 B | 191 933 B | +31 379 B |
| Contacto, 768 px | 176 649 B | 182 094 B | +5 445 B |
| Contacto, 1440 px | 176 649 B | 182 094 B | +5 445 B |

La afirmación de un aumento general de 14–15 KB no se confirma en la Home al contabilizar todos los `.js`: ese corte anterior contaba solo los recursos con `initiatorType=script`. En la Home de 390 px, esa métrica parcial pasó de 173 110 B a 187 570 B (+14 460 B), mientras que los chunks iniciados por link bajaron de 18 502 B a 2 035 B; el total observable disminuyó 2 007 B.

El contacto sí muestra un aumento de recursos JS en V4, especialmente a 390 px. Los mapas de fuentes apuntan a un cambio de alcance de carga: V3.1 conserva el `ProposalHeader` y sus componentes shadcn en un chunk dinámico, mientras que el layout de V4 importa el header estáticamente para todas las rutas. La atribución es arquitectónica y no prueba que el header explique por sí solo toda la diferencia de 31 379 B.

## LCP / CLS base

Medianas observadas, en milisegundos, de cinco repeticiones:

| Ruta | Ancho | LCP V3.1 | LCP V4 | CLS |
|---|---:|---:|---:|---:|
| Home | 390 | 2 796 | 2 948 | 0 en ambas |
| Home | 768 | 2 664 | 2 824 | 0 en ambas |
| Home | 1440 | 2 744 | 2 704 | 0 en ambas |
| Contacto | 390 | 2 004 | 1 524 | 0 en ambas |
| Contacto | 768 | 1 748 | 1 712 | 0 en ambas |
| Contacto | 1440 | 1 856 | 1 916 | 0 en ambas |

La variación de LCP entre repeticiones es suficiente para no atribuir causalidad a cambios pequeños. Firefox y WebKit no exponen `layout-shift` en esta instalación; allí CLS se registra como **no disponible**, nunca como cero.

Nota de integridad: la sonda histórica del lote base guardó rutas de recursos pero no su origen. Por ello, su campo `externalFonts` no se usa como prueba. La verificación de fuentes externas se toma de la prueba E2E, que inspecciona los nombres absolutos de los recursos; las fuentes de la aplicación se sirven desde `/_next/static/media`.

## Atribución y límite de herramienta

El análisis por mapas de fuente identifica el mismo grupo de marca y navegación en ambos diseños: el chunk dinámico V3.1 mide aproximadamente 16 508 B gzip y el chunk estático de V4 aproximadamente 16 240 B gzip. Se conservan los assets de producción y sus mapas dentro de los artefactos locales de auditoría.

El exportador de grafo de módulos nativo de `next analyze` se cerró en Windows con código `0xC0000409` antes de producir `modules.data`; export no terminó por el archivo ausente. No se informa como análisis nativo exitoso. Se usaron mapas de fuente de la compilación y bytes de recursos medidos por navegador como evidencia alternativa.

## V4.1

Se tomaron cinco muestras por ruta y viewport (30 en total) sobre el build V4.1 en producción local, con las mismas condiciones CPU/red, caché deshabilitada y bloqueo de service workers. El candidato se construyó con Webpack porque el build Turbopack terminó con un fallo nativo al crear su proceso auxiliar CSS; por ello, los bytes de V4.1 **no se comparan directamente** con los builds V3.1/V4 de la tabla anterior, aunque el perfil de navegador sea idéntico.

| Ruta | Ancho | LCP mediano | CLS mediano | JS observado, todos los initiators |
|---|---:|---:|---:|---:|
| Home | 390 px | 3 272 ms | 0 | 244 098 B (244 098–244 422) |
| Home | 768 px | 3 420 ms | 0,0000262 | 244 098 B |
| Home | 1440 px | 2 764 ms | 0,0000396 | 251 192 B |
| Contacto | 390 px | 1 268 ms | 0 | 249 896 B (241 743–249 896) |
| Contacto | 768 px | 1 248 ms | 0,0000031 | 249 896 B |
| Contacto | 1440 px | 1 156 ms | 0,0000268 | 251 192 B |

Los valores describen la máquina de laboratorio con throttling y no son métricas de campo. En Home 390 px, JS varió 324 B; en Contacto 390 px, 8 153 B. La traza muestra que dos muestras no incluyeron en Resource Timing dos chunks de 8 153 B sumados; probablemente el prefetch de Next se inició después del corte de `networkidle`. El rango se conserva y el valor no se presenta como tamaño estable de transferencia. Las mediciones no evidencian un salto de CLS significativo en esta captura; CLS fue medido solo en Chromium, que es el motor que expone `layout-shift` en esta instalación.

## Conclusiones y límites

- La afirmación general de +14–15 KB de V3.1 a V4 no queda demostrada en Home: al sumar todos los recursos JS, V4 registró 2 007 B menos. En Contacto se midieron +5 445 B en escritorio/tablet y +31 379 B en móvil. Se atribuye parte del cambio al header estático en V4 frente al chunk dinámico de V3.1; los source maps no prueban que sea la única causa.
- V4.1 añade evidencia para revisar esos resultados y una protección de formulario; no añade dependencias. El tamaño de la build Webpack de V4.1 no permite aislar el costo de esos cambios frente al build Turbopack histórico. No se atribuye el aumento aparente de esta tabla a la corrección del formulario.
- El grafo nativo de módulos Next/Turbopack no completó por el cierre `0xC0000409` descrito arriba. La atribución alternativa disponible separa assets cliente y componentes de header/formulario mediante source maps y bytes de red; ver [atribución de módulos](module-attribution.json).
- Oportunidad prioritaria para una siguiente iteración: dividir la carga del header interactivo si la instrumentación sobre el mismo build confirma impacto real en rutas estáticas. No se aplicó porque requiere comparar builds equivalentes y perfilar el costo de hidratación antes de cambiar arquitectura.

Datos completos: [30 muestras V4.1](performance-v4-1.json) y [60 muestras comparativas V3.1/V4](performance-baseline.json).
