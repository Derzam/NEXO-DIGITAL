# Nexo Digital Studio — Reseñas persistentes y moderadas (V2)

## Objetivo

Sustituir el flujo de reseñas que únicamente prepara mensajes por WhatsApp por un flujo **web → base de datos → aprobación → publicación automática en la página**.

Este cambio es **de aplicación**, NO implica que exista todavía un proyecto Supabase para Nexo, una tabla real con datos o una reseña aprobada. La activación está bloqueada por infraestructura y validación.

## Separación de proyectos

Se revisaron los proyectos Supabase disponibles el 02/11/2026: el único activo, `jvasbpqvvlrimbaxvgae`, contiene las tablas y datos de **LlevaKí**. **No** compartir esa base con Nexo ni modificarla. Crear un proyecto Supabase específico para Nexo en una organización y región que el propietario elija, revisando antes el coste/cupo de la suscripción. Los demás proyectos existentes tampoco están aprobados para Nexo.

## Datos y moderación

Esquema: `docs/database/nexo-reviews-schema.sql` (aplicable SOLO al proyecto nuevo de Nexo).

Tabla `public.nexo_customer_reviews`:
- `id` UUID, `display_name`, `organization` opcional, `rating` 1–5 y `comment` (20–700).
- `privacy_consent` obligatorio y `publication_consent` opcional, registrados con cada entrega.
- `moderation_status`: `pending` → `published` / `rejected`.
- `source`: `website` o `manual_whatsapp`; `created_at` y `published_at`.
- RLS activada. `anon` y `authenticated` únicamente pueden **leer** reseñas `published` con `publication_consent=true`, sin permisos de INSERT/UPDATE/DELETE. La API del servidor usa la clave **service_role solo en el servidor**, nunca en variables `NEXT_PUBLIC_`, navegador o repositorio.
- La aprobación desde Supabase Studio requiere una operación controlada con `published_at=now()`. La columna de comentarios no se modifica para mejorar una calificación; las reseñas negativas genuinas pueden publicarse también, salvo contenido ilícito, abusivo o datos sensibles.

## Flujo de usuario

1. Cliente llena el formulario de Home: nombre, empresa opcional, 1–5 estrellas, comentario, consentimiento de tratamiento obligatorio y consentimiento de publicación opcional.
2. Cloudflare Turnstile genera un token. El servidor Next.js valida captcha **con Siteverify**, origen, longitudes y campos.
3. API `POST /api/reviews` escribe la reseña como `pending`; devuelve 201 solo si se almacenó. Si la base/CAPTCHA/configuración falla, devuelve error y no afirma que se recibió. Los errores internos no revelan credenciales.
4. El propietario revisa manualmente las filas pendientes en Supabase Studio. No existe todavía una interfaz administrativa propia.
5. Si la reseña es genuina, está autorizada y no incluye contenido privado, se actualiza a `published` con `published_at`.
6. La Home hace lectura desde Supabase usando una clave pública restringida por RLS y muestra las 9 reseñas publicadas más recientes. Sin filas, muestra un estado vacío veraz. No hay reseñas inventadas.

## Configuración en Vercel

Entorno **Production** (y Preview solamente con un proyecto aislado de staging si se habilita):
- `NEXO_SUPABASE_URL` = URL del proyecto **de Nexo**.
- `NEXO_SUPABASE_PUBLISHABLE_KEY` = clave pública moderna `sb_publishable_...` del proyecto de Nexo, usada solo para lectura con RLS.
- `NEXO_SUPABASE_SERVICE_ROLE_KEY` = clave **service_role legacy JWT**, secreto de Vercel, **solo servidor**.
- `REVIEWS_SUBMISSION_ENABLED=false` hasta completar el gate.
- `NEXT_PUBLIC_REVIEWS_TURNSTILE_SITE_KEY` = clave pública de widget Cloudflare Turnstile para `nexodigitalstudio.net`.
- `REVIEWS_TURNSTILE_SECRET` = secreto del mismo widget, solo servidor.

La consulta pública usa solo `apikey: sb_publishable_...` y RLS. La ruta de escritura todavía utiliza `NEXO_SUPABASE_SERVICE_ROLE_KEY` con clave legacy JWT (server-only), pues requiere acceso privilegiado. Para migrarla a `sb_secret_...`, utilizar `apikey` sin un Bearer no-JWT y probar el endpoint antes de activar. No subir secretos a GitHub.

**Seguridad:** Turnstile frena automatizaciones triviales, pero no reemplaza el rate limit duradero, WAF ni políticas contra abuso. Para apertura pública significativa conviene añadir límite por IP/identidad en un almacenamiento duradero y alertas; no afirmar que el sistema ya está libre de spam. El sistema empieza **cerrado**.

## Aprobación manual en SQL editor de Nexo

Consultar filas pendientes:

```sql
select id, display_name, organization, rating, comment, publication_consent, source, created_at
from public.nexo_customer_reviews
where moderation_status = 'pending'
order by created_at desc;
```

Publicar **solo** con comprobación individual del consentimiento:

```sql
update public.nexo_customer_reviews
set moderation_status = 'published', published_at = now()
where id = '<UUID_DE_RESEÑA>' and publication_consent is true and moderation_status = 'pending';
```

Retirar a solicitud del titular:

```sql
update public.nexo_customer_reviews
set moderation_status = 'rejected', published_at = null
where id = '<UUID_DE_RESEÑA>';
```

No ejecutar estos ejemplos contra LlevaKí.

## Importación de la reseña de WhatsApp que ya existe

La imagen recibida el 02/11/2026 muestra un mensaje sobre **Centro Psicológico Dharma**, con **5/5** y autorización marcada «Sí». Este mensaje existe **fuera de la base de datos**. No existe integración automática con conversaciones de WhatsApp personales/empresariales en esta V2.

Antes de importarlo a Nexo: verificar que la reseña la escribió realmente el cliente, que el consentimiento mostrado es suyo y que sigue vigente; registrar evidencia fuera del repositorio (no subir capturas privadas a GitHub), conservar la opinión original sin cambiar su sentido y confirmar el nombre que el cliente autoriza a mostrar. Importarla desde SQL Editor de Nexo con `source='manual_whatsapp'` y estado `pending`; publicar mediante la revisión anterior. **No se ha importado ni publicado el mensaje de la imagen.**

## Aceptación y pruebas antes de activar

1. Crear proyecto dedicado, coste aprobado y esquema SQL revisado/aplicado.
2. Confirmar RLS con una consulta como `anon`: reseñas pendientes invisibles; INSERT/UPDATE/DELETE prohibidos. Probar servicio servidor aislado en staging.
3. Validar aviso de privacidad/retención/derechos y el responsable comercial del sitio en Ecuador antes de almacenar datos de clientes.
4. Configurar Turnstile con claves separadas y hostname correcto, verificar errores de CAPTCHA y límites.
5. Ejecutar `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, Playwright V10 y regresiones; prueba de publicación real desde un proyecto de pruebas.
6. Añadir secreto y variables en Vercel; cuando todo pase, cambiar **solo** `REVIEWS_SUBMISSION_ENABLED=true`, redeploy y verificar.
7. Verificar que una reseña sin autorización de publicación no aparezca; que una aprobada sí aparezca y que una retirada deje de aparecer.
8. Confirmar que se ha redactado/presentado un aviso de privacidad completo y un mecanismo de baja/rectificación.

## Estado de esta entrega

PR **Draft** solamente: incluye UI, API, SQL propuesto y documentación. No altera proyectos Supabase, no crea gastos, no configura Vercel, no modifica `main` ni publica información del cliente. El despliegue Preview solo demuestra que Next.js compila, no prueba almacenamiento ni permisos reales.
