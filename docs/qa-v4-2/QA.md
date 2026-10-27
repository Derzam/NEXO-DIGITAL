# Gates de release — V4.2

Fecha: 27 de octubre de 2026. Base `codex/v4-1-preflight` en `08c3b1bc3bd54a2ce369366e45de302548441eb7`; rama `codex/v4-2-release-gates`. Esta auditoría no autoriza integración ni producción.

| Gate | Estado y alcance |
| --- | --- |
| A. WebKit y Safari | **PASS automatizado** en Chromium, Firefox y WebKit; Safari real y tecnologías de asistencia **NO VERIFICADOS**. |
| B. Build | **PASS local** con el comando estándar Webpack y con Turbopack en copia limpia. Turbopack en el checkout principal **FAIL**; causa raíz **NO VERIFICADA**. CI y Vercel **NO VERIFICADOS**. |
| C. Rendimiento | **PASS de análisis** con controles comparables; no se adoptó una optimización sin demostrar conservación de funcionalidad. |
| D. Regresiones | **PASS local** en las suites de los tres motores, axe, formulario y comparación visual. La prueba reforzada de prehidratación se ejecutó por separado después de las suites completas. |
| E. Integración | **PASS de análisis**; se recomienda estudiar el PR consolidado, sujeto a gates y aceptación. No se ejecutó ningún merge. |

## A. Skip link y compatibilidad

El enlace es un `<a href="#contenido">` y el destino es `<main id="contenido" tabindex="-1">`. Antes de la corrección, el WebKit de Playwright para Windows omitía el enlace al primer Tab; el mismo comportamiento se reprodujo en [HTML mínimo](skip-link/minimal-results.json). Se añadió `tabIndex={0}` al enlace para incorporarlo al orden nativo del teclado, sin llamar a `.focus()`, forzar un click ni modificar la prueba estricta.

La sonda posterior usa Tab y Enter reales: **9/9 PASS** en tres motores y tres tamaños. El enlace queda dentro del viewport, con contorno visible, y Enter cambia el fragmento y enfoca el `main`. Ver [mediciones](skip-link/skip-link-results.json) y capturas WebKit [390](skip-link/webkit-focus-390.png), [768](skip-link/webkit-focus-768.png) y [1440](skip-link/webkit-focus-1440.png).

Apple documenta el uso de Tab y Option+Tab para navegar por enlaces y una preferencia que intercambia su comportamiento en Safari: [atajos de Safari](https://support.apple.com/en-ie/guide/safari/cpsh003/27.0/mac/27). Alt+Tab en WebKit de Windows no demuestra el comportamiento de Option+Tab en macOS. Safari real, dispositivos físicos y lectores de pantalla siguen **NO VERIFICADOS**.

## B. Build

El checkout principal falló con Turbopack al conectar el worker de PostCSS, mientras una copia limpia del candidato compiló con ese motor. No se ha identificado la variable causante. Se eligió `next build --webpack` como script estándar; el comando para CI y Vercel es `npm run build`, sujeto a verificar su configuración efectiva. `npm run build:turbopack` deja disponible el ensayo alternativo. Ver [ensayos, comandos y logs](BUILD.md). El bloqueo conocido de GitHub Actions no se reintentó, por lo que CI remoto sigue **BLOQUEADO/NO VERIFICADO**.

## C. Rendimiento

En cinco repeticiones equivalentes para Contacto a 390 px, el baseline Webpack de V4.1 transfirió 250 113 B codificados de JS. Los controles sin header y sin formulario registraron 235 315 B y 240 890 B. La eliminación también altera funcionalidad, chunks y prefetch: las diferencias no son pesos exclusivos. Se conservaron ambas funciones y los [resultados anteriores](../qa-v4-1/PERFORMANCE.md). El [análisis V4.2](PERFORMANCE.md) incluye muestras y controles reproducibles.

## D. Regresiones

| Comprobación | Resultado |
| --- | --- |
| Lint y TypeScript | **PASS** después de los cambios finales de código y pruebas. |
| Build estándar `npm run build` | **PASS local** con Webpack. |
| Chromium, Firefox y WebKit | **111/111 PASS por motor**, cero omitidas y cero flaky en las suites completas a 390, 768 y 1440 px. |
| Prehidratación reforzada | **9/9 PASS** adicionales, tres tamaños por motor. |
| Axe y recorridos | **PASS** para las 16 rutas en los tres tamaños y motores; los recorridos incluyen menú, formularios y WhatsApp interceptado. |
| Home aprobada | **6/6 PASS exacto**, 0 píxeles distintos para primer viewport y página completa en los tres tamaños. [Resultado](home/home-comparison.json). |

Se conservaron los 108 casos ejecutados por motor en V4.1; la prueba nueva añade tres ejecuciones por motor. Las suites completas pasaron antes de reforzar esa prueba con valores sintéticos; luego se ejecutó la versión reforzada por separado en los nueve casos. Durante la primera suite Chromium, una versión inicial de la prueba nueva falló al prohibir toda query, incluida la precarga técnica `_rsc` de Next; el [resultado 110/111](playwright-chromium-initial.json) se conserva. La prueba ahora solo admite ese parámetro tras hidratar y busca los valores sintéticos en todas las solicitudes observadas. Los controles deshabilitados con esos valores producen `FormData` vacío. Esta prueba no sustituye una auditoría de seguridad integral.

Resultados completos: [Chromium](playwright-chromium-final.json), [Firefox](playwright-firefox-final.json), [WebKit](playwright-webkit-final.json); pruebas reforzadas: [Chromium](playwright-chromium-prehydration.json), [Firefox](playwright-firefox-prehydration.json), [WebKit](playwright-webkit-prehydration.json). El formulario prepara el mensaje de WhatsApp para revisión y envío manual; las pruebas interceptaron la salida y no enviaron mensajes reales.

El [escaneo heurístico de secretos](security-scan.json) no encontró coincidencias de sus patrones conocidos. No reemplaza una revisión completa de seguridad.

Una ejecución de TypeScript simultánea con la regeneración de `.next` falló al encontrar archivos transitorios ausentes; la ejecución posterior al build pasó. No se cambiaron reglas para ocultar ese fallo.

## E. Integración y pendientes

La [comparación de alternativas](INTEGRATION.md) recomienda evaluar un PR consolidado contra `main` tras resolver gates y aceptación. La evidencia acumulada hace grande el diff, y preservar la ascendencia puede marcar PR #1 como integrado indirectamente. No se modificaron `main`, PR #1, #2 ni #3, ni se desplegó o cambió facturación.

**Pendientes:** Safari real y lector de pantalla; confirmación de build y CI en sus entornos; dominio y datos legales verificados; aceptación comercial. El proyecto **no está listo para producción** mientras esos controles sigan pendientes o bloqueados.
