# Revisión de campaña V9

**Estado: borradores para revisión del propietario; sin aprobación de publicación.** No se han publicado anuncios, contratado campañas ni contactado personas. Nexo operará como persona natural; el RUC está pendiente. Antes de la actividad remunerada deben completarse las verificaciones legales y tributarias aplicables. No se afirma que el permiso de uso comercial de todos los materiales ya esté formalizado.

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
