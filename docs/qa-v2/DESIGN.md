# Nexo Digital Studio — sistema visual V2

## Idea y argumento

Nexo se interpreta como un punto de conexión entre diseño, software e inteligencia artificial. El núcleo N y sus órbitas hacen visible esa relación; el horizonte azul abre el recorrido sin simular un producto o un resultado comercial.

Inventario real: nombre Nexo Digital Studio; operación en Ecuador; atención online; catálogo de nueve servicios; integración n8n; cinco etapas de trabajo; contacto por WhatsApp configurado; cotización sin backend; portafolio pendiente de casos verificados; blog sin publicaciones inventadas. Estos elementos definen el contenido.

Secuencia: una idea se convierte en solución → servicios elegidos según el reto → conexión de negocio y experiencia → proceso de cinco etapas → contexto por sector → conversación para definir alcance. La metodología desplegable permite explorar el proceso sin añadir un sistema nuevo.

## Dirección y referencias

Se usaron las tres imágenes entregadas como referencias de iluminación, profundidad oscura y jerarquía. Ninguna imagen de referencia fue copiada al sitio, ni se reutilizó el contenido comercial de la tercera captura.

TasteSkill: **The dark room**, semilla **1640262902**. Se mantuvieron las familias Manrope y DM Sans ya disponibles mediante next/font. El reparto inicial produjo dense-tiles y contact-sheet: no encajaban con la restricción de evitar tarjetas repetidas y la ausencia de material fotográfico real. Se eligió dark-room por su campo oscuro continuo y el protagonismo de objetos iluminados. Los blueprints que requerían retratos, fotografías o drag horizontal se adaptaron a vectores propios y lectura vertical; no se inventaron recursos del estudio.

UI/UX Pro Max se aplicó al contraste oscuro, objetivos táctiles, tipografía legible, movimiento reducido y navegación. Sus recomendaciones automáticas de serif editorial y cambio de color de acento no se adoptaron porque la dirección aprobada mantiene sans y azul.

## Tokens y componentes

- Fondo `#070c17`, superficies `#0d1524` y `#121f33`.
- Texto principal `#f0f5ff`, cuerpo `#c3cfdf`, secundario `#a3b2c8`.
- Acento azul claro `#77cfff`; CTA claro con tinta oscura.
- Manrope para títulos, DM Sans para lectura, servidas localmente por Next.js.
- Marco centrado máximo de 1280 px; márgenes móviles de 20 px.
- Titulares cortos y sin rótulos previos; cuerpo de 16–18 px; mínimo de 13 px en información secundaria.
- Dos superficies de servicios destacadas y un directorio; catálogo interior con anchos alternos; metodología de filas desplegables, una superficie abierta.
- Sin dependencia de animación, bibliotecas visuales ni peticiones externas para leer el sitio.

## Decisiones frente a TasteSkill

El inspector se ejecuta sin `--allow`, sin editar reglas y sin ocultar contenido para cambiar el resultado.

1. **Horizonte y luz azul:** la solicitud aprueba expresamente brillos y composición orbital. Se reservan al recurso de marca del hero. El resto usa superficies planas y controles sin degradados ni sombras de reposo. Esta decisión prevalece sobre la prohibición estética general de glow/gradientes.
2. **Fotografías y video:** se eligieron dos ilustraciones vectoriales originales, no fotos genéricas de oficinas ni cuatro imágenes para completar un contador. No hay clientes, equipos o proyectos cuya apariencia se deba insinuar. El FAIL por mínimo de cuatro fotografías y la advertencia por falta de video se documentan como divergencias deliberadas de esta dirección.
3. **Escala tipográfica:** conserva variación según función y resolución; la advertencia sobre cantidad de tamaños queda visible en el resultado real.
4. **Margen del inspector:** se coteja con el contenedor real. El informe distingue la medición basada en texto y scrollbar de una diferencia de padding; no se modifica la regla para obtener PASS.

## Movimiento y límites

La firma es un giro orbital leve; el recorrido se revela con transformaciones de posición, manteniendo el texto opaco. Botones, enlaces y desplegables responden a hover, foco y teclado. `prefers-reduced-motion` elimina las animaciones y el scroll suave. No hay preloader, scroll secuestrado ni contenido que dependa de JavaScript para aparecer.

El símbolo N es un identificador vectorial de esta propuesta, pendiente de la validación del logotipo oficial. Las ilustraciones son conceptuales y no capturas de un sistema vendido o de un proyecto realizado.

En móvil y tablet, el acceso persistente a WhatsApp se integra en el header; el botón flotante se reserva al margen libre de escritorio. Así conserva el acceso sin superponerse a formularios o texto.
