# Actualización de wordmark

26 de octubre de 2026. Cambio posterior a `4b119c71c61d09a22239eb755e9268d66cfd9fed`, en `codex/home-shadcn-proposal`.

Se incorpora la identidad NEXO DIGITAL STUDIO del material facilitado por el propietario: símbolo de cinta multicolor, NEXO blanco y subtítulo espaciado. El recurso limpio se adaptó mediante imagegen desde esa referencia; las extracciones con artefactos se descartaron. No se incorporan los precios ni los textos publicitarios del cartel.

El archivo `public/images/nexo-wordmark.webp` mide 1200×312 px y pesa 20.850 bytes. Usa fondo negro y mezcla `screen` para integrarse en las superficies oscuras del sitio. El componente reserva su proporción y conserva un nombre accesible en el enlace de inicio. Se aplica al header y footer de la Home; los interiores V2 conservan su estado.

## Verificación de esta actualización

- Lint, TypeScript y build: **PASS**.
- Playwright: **9/9 PASS** en 390, 768 y 1440 px: Home con SEO/axe/enlaces/overflow; navegación completa con teclado y cierre del menú; rendimiento local.
- Axe: cero infracciones en los tres escaneos de Home.
- Verificación visual del wordmark en la pestaña local del propietario y capturas en los tres tamaños.
- Sin pruebas nuevas o desactivadas para este cambio de marca. La suite completa de 87 escenarios del commit anterior se conserva; esta actualización ejecuta la selección de nueve comprobaciones relevante al cambio.

[Resultados reales](results.json). La evaluación TasteSkill del [informe de la propuesta](../QA.md) corresponde al commit anterior y no se volvió a ejecutar para este ajuste de marca.

## Capturas

| Tamaño | Header | Home | Footer |
| --- | --- | --- | --- |
| 390 px | [Ver](header-390.png) | [Ver](home-390.png) | [Ver](footer-390.png) |
| 768 px | [Ver](header-768.png) | [Ver](home-768.png) | [Ver](footer-768.png) |
| 1440 px | [Ver](header-1440.png) | [Ver](home-1440.png) | [Ver](footer-1440.png) |

V2 y PR #1 continúan disponibles, sin modificar su rama, main, producción o facturación. La migración interior sigue pendiente de aprobación visual.
