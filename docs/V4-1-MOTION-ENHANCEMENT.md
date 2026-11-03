# V4.1 — Mejora de movimiento (Motion Experience)

**Validación:** 3 de noviembre de 2026
**Rama:** `fix/v4-motion-visibility`
**Base comparativa limpia:** `main` en `52e678d3653728e07542d70deb59123e0af2e928`

## 1. Diagnóstico previo a las correcciones

La auditoría se realizó primero sobre `main`, antes de cambiar estilos o componentes de producto. Se guardaron estados computados y capturas en [`evidence/v4-1-motion-enhancement/baseline/`](evidence/v4-1-motion-enhancement/baseline/).

### Causa raíz confirmada

El scroll reveal de V4 no producía una transición CSS real: la regla de transición existía solo en `data-motion="pending"`. Al cambiar `IntersectionObserver` el atributo a `data-motion="visible"`, esa regla dejaba de coincidir; Chromium no emitía `transitionrun`, `transitionstart` ni `transitionend`, ni creaba objetos de transición. El contenido saltaba directamente al estado final.

Las animaciones del hero sí estaban conectadas, pero el ascenso era de 18 px y la curva de movimiento concentraba casi todo el cambio al inicio: en el punto medio, el título ya había recorrido prácticamente toda su distancia. La tarjeta de servicios del baseline se elevaba 3 px. La hoja Motion se cargaba y el token global `--ease` estaba definido; no se encontraron errores JavaScript ni colisiones que explicaran el salto del reveal.

El diagnóstico técnico, los estilos computados y el estado sin JavaScript están en [`baseline-computed-styles.json`](evidence/v4-1-motion-enhancement/baseline/baseline-computed-styles.json). Las capturas del hero son [inicio](evidence/v4-1-motion-enhancement/baseline/hero-initial-baseline.png), [mitad](evidence/v4-1-motion-enhancement/baseline/hero-middle-baseline.png) y [final](evidence/v4-1-motion-enhancement/baseline/hero-final-baseline.png); las del hover, [reposo](evidence/v4-1-motion-enhancement/baseline/card-before-baseline.png) y [paso del puntero](evidence/v4-1-motion-enhancement/baseline/card-hover-baseline.png).

## 2. Implementación final

- Se mantuvo la transición del reveal en ambos estados. En scroll, las secciones interpolan `transform` durante 680 ms; las tarjetas seleccionadas añaden `translate`/`scale` con transición de 620 ms y retraso escalonado de 85 ms, limitado a 340 ms.
- Se amplió el recorrido visible del hero y se agregó una luz ambiental decorativa, animada solo mediante `transform` y `opacity`. Los elementos principales usan la curva local de Motion, sin tocar el token global `--ease`.
- El CTA del hero sube 20 px, pero no desvanece su texto: la primera medición de axe mostró una caída temporal de contraste cuando el CTA se animaba con opacidad. Se conservó la entrada visual con transform para que el contraste sea estable durante el movimiento.
- Las tarjetas públicas pasan de la elevación legacy de 3 px a 6 px, con cambio de borde y sombra. CTA e iconos tienen microinteracciones acotadas a dispositivos con puntero fino.
- Si el foco, el puntero o un pointer-down alcanza una sección pendiente —o aún en transición—, esta se lleva al estado final sin transición antes de la siguiente pintura. Así, el reveal no desplaza el objetivo bajo el usuario durante un click o una interacción de teclado.
- `prefers-reduced-motion` desactiva las animaciones decorativas, los desplazamientos y los reveals; el contenido permanece visible. La mejora es progresiva: sin JavaScript, las secciones y enlaces siguen visibles.
- Se conserva un observer por ruta pública, limpieza de observers, listeners y `requestAnimationFrame` al navegar, y restauración de los atributos/estilos previos. `/admin/**` y `/api/**` quedan fuera del enhancer.

La captura del salto sin transición de V4 se conserva en [`scroll-after-intersection-no-transition.png`](evidence/v4-1-motion-enhancement/baseline/scroll-after-intersection-no-transition.png).

## 3. Validación

`npm run lint`, `npm run typecheck` y `npm run build` pasan con el código final.

La nueva suite [`v4-1-motion-visibility.spec.ts`](../tests/e2e/v4-1-motion-visibility.spec.ts) terminó con **16 pruebas aprobadas y 8 omitidas intencionalmente**: los casos de fotogramas del hero, hover con puntero fino, axe de escritorio y video se ejecutan una vez en escritorio y se omiten en mobile/tablet para no duplicar esas capturas. El resto se ejecuta en los viewports aplicables. La suite observa transiciones CSS reales, estado inicial/intermedio/final, stagger, retorno del hover, reduced motion, contenido sin JavaScript, navegación App Router y aislamiento administrativo.

La corrida total final de `npm run test:e2e` obtuvo **276 aprobadas, 11 omitidas y 3 fallidas**. Las tres fallas son la misma aserción previa de SEO para el canonical de `/`: el HTML devuelve `http://localhost:3000`, mientras el test espera `http://localhost:3000/`, en mobile-390, tablet-768 y desktop-1440. No se modificaron SEO, canonical, sitemap ni robots. El fallo también se reprodujo en el `main` limpio (`npx playwright test tests/e2e/seo.spec.ts --project=desktop-1440`: 2 aprobadas, 1 fallida con el mismo canonical); por tanto, no es una regresión de V4.1.

## 4. Comparación visual y rendimiento local

Se compararon builds locales equivalentes de `main` y V4.1 con Chromium, usando `prefers-reduced-motion: reduce`, en portada y sección de servicios. El diff de píxeles es **0 en los 8 pares** —home y servicios, en cuatro viewports—, lo que confirma que el aspecto en reposo no cambió. Las capturas de V4.1 incluyen [desktop](evidence/v4-1-motion-enhancement/comparison/desktop-1440-v41-home.png), [tablet](evidence/v4-1-motion-enhancement/comparison/tablet-768-v41-home.png), [mobile 390](evidence/v4-1-motion-enhancement/comparison/mobile-390-v41-home.png) y [mobile 375](evidence/v4-1-motion-enhancement/comparison/mobile-375-v41-home.png). También se guardó la sección de servicios en cada dimensión.

| Viewport | Cuerpos JS main → V4.1 | Delta JS | LCP main → V4.1 | Delta LCP | CLS main → V4.1 |
|---|---:|---:|---:|---:|---:|
| Desktop 1440 | 869,241 → 871,063 B | +1,822 B (+0.2096 %) | 96 → 188 ms | +92 ms | 0 → 0 |
| Tablet 768 | 842,461 → 844,274 B | +1,813 B (+0.2152 %) | 100 → 148 ms | +48 ms | 0 → 0 |
| Mobile 390 | 840,893 → 842,702 B | +1,809 B (+0.2151 %) | 88 → 112 ms | +24 ms | 0 → 0 |
| Mobile 375 | 840,893 → 842,702 B | +1,809 B (+0.2151 %) | 92 → 88 ms | −4 ms | 0 → 0 |

Estas son mediciones de laboratorio en localhost, **una corrida por variante y viewport**; no son Core Web Vitals de usuarios reales. El incremento JS observado es de aproximadamente 1.8 KB (0.21 %) y el CLS permanece en cero. Los resultados completos están en [`comparison-metrics.json`](evidence/v4-1-motion-enhancement/comparison/comparison-metrics.json) y el resumen de deltas/diffs en [`comparison-summary.json`](evidence/v4-1-motion-enhancement/comparison/comparison-summary.json).

## 5. Evidencia de movimiento real

La suite guardó fotogramas antes, durante y después del reveal en [`runtime/desktop-1440/`](evidence/v4-1-motion-enhancement/runtime/desktop-1440/) y capturas reduced-motion en [mobile](evidence/v4-1-motion-enhancement/runtime/mobile-390/reduced-motion.png) y [tablet](evidence/v4-1-motion-enhancement/runtime/tablet-768/reduced-motion.png). El [video de demostración (3.08 s)](evidence/v4-1-motion-enhancement/runtime/video/motion-demo.webm) se grabó en Chromium con movimiento real, no se ensambló desde fotogramas estáticos.

## Alcance protegido

No se modificaron `/admin/**`, `/api/**`, autenticación, Supabase, reseñas, base de datos, formularios, middleware, SEO, canonical, sitemap, robots, WhatsApp, credenciales ni integraciones externas. El trabajo queda en una rama de revisión y no incluye merge ni despliegue.
