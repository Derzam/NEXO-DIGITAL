# Reseñas de clientes — V1 (Nexo Digital Studio)

## Alcance y principios

- Nueva sección en la **Home**, antes de las preguntas frecuentes. Se conserva el diseño azul oscuro/cian de Nexo y la navegación existente.
- Formulario con nombre, empresa/proyecto opcional, puntuación 1–5, comentario de 20–700 caracteres y autorización **opcional** de publicación.
- El botón **Prepara**, no envía automáticamente, un mensaje mediante `https://wa.me/`; el cliente debe pulsar enviar **dentro de WhatsApp**. Sin JavaScript se ofrece un enlace general a WhatsApp.
- **No existe backend, base de datos, panel de moderación, correo de confirmación ni publicación automática** en esta versión. La web no guarda las reseñas.
- Las opiniones se revisan por la persona responsable y se publican manualmente solo después de obtener permiso verificable para mostrar el nombre, empresa, calificación y texto. La casilla sin marcar equivale a reseña privada, **nunca publicable**.
- `src/lib/published-reviews.ts` es el catálogo manual de las reseñas aprobadas. La lista comienza **vacía**, porque no se aportaron reseñas reales y autorizadas. No se simulan clientes ni puntuaciones.
- El título no dice «clientes satisfechos», no publica una puntuación media inventada y no usa datos estructurados de `Review`/`AggregateRating` antes de que existan reseñas auténticas y aplicables.

## Flujo

1. Cliente visita `https://nexodigitalstudio.net/#resenas`.
2. Completa nombre, empresa opcional, 1–5 estrellas, comentario y decide si autoriza la publicación.
3. Pulsa **Preparar reseña por WhatsApp**.
4. El cliente revisa el mensaje y **decide enviarlo en WhatsApp**. Si bloquea la ventana emergente, puede abrir el enlace alternativo desde el formulario.
5. La persona responsable revisa la reseña, verifica que provenga de un cliente real y conserva prueba de autorización cuando corresponda.
6. Solo después de la revisión, agrega el testimonio a `src/lib/published-reviews.ts` mediante PR con validación, sin publicar teléfonos ni información sensible.
7. Si el cliente solicita retirar su testimonio, se elimina del catálogo mediante PR y se documenta el cambio.

## Aceptación

- La sección aparece en la Home antes de «Antes de empezar», sin rediseñar el resto del sitio.
- La opción de estrellas puede manejarse con teclado y cada campo tiene etiqueta accesible.
- Un formulario incompleto no prepara un mensaje. La calificación es obligatoria.
- La autorización de publicación es opcional y se incluye explícitamente como Sí/No en WhatsApp.
- La UI informa que no almacena ni envía automáticamente datos.
- El estado vacío no muestra reseñas, estrellas medias, nombres ficticios ni afirmaciones engañosas.
- Pruebas Playwright: `tests/e2e/v10-reviews.spec.ts`, además de regresiones de Home/Contact/SEO y revisión axe.
- Revisar a 375, 390, 768 y 1440 px, con `prefers-reduced-motion`.

## Evolución posible — V2

Si el estudio comienza a recibir un volumen significativo de reseñas, evaluar una versión con almacenamiento propio y panel administrativo. Requerirá: políticas de privacidad y retención, consentimiento granular, validación de clientes, captcha/rate limiting, RLS, almacenamiento seguro, revisión/aprobación/rechazo, solicitud de eliminación y pruebas E2E. No implementar este backend ni exponer reseñas públicas sin una decisión específica.

**Entrega actual**: código en PR **Draft** para revisión. No implica autorización de merge ni publicación; GitHub Actions puede seguir bloqueado por facturación y no sustituye la validación local.
