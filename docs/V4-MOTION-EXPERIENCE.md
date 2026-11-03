# V4 — Motion Experience

## Objetivos y alcance

La fase añade movimiento discreto y progresivo a la experiencia pública de Nexo Digital Studio sin rediseñar las páginas, cambiar sus textos o alterar su semántica. Se priorizaron CSS nativo, `IntersectionObserver`, contenido funcional antes de hidratación y el respeto a `prefers-reduced-motion`. No se agregó ninguna dependencia.

La línea base fue `main` en `1011c2ce54e80b6450a7d334f88b7c3d487ec39b`. El trabajo se implementa en `feat/v4-motion-experience` y solo contempla rutas públicas.

## Inventario público

El App Router contiene ocho archivos públicos de página que cubren la portada, `/blog`, `/contacto`, `/nosotros`, `/portafolio`, `/servicios`, `/soluciones` y la ruta dinámica `/servicios/[slug]`. Esta última genera nueve páginas de servicio: `landing-pages`, `sitios-corporativos`, `sistemas-web`, `aplicaciones-moviles`, `inteligencia-artificial`, `automatizacion`, `auditoria-qa`, `seo` e `integraciones`.

Los puntos compartidos relevantes son `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/proposal/refined-sections.tsx`, `src/components/proposal/interactions.tsx`, `src/components/proposal/header.tsx`, `src/components/proposal/footer.tsx`, `src/components/proposal/customer-reviews.tsx` y `src/components/interiors/*`. Se mantienen intactos `/admin/**`, `/api/**`, autenticación, middleware, formularios, consultas y almacenamiento de reseñas.

## Arquitectura Motion

- `src/components/motion/motion-enhancer.tsx` es un pequeño client enhancer y no incorpora una biblioteca de animación. Tras montar en una ruta pública, observa secciones semánticas de `<main>` situadas por debajo del primer 72% del viewport.
- Las secciones son visibles en el HTML inicial. Solo cuando JavaScript e `IntersectionObserver` están disponibles se les asigna un estado pendiente legible (opacidad 0,96 y subida de 20 px); al entrar en el viewport (umbral 0.01; margen inferior `-8%`) completan el efecto una sola vez.
- Los eventos `focusin` y `pointerover` revelan de inmediato la sección enfocada o sobre la que se interactúa; un cambio posterior a movimiento reducido también revela cualquier sección pendiente. No se emplean `display:none`, `visibility:hidden`, `aria-hidden`, interceptación de enlaces ni transiciones de ruta.
- El enhancer omite `/admin` y `/api`. Si JavaScript falla o el navegador no soporta `IntersectionObserver`, el contenido sigue visible.
- `src/styles/motion.css` concentra los keyframes, transiciones, microinteracciones y anulaciones de movimiento reducido. Las animaciones de composición usan solo `opacity` y `transform`.

## Parámetros y microinteracciones

| Elemento | Efecto | Duración / parámetros |
|---|---|---|
| Indicador del hero | Fade | 350 ms |
| Título del hero | Fade + subida de 18 px | 650 ms; retardo 60 ms |
| Subtítulo del hero | Fade + subida de 18 px | 550 ms; retardo 140 ms |
| CTA del hero | Fade + subida de 18 px | 450 ms; retardo 220 ms |
| Cierre del hero | Fade | 450 ms; retardo 300 ms |
| Secciones públicas bajo el primer viewport | Fade sutil + subida | 560 ms; desplazamiento 20 px; una vez |
| Tarjetas de servicios y bento | Elevación discreta en hover | 3 px; solo puntero fino |
| Iconos de navegación/CTA | Desplazamiento sutil | 220 ms; solo hover capaz |

La curva compartida es `cubic-bezier(.16,1,.3,1)`. No se añadió parallax; la escena principal y sus recursos existentes se conservan.

## Movimiento reducido y accesibilidad

Con `prefers-reduced-motion: reduce`, el contenido se presenta inmediatamente, se quitan los desplazamientos/transiciones decorativos y el desplazamiento suave del documento pasa a automático. Los indicadores de foco siguen visibles y el foco de teclado no espera a que termine una transición. Las tarjetas no dependen del hover en pantallas táctiles. Los estados de formularios y de negocio no cambian.

Se añadieron pruebas automatizadas para reduced motion, contenido sin JavaScript, CTA, enlaces de ancla, foco por teclado, scroll reveal, rutas públicas, overflow y axe-core. La revisión axe del estado estático se realiza con movimiento reducido para evaluar el contraste del contenido visible sin confundirlo con el estado transitorio de revelado. No sustituye una evaluación manual con lectores de pantalla.

## Rendimiento

No se añadieron paquetes ni activos gráficos. En una comparación local de builds de producción, mismo navegador Chromium, viewport 1440×900, contextos fríos y sin throttling, se registró una muestra de LCP/CLS y JavaScript transferido:

| Ruta | Build | LCP local | CLS local | JS codificado |
|---|---|---:|---:|---:|
| `/` | `main` | 76 ms | 0 | 262.220 bytes |
| `/` | V4 | 88 ms | 0 | 263.570 bytes |
| `/contacto` | `main` | 48 ms | 0 | 255.491 bytes |
| `/contacto` | V4 | 48 ms | 0 | 256.185 bytes |

El delta observado en JavaScript fue **+1.350 bytes (+0,515%)** en `/` y **+694 bytes (+0,272%)** en `/contacto`. El LCP local cambió +12 ms en `/` y 0 ms en `/contacto`; CLS fue 0 en las cuatro mediciones. Son muestras locales únicas y no valores de campo ni resultados de laboratorio bajo carga, por lo que no se extrapolan a producción. INP no se midió. Los datos brutos están en [performance-comparison.json](evidence/v4-motion-experience/performance-comparison.json).

## Verificación visual

Se comparó la captura de página completa de `main` y de V4 con reduced motion en 1440×900, 768×1024, 390×844 y 375×667. Las cuatro comparaciones resultaron **pixel-perfect**: no hubo diferencias de tamaño ni de píxeles entre la línea base y la rama, consistente con el requisito de conservar el diseño en reposo. Las capturas de V4 están guardadas en `docs/evidence/v4-motion-experience/`.

| Viewport | Captura V4 |
|---|---|
| Escritorio 1440×900 | [home-desktop-reduced.png](evidence/v4-motion-experience/home-desktop-reduced.png) |
| Tablet 768×1024 | [home-tablet-reduced.png](evidence/v4-motion-experience/home-tablet-reduced.png) |
| Móvil 390×844 | [home-mobile-390-reduced.png](evidence/v4-motion-experience/home-mobile-390-reduced.png) |
| Móvil 375×667 / reduced motion | [home-mobile-375-reduced.png](evidence/v4-motion-experience/home-mobile-375-reduced.png) |

## Pruebas realizadas

- `npm run lint`: aprobado.
- `npm run typecheck`: aprobado.
- `npm run build`: aprobado con Next.js 16.4.3. Se conservó el aviso preexistente de Next sobre la convención `middleware` deprecada.
- `npx playwright test tests/e2e/v4-motion-experience.spec.ts`: **19 aprobadas, 1 omitida** en la ejecución matricial. La omisión corresponde a la prueba de revelado/foco del proyecto 375px, que ejecuta deliberadamente el proyecto entero con movimiento reducido; ese proyecto sí ejecuta los escenarios de reduced motion, navegación, CTA, rutas, overflow y JavaScript desactivado.
- `npm run test:e2e`: **260 aprobadas, 3 omitidas y 3 fallidas**. Las tres fallidas son el mismo test preexistente de `tests/e2e/seo.spec.ts`, que exige que el canonical de `/` termine en `/`; tanto `main` como V4 entregan `http://localhost:3000` sin barra final. La salida es idéntica en ambos builds y no se modificó la lógica SEO. Las pruebas Motion Experience pasan dentro de la matriz completa.

**Dictamen de integración: HOLD por esa discrepancia de canonical heredada**, no por una regresión de Motion Experience. No se cambió la prueba ni el metadata SEO dentro de esta fase para no ampliar su alcance.

## Mantenimiento y riesgos residuales

Para añadir una nueva página pública, usar secciones semánticas dentro de `<main>` permite que el enhancer las considere sin convertir la página en Client Component. Para excluir intencionalmente una sección del reveal, usar `data-motion="off"`. Mantener los keyframes y las preferencias en `src/styles/motion.css`; no añadir bibliotecas de animación sin medir su beneficio. Revisar los focos de teclado al introducir nuevos elementos interactivos dentro de secciones reveladas.

El contenido fuera del viewport conserva opacidad 0,96 mientras espera el reveal y se muestra completo al entrar, recibir foco, recibir interacción de puntero o cambiar a movimiento reducido. La revisión automatizada no es una auditoría manual WCAG completa. INP de campo o laboratorio permanece pendiente.
