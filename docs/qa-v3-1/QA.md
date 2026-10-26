# Nexo Digital Studio — QA V3.1

26 de octubre de 2026. Rama `codex/home-v3-1-refinement`, desde la V3 con wordmark `b924631446a88f983bb5fbeef2a903b7fd652d38`. Hero aprobado: `4b119c71c61d09a22239eb755e9268d66cfd9fed`.

**Resultado técnico: PASS. Preparado para revisión visual de las secciones inferiores.** No se solicita aprobación de migración interior o de producción. Los resultados estrictos de TasteSkill siguen en FAIL y se detallan sin ocultarlos.

## Validación ejecutada

| Comprobación               | Resultado | Evidencia                                                                                                                                                                |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run lint`             | PASS      | ESLint con `--max-warnings=0`.                                                                                                                                           |
| `npm run typecheck`        | PASS      | TypeScript sin errores.                                                                                                                                                  |
| `npm run build`            | PASS      | Build de producción; 20 páginas y recursos estáticos.                                                                                                                    |
| `npm run test:e2e`         | PASS      | **90/90 PASS**; 0 omitidas, 0 fallos y 0 flaky; 197,79 s.                                                                                                                |
| 87 escenarios anteriores   | PASS      | Sus archivos y expectativas permanecen intactos.                                                                                                                         |
| 3 comprobaciones nuevas    | PASS      | Clic en la vista de servicio; Tabs de soluciones por puntero y flechas; objetivos de 44 px; ausencia de superposición; axe del estado seleccionado; enlace a Soluciones. |
| Accesibilidad automatizada | PASS      | 57 escaneos axe WCAG 2/2.1 A/AA: 48 combinaciones de ruta/tamaño y 9 estados interactivos; cero infracciones.                                                            |
| Navegación y WhatsApp      | PASS      | Rutas, servicio, portafolio, 404, menú, Escape, foco y salto al contenido. Formulario y codificación de WhatsApp conservados, sin enviar mensajes reales.                |
| SEO básico                 | PASS      | H1, idioma, título, descripción, canonical, viewport, robots y sitemap de 16 rutas.                                                                                      |
| Responsive                 | PASS      | 390, 768 y 1440 px; sin overflow horizontal. Capturas de todas las secciones.                                                                                            |
| Movimiento reducido        | PASS      | Hero sin animación y contenido disponible; mismo soporte que en V3.                                                                                                      |
| Dependencias               | PASS      | Sin cambios en manifiesto o lockfile y sin paquetes nuevos.                                                                                                              |
| Hero y header              | PASS      | HTML del hero idéntico y seis comparaciones de píxeles idénticas en los tres tamaños.                                                                                    |
| Interiores de control      | PASS      | Contacto y Landing pages: seis comparaciones completas idénticas.                                                                                                        |
| TasteSkill visual          | FAIL      | 2 FAIL / 2 WARN.                                                                                                                                                         |
| TasteSkill de fuente       | FAIL      | 24 FAIL / 5 WARN en src.                                                                                                                                                 |

[Resultados estructurados](qa-results.json) · [Galería completa](GALLERY.md) · [Comparación visual](visual-comparison.json) · [Decisiones](DESIGN.md).

## Conservación de V3

No cambian la imagen, encuadre, texto, tamaño, composición o animación del hero. Tampoco cambian el wordmark, header o footer. La cadena HTML del hero conserva SHA-256 `17aaa1e260b983417610bee695970b9bb7d1dcc09e9c4e02f5085a14f8d78e4c`.

Hero y header aislados: **0 píxeles cambiados** en cada ancho. Contacto y Landing pages: **0 píxeles cambiados** en las seis capturas. El viewport de 768×1024 también alcanza a mostrar el comienzo de Servicios, por debajo del hero, y esa franja sí cambia intencionalmente; el JSON conserva el número y los límites de esos píxeles.

## Compactación medida

Alturas del DOM en píxeles; se mantienen los cinco pasos y las cinco preguntas.

| Ancho   | Metodología V3 → V3.1 | FAQ V3 → V3.1 | Reducción combinada |
| ------- | --------------------- | ------------- | ------------------- |
| 390 px  | 1.015 → 723 px        | 789 → 575 px  | 28,1 %              |
| 768 px  | 1.008 → 728 px        | 779 → 584 px  | 26,6 %              |
| 1440 px | 675 → 485 px          | 618 → 428 px  | 29,4 %              |

La Home completa crece al incorporar una sección de soluciones y ejemplos de software con más contenido. No se afirma que toda la página sea más corta.

| Ancho   | Home V3  | Home V3.1 |
| ------- | -------- | --------- |
| 390 px  | 6.478 px | 7.215 px  |
| 768 px  | 5.883 px | 6.363 px  |
| 1440 px | 4.766 px | 4.957 px  |

## Rendimiento local

Chromium sin limitar CPU o red, contra el build local. Son mediciones de laboratorio, sin puntuación Lighthouse, INP o datos de campo.

| Ruta      | Ancho | LCP    | CLS | JS transferido |
| --------- | ----- | ------ | --- | -------------- |
| /         | 390   | 364 ms | 0   | 173.107 bytes  |
| /contacto | 390   | 232 ms | 0   | 174.612 bytes  |
| /         | 768   | 492 ms | 0   | 173.107 bytes  |
| /contacto | 768   | 524 ms | 0   | 174.612 bytes  |
| /         | 1440  | 352 ms | 0   | 174.612 bytes  |
| /contacto | 1440  | 504 ms | 0   | 174.612 bytes  |

Se mantiene el presupuesto de JS inferior a 350.000 bytes y CLS ≤ 0,1. No se solicitan fuentes externas en ejecución. Las vistas de software son HTML/CSS; el cierre reutiliza el recurso del hero ya existente. No se añade video, canvas, WebGL o biblioteca de animación.

Next avisa que ignora un lockfile externo al repositorio en el perfil local de Windows. El build utiliza el del proyecto y termina correctamente. No se modificó la configuración del equipo para ocultar ese aviso.

## Errores detectados y corregidos

- Las pestañas de Soluciones podían envolver una tercera opción sobre el panel en móvil. Se definieron altura, distribución y escala adecuadas y se añadió una regresión de geometría y tamaño de objetivo.
- El titular del cierre podía ocupar tres líneas a 390 px. Se acortó a “Lo que sigue / empieza aquí.”.
- Se conserva la navegación al pulsar cualquier zona de la tarjeta de servicio, incluida su interfaz demostrativa. La prueba nueva lo comprueba.
- Las primeras capturas de elementos largos incluían el header fijo superpuesto. Se sustituyeron por recortes de una captura completa con la geometría real, sin alterar estilos del producto.

## Evaluación estética real

Se mantiene la dirección de página `dense-tiles`, semilla 1057675573, y se usa como referencia de interfaces `Framed sheet`, semilla 1297791288, adaptada a la paleta aprobada. Véase [DESIGN.md](DESIGN.md).

- **size-count — WARN.** La escala incluye títulos fluidos, cuerpo, controles y etiquetas de las interfaces. Hay más tamaños que los cinco preferidos por la rúbrica; se mantienen para distinguir la página de sus vistas de software.
- **no-footage — WARN.** No hay video. Se reutilizan las imágenes aprobadas y se evita transferencia y movimiento continuo adicional.
- **still-page — FAIL.** La inspección detecta poco movimiento automático. Se conserva deliberadamente la animación aprobada del hero y el feedback de controles, con movimiento reducido. No se añaden entradas masivas o videos para elevar el contador.
- **icon-cards — FAIL.** El detector agrupa el bento de tres piezas al apilarse en tablet/móvil. Se mantiene el bento solicitado: contiene interfaces diferentes, descripciones reales de servicio y un panel de entrega, sin iconos decorativos sobre cada título. La divergencia se conserva como FAIL.

No se usan `--allow`, modo app para la página ni comentarios de supresión. `data-ui` identifica exclusivamente las ventanas demostrativas de software, tal como exige el flujo de TasteSkill para fragmentos de interfaz. No exime el bento de sus reglas de composición.

La inspección de fuente incluye la V2 conservada, variantes y overlays de shadcn, y los scrims del hero y CTA. Sus resultados se conservan íntegros en [taste-source.json](taste-source.json). La identidad y el hero aprobados prevalecen sobre una regla automática que pretenda sustituirlos.

### Crítica de la última ronda

ROUND 3

Seen in one second: se conserva el portal azul; debajo, las capacidades se vuelven interfaces concretas.

Idea (one sentence): pasar de una idea a un producto claro, con el mismo criterio visual desde la portada hasta la conversación final.

Live thing: explorar servicios y soluciones por teclado y puntero, abrir pasos y preguntas, y llegar a los canales reales de contacto.

Layout words by section: hero=escena / servicios=bento con interfaz / portafolio=editorial / soluciones=explorador / metodología=lista compacta / FAQ=lista compacta / cierre=escena.

Scores: design 6.5 · usability 8.5 · creativity 7 · content 7.5 → overall 7.3; resultado estricto limitado a **6.0** por los FAIL. Autoevaluación, no auditoría estética independiente.

Caps applied: FAIL vigentes; no hay fotografías nuevas o casos de cliente; la metáfora espacial también podría funcionar en otros estudios tecnológicos.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. [Servicios móvil](after/2-servicios-390.png): el bento apila tres piezas y sigue siendo largo. La información es ahora específica, pero merece evaluación del propietario sobre la densidad antes de ampliar el sistema.
2. [Portafolio](after/3-portafolio-1440.png): el ejemplo ilustra el pensamiento de producto y aún no demuestra trabajo de cliente. Sustituirlo por casos autorizados cuando existan.
3. [Metodología y FAQ](inspection/desktop-page-02.jpg): ambos son listas. Se redujo su peso; validar si conviene mantener los dos bloques separados en una futura revisión de contenido.

Se revisaron los archivos finales del inspector y las capturas por sección en los tres anchos. No se implementan escenas fijadas de scroll, por lo que `scenes.mjs` no aplica.

## Archivos de producto y pruebas

- `src/app/page.tsx`: conserva el hero y delega las secciones inferiores.
- `src/components/proposal/refined-sections.tsx`: composición de servicios, portafolio, soluciones, metodología, FAQ y CTA.
- `src/components/proposal/product-previews.tsx`: ejemplos de producto escritos en HTML/CSS.
- `src/components/proposal/interactions.tsx`: bento, explorador, enlaces de tarjetas y acordeones compactos.
- `src/styles/refinement.css`, importado desde `src/styles/app.css`: estilos limitados al refinamiento y sus interfaces.
- `tests/e2e/home-refinement.spec.ts`: cobertura nueva en tres anchos; los dos archivos anteriores no se modifican.
- `docs/qa-v3-1/`, README e índice del informe: decisiones, datos, capturas y resultados.

## Pendientes y preparación para revisión

**Listo para revisión visual de V3.1.** Falta la valoración del propietario sobre las secciones inferiores, el contenido de casos reales y la longitud móvil. Dispositivos reales, Safari/Firefox, lectores de pantalla y rendimiento desde el alojamiento quedan pendientes. Axe y Chromium emulado no equivalen a una certificación completa.

La rama V3 original, la V2 y main se conservan. PR #1 permanece sin fusionar; no se cambia su rama ni se crea un despliegue de producción. No se modifican facturación o workflows ni se solicitan reintentos de Actions. La migración interior continúa fuera del alcance de esta entrega.
