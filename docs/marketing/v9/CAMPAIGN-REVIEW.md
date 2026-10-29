# Revisión de campaña V9

**Estado de publicación: pendiente de verificar cuentas sociales, permisos de uso y situación tributaria.** El propietario solicitó publicar las piezas y decidió el **29/10/2026** que Nexo Digital Studio trabajará temporalmente bajo **LlevaKí S.A.S.** (sustituye el esquema anterior de persona natural). **Aún no hay publicación confirmada en plataformas sociales**. Antes de facturar y operar comercialmente, verificar RUC activo de la sociedad, actividades correspondientes, situación contable, representante y obligaciones legales. No se ha validado el RUC concreto ni formalizado la autorización de todos los materiales.

## Entregables y fuentes

| Pieza | PNG / WebP | Fuente editable SVG | Recursos originales |
| --- | --- | --- | --- |
| Landing | `landing-page-1080x1350.png` / `.webp` | `landing-page-1080x1350.svg` | `public/images/nexo-wordmark.webp`, `public/images/nexo-threshold.webp`; interfaz conceptual dibujada y rotulada como demostración. |
| Sistemas | `sistemas-web-orventi-1080x1350.png` / `.webp` | `sistemas-web-orventi-1080x1350.svg` | Wordmark oficial y `public/images/projects/orventi.webp`; captura auténtica del entorno Demo. |
| Aplicaciones | `aplicaciones-llevaki-1080x1350.png` / `.webp` | `aplicaciones-llevaki-1080x1350.svg` | Wordmark oficial y `public/images/projects/llevaki.webp`; la vista del teléfono es un recorte de la misma captura, sin crear una pantalla nueva. |

Las tres piezas son 1080 × 1350 px (4:5); `comparativa.png` reúne versiones reducidas de los tres anuncios. Los SVG conservan textos, figuras e imágenes como elementos separados, con imágenes incrustadas en PNG para compatibilidad de renderizado. Pueden editarse con un editor SVG; la reproducción tipográfica depende de Arial o una fuente sustitutiva instalada. Las capturas siguen siendo imágenes rasterizadas y sus textos interiores no son editables individualmente. El contenido SVG contiene versiones sin pérdida de los WebP del repositorio; no se ha alterado su contenido. Los mockups y la interfaz conceptual de la primera pieza son ilustraciones, no clientes o productos reales.

## Comprobaciones

- Dimensiones y formatos verificados mediante metadatos de imagen; PNG y WebP corresponden al mismo SVG de cada pieza.
- Inspección visual de composiciones y comparativa a escala reducida: jerarquía, acentos, textos visibles, márgenes y logotipo. Las capturas contienen detalles pequeños que no se leen íntegramente a escala móvil; las capacidades principales se presentan también como texto del anuncio. Revisión en dispositivos y plataformas reales pendiente.
- Los tres enlaces de servicios devolvieron HTTP 200 al consultar producción el 29 de octubre de 2026. Las URL también figuran completas en `COPY-REDES.md`, que es el lugar adecuado para el enlace utilizable; los botones de las imágenes son gráficos y no interactivos.
- No se atribuyen métricas, clientes externos, resultados ni funcionalidades de pago a los proyectos. Las leyendas identifican datos de demostración; el propietario confirmó que los nombres y valoraciones visibles de LlevaKí son datos de demostración.
- Referencias editoriales leídas directamente del PR #13 a `778fe75ae688f377f55a7f6f5a35ed1c34ffa158`: `docs/V9-PRELAUNCH-PLAYBOOK.md` y `docs/V9-CONTENT-KIT.md`. El PR no se fusionó ni sus archivos se copiaron a esta rama.
- Pendientes: aprobación visual y editorial, autorización formal de marcas/capturas para uso comercial, titularidad del contacto, condiciones de privacidad, RUC y obligaciones antes de operación remunerada. No activar difusión sin autorización expresa.

Cambios limitados a `docs/marketing/v9/`. Las pruebas de aplicación no se ejecutaron porque no se modificó código o configuración. La revisión técnica automatizada de texto dentro de capturas no sustituye la aprobación visual del propietario.

## Validación visual final — V9

Revisión de los PNG, WebP y SVG completos del HEAD inicial `3e640abb36bc0e2bd4f16040ecfb17ac490e7ec8`, y del comentario de revisión del PR #14. Los originales ya medían 1080 × 1350 y **no tenían el borde inferior cortado**; se descarta que el recorte observado en las imágenes compartidas demuestre un defecto del archivo original. Cada PNG y WebP final conserva 1080 × 1350 y relación 4:5; los SVG se analizaron como XML válido y conservan texto, formas e imágenes editables por separado.

| Pieza | Hallazgo y corrección | Revisión a 360, 390 y 430 px |
| --- | --- | --- |
| Landing | Titular, dispositivos y CTA completos. La leyenda conceptual y la URL se veían demasiado pequeñas; se amplió su tipografía, junto con los beneficios. | Titular y CTA legibles; subtítulo y beneficios pequeños pero legibles; leyenda y URL pequeñas, visibles sin recorte. |
| ORVENTI | Captura auténtica y leyenda presentes; se amplió la leyenda, la URL y los beneficios sin cambiar el panel. | Titular y CTA legibles; beneficios y leyenda legibles a escala reducida; URL pequeña y completa. Los detalles del panel no son legibles en móvil. |
| LlevaKí | Se amplió la leyenda, la URL y los beneficios. Se conserva el tamaño del teléfono: ampliarlo taparía más de la captura original, que ya incluye la interfaz móvil. | Titular y CTA legibles; beneficios y leyenda legibles; URL pequeña y completa. Los detalles dentro de la captura no son legibles en móvil. |

Las nueve imágenes de `qa/` terminadas en `-360`, `-390` y `-430` son reducciones proporcionales de los anuncios completos; las alturas se redondean al píxel más próximo. `*-completo.webp` ofrece la vista completa de cada archivo y `qa/comparativa.webp` reúne las tres piezas. En `*-antes-despues.webp`, la imagen anterior está a la izquierda y la corregida a la derecha; hay una comparación por cada pieza modificada. `*-png-webp.webp` compara visualmente PNG a la izquierda con WebP a la derecha.

La comprobación geométrica en Chromium no detectó textos fuera del lienzo: el borde inferior de la URL conserva al menos 175 px en landing y 109 px en las otras dos piezas, en el lienzo de 1350 px. Esto no garantiza la ausencia de recortes en todas las superficies de redes sociales. Las URL completas también están en `COPY-REDES.md`; los CTA dibujados no son enlaces interactivos.

Se comprobó que los PNG son idénticos al render del SVG correspondiente; los WebP tienen una diferencia media inferior a 1,1 niveles por canal frente a PNG, acorde con la compresión con pérdida. La revisión visual de cada par no mostró diferencias materiales. Las imágenes incrustadas de ORVENTI y LlevaKí y el recurso visual de Nexo se compararon píxel a píxel con sus archivos originales; el logotipo también se verificó. No se alteraron las capturas ni se añadieron datos reales, clientes, métricas o resultados. Los nombres y valoraciones visibles en LlevaKí son datos de demostración confirmados por el propietario.

**Archivos modificados:** los tres SVG y sus PNG/WebP, `comparativa.png` y este informe; `qa/` contiene evidencias nuevas. Las verificaciones se realizaron por simulación local, no en dispositivos físicos o aplicaciones de redes. La aprobación visual, autorización formal de materiales, RUC y revisión legal/tributaria siguen pendientes. No se ejecutaron lint, build ni E2E de la aplicación. No se han publicado anuncios ni modificado producción.
