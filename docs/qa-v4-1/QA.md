# Informe de QA — Nexo Digital Studio V4.1

Fecha: 27 de octubre de 2026. Base de auditoría: `codex/interiors-shadcn-migration` en `29d1925b4641bad49572c1ac582a45e5d693be04`. Candidato independiente: `codex/v4-1-preflight`. Este informe no autoriza integración ni producción.

## Resumen de gates

| Gate | Estado | Hallazgo principal |
|---|---|---|
| 1. Revisión visual | **PASS** | 24 vistas, ocho rutas y tres tamaños sin overflow; Home exacta en 6/6 comparaciones. |
| 2. Rendimiento | **PARTIAL** | 30 mediciones controladas V4.1 y atribución V3.1/V4; el build final usa Webpack por fallo de herramienta Turbopack, así que los bytes no se comparan directamente entre esas compilaciones. |
| 3. Compatibilidad | **PARTIAL** | Chromium y Firefox 108/108 PASS; WebKit 105/108 PASS. Los tres fallos son el primer Tab hacia el skip link bajo la política del WebKit automatizado. |
| 4. Seguridad y SEO | **PASS con pendientes del propietario** | Sin vulnerabilidades reportadas, filtraciones de secretos ni almacenamiento/envío del formulario al servidor. Dominio canónico y aviso legal requieren datos verificados. |
| 5. Regresiones | **PARTIAL** | 105 pruebas previas conservadas, una prueba de seguridad añadida. El contacto pasa axe en los tres motores; se mantiene la limitación de teclado WebKit. |
| 6. Preparación de integración | **PASS para revisión** | PR Draft independiente basado en V4; no se hizo merge, rebase, despliegue ni cambio en `main`, PR #1 o PR #2. |

## Gate 1 — Revisión visual

- La Home y su hero no cambiaron. Comparación exacta de las capturas V3.1: **6/6 PASS, cero píxeles diferentes** en 390, 768 y 1440 px, para primer viewport y página completa.
- Se inspeccionaron Servicios y detalles, Contacto, Soluciones y Portafolio a 390, 768 y 1440 px. Las 24 solicitudes capturadas devolvieron HTTP 200, sin overflow horizontal.
- La identidad, header, navegación móvil, escala tipográfica, jerarquía editorial y demostraciones de producto siguen coherentes. Los bloques visuales conservan sus avisos de “Demo” y no se presentan como casos de clientes.
- No se rediseñaron secciones. Los ajustes se limitan a la navegación de validación bajo header fijo y al contraste temporal del submit mientras se hidrata.
- Alturas medidas en móvil: Home 7 215 px, Servicios 4 971 px, Soluciones 5 833 px, detalle de servicio 4 359–4 420 px, Contacto 2 876 px y Portafolio 3 165 px. No hay overflow, aunque Home y Soluciones son recorridos largos que conviene evaluar en aceptación comercial.
- [Galería comparativa antes/después](GALLERY.md) · [geometría y respuestas](after/capture-results.json) · [prueba exacta de Home](after/home-comparison.json).

## Gate 2 — Rendimiento

- La afirmación de un aumento general de 14–15 KB entre V3.1 y V4 no se confirma en Home al sumar todos los recursos JS; el resultado observado fue −2 007 B. Contacto sí mostró +5 445 B en tablet/escritorio y +31 379 B en móvil.
- La atribución por source maps sugiere cambio del header desde chunk dinámico a estático, pero no prueba causalidad exclusiva. El analizador nativo de Next cerró con código `0xC0000409` antes de exportar el grafo.
- V4.1 tiene 30 muestras propias con CPU 4×, red limitada, caché deshabilitada, cinco repeticiones por ruta/ancho. Los valores, límites de comparación y bytes completos están en [Rendimiento](PERFORMANCE.md) y [el JSON de muestras](performance-v4-1.json).
- El build predeterminado (`npm run build`, Turbopack) no pudo crear su proceso auxiliar de CSS en este entorno. `npm run build -- --webpack` compiló correctamente el build de producción. No se modificó la configuración del proyecto para ocultar el problema. Hace falta confirmar el comando estándar en un entorno compatible antes de integración.

## Gate 3 — Compatibilidad

Suite E2E completa: **108 pruebas por motor**, 36 escenarios × tres proyectos responsive.

| Motor | Versión | Resultado | Omitidas | Observación |
|---|---:|---:|---:|---|
| Chromium | 156.0.8078.4 | **108/108 PASS** | 0 | Ejecución completa sobre el código final; menú, cotización, rutas, WhatsApp, axe y rendimiento local. |
| Firefox | 157.0 | **108/108 PASS** | 0 | Ejecución completa sobre el código final. LCP disponible; CLS no está expuesto por este motor en el host. |
| WebKit | 27.2 | **105/108 PASS** | 0 | Solo falla `keyboard skip link` al Tab inicial, una vez por cada viewport. Contacto y axe pasan. |

Se conserva la prueba original del skip link; no se reemplazó por foco programático ni se forzó un click. Apple documenta que Safari puede excluir enlaces de la secuencia normal de Tab según la preferencia de teclado; el WebKit automatizado de esta máquina no expone esa preferencia. [Atajos de teclado de Safari](https://support.apple.com/en-ie/guide/safari/cpsh003/27.0/mac/27). La verificación en Safari real con el ajuste de navegación por teclado y en lector de pantalla físico sigue pendiente.

## Gate 4 — Seguridad y SEO

- `npm audit`: **0 vulnerabilidades** entre 519 dependencias instaladas.
- Escaneo de secretos: 161 archivos de texto; sin claves privadas ni tokens conocidos. `.env.example` es el único archivo de entorno rastreado.
- Enlaces externos comprobados: WhatsApp abre con `noopener noreferrer`. El sitio prepara el mensaje, la persona revisa el texto y lo envía manualmente; no se manda automáticamente.
- El formulario no usa almacenamiento local, endpoint de aplicación, correo ni beacon. Se cerró el riesgo de envío nativo GET antes de hidratar, que podía dejar datos personales en la URL. El fallback sin JavaScript no incluye los campos.
- Canonical, title, description, idioma, viewport, robots, sitemap y 404/noindex verificados por E2E.
- Antes de producción, el propietario debe confirmar `NEXT_PUBLIC_SITE_URL`/dominio canónico y facilitar datos legales reales del responsable, canal de privacidad/derechos, finalidad/bases, conservación y tratamiento de WhatsApp. No se inventaron esos datos; ver [revisión de seguridad y privacidad](SECURITY.md).

## Gate 5 — Regresiones

- Se mantienen los 105 casos previos. Se añadió uno para comprobar que sin JavaScript el formulario no filtra PII en el query string y que no intenta enviar WhatsApp; con tres proyectos da 108 ejecuciones.
- La suite completa final de Chromium y Firefox pasó 108/108 en cada motor, incluyendo el ajuste definitivo de `scroll-padding` del contacto. El formulario WebKit pasó 9/9 repeticiones además de la suite WebKit completa.
- El contraste temporal del botón deshabilitado pasó axe en Contacto para los tres motores y viewports. No se desactivaron reglas ni se alteraron expectativas para obtener PASS.
- `npm run lint`: PASS. `npm run typecheck`: PASS. Build de producción Webpack: PASS. Build Turbopack estándar: FAIL por proceso auxiliar de entorno.
- No se reintentó GitHub Actions; sigue aplicando el bloqueo conocido. No se obtuvo un resultado CI remoto nuevo.
- No hay dispositivo físico ni lector de pantalla real disponible en esta sesión.

## Gate 6 — Integración

La propuesta detallada está en [INTEGRATION.md](INTEGRATION.md). PR #1 y #2 se mantienen abiertos/Draft; `main` permanece intacta. La ruta recomendada es acordar y revisar la base de PR #1, asegurar la ascendencia V3.1 que necesita PR #2 antes de retargetearlo, integrar solo después de aceptación y luego rebasar/revalidar V4.1 como PR Draft contra `main`. Ninguno de esos pasos de integración se ejecutó.

## Recomendación

Se puede cerrar la fase de desarrollo visual: la Home aprobada permanece idéntica y las correcciones responsive no cambian el diseño. Pasar a aceptación comercial es razonable. La preparación de producción debe esperar la decisión sobre skip link/Safari y lectores de pantalla, la revisión legal y de dominio, y una ejecución satisfactoria del build estándar/CI cuando GitHub Actions deje de estar bloqueado.
