# Controles de rendimiento V4.2

Estos controles eliminan temporalmente componentes en copias aisladas para medir el efecto conjunto sobre las peticiones de JavaScript de `/contacto`. No son propuestas para publicar: la navegación y el formulario son funcionalidad requerida.

## Reconstrucción

1. Desde el repositorio, exportar `08c3b1bc3bd54a2ce369366e45de302548441eb7` con `git archive --format=tar` incluyendo `src`, `public`, `next.config.ts`, `postcss.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json` y `components.json`. Extraer el mismo tar en tres carpetas hermanas `baseline`, `no-header`, `no-form` fuera del repositorio. En cada una, enlazar `node_modules` a las dependencias ya instaladas del repositorio. En Windows se usaron junctions de directorio.
2. En `no-header/src/app/layout.tsx`, eliminar la importación de `ProposalHeader` y su `<ProposalHeader />`; ver `header-control.diff`.
3. En `no-form/src/app/contacto/page.tsx`, eliminar la importación de `ContactForm` y su `<ContactForm />`; ver `form-control.diff`. No tocar las otras dos copias.
4. En cada copia, ejecutar `npm run build -- --webpack` con Next 16.4.3 y las mismas dependencias. Los tres builds completaron compilación, TypeScript y generación de páginas. El host advirtió que ignoró un lockfile externo en `C:\Users\Derly Zambrano`; los tres usaron el mismo entorno y el lockfile exportado al directorio de cada copia.
5. Servir los builds con `npm run start -- --hostname 127.0.0.1 --port 3140`, `3141` y `3142`, respectivamente. Situar `measure.cjs` en el directorio padre y ejecutar `node measure.cjs`. La sonda utiliza `baseline/node_modules/@playwright/test`; escribe `results.json` en el directorio actual. Los tres procesos locales se cerraron al terminar.

## Datos y alcance

`results.json` conserva las 15 muestras, recursos y tiempos. Chromium 156.0.8078.4 sobre Windows, Node 24.14.0 y Ryzen 5 7535HS; 390 × 844, emulación móvil y táctil, CPU 4×, latencia 150 ms, descarga 200 000 B/s, subida 93 750 B/s, caché deshabilitada, cinco repeticiones intercaladas por variante y 3,5 segundos de espera tras `networkidle`. Todas devolvieron HTTP 200.

Cada repetición sumó `encodedBodySize` y `transferSize` para recursos `.js` de todos los initiators. Baseline 250 113 B codificados, sin header 235 315 B y sin formulario 240 890 B, sin variación entre repeticiones. Las diferencias incluyen cambios de fragmentación y prefetch. Las páginas de control tienen contenido distinto: su LCP no demuestra una mejora viable y no demuestra el peso exclusivo de un componente. Estas observaciones no establecen la causa exacta de la diferencia histórica entre V3.1 y V4.
