# Nexo Digital Studio — Panel Administrativo de Reseñas (Fase V3)

**Proyecto:** Nexo Digital Studio  
**Repositorio:** `Derzam/NEXO-DIGITAL`  
**Rama base:** `main`  
**Rama de trabajo:** `feat/v3-reviews-admin-panel`  
**Ruta administrativa:** `/admin/resenas`  
**Ruta de autenticación:** `/admin/login`  
**Supabase Project ID:** `nnujqzopkbzoddqhnavr` (exclusivo de Nexo Digital Studio)  
**Tabla principal:** `public.nexo_customer_reviews`  

---

## 1. Decisiones Arquitectónicas

### 1.1 Modelo de Autenticación y Sesiones
- **Proveedor:** Supabase Auth vinculado al proyecto exclusivo de Nexo (`nnujqzopkbzoddqhnavr`).
- **Mecanismo:** `@supabase/ssr` con cookies seguras HttpOnly (`SameSite=Lax`, `Secure` en producción).
- **Control de Acceso:**
  1. No existe autoregistro público. La creación de usuarios administradores se realiza exclusivamente mediante invitación o alta manual por el propietario en el panel de Supabase Auth.
  2. La autenticación se verifica en el servidor en cada petición con `auth.getUser()` (validación criptográfica del JWT contra Supabase, no solo lectura de cookies locales).
  3. Comprobación estricta de autorización: la identidad autenticada debe coincidir con un registro activo en la tabla privada `public.nexo_admin_users`. Si el usuario está autenticado pero no está autorizado, se responde con HTTP 403 y se deniega todo acceso.
  4. Redirección automática de usuarios anónimos hacia `/admin/login?next=/admin/resenas`.
  5. Exclusión total de motores de búsqueda: metadatos con `robots: { index: false, follow: false, nocache: true }`, encabezados `X-Robots-Tag: noindex, nofollow` y `disallow: /admin/` en `robots.ts`.

### 1.2 Modelo de Autorización y Base de Datos
- **Tabla de Administradores (`public.nexo_admin_users`):**
  - Vincula `user_id` (UUID referenciando `auth.users.id`).
  - Almacena correo (`email`), rol (`admin` o `superadmin`), estado (`is_active: boolean`) y fecha de creación.
  - RLS activada: denegado para `anon` y `authenticated`; accesible únicamente mediante `service_role` en backend.
- **Tabla de Auditoría de Moderación (`public.nexo_review_moderation_logs`):**
  - Registra cada acción de moderación (`approve`, `reject`, `withdraw`).
  - Almacena `review_id`, `action`, `previous_status`, `new_status`, `admin_id`, `admin_email`, `notes` y `created_at`.
  - Permite trazabilidad completa e inmutable de quién moderó cada reseña.
- **Invariantes de Moderación en `public.nexo_customer_reviews`:**
  - **Aprobar:** `moderation_status` pasa a `'published'`, `published_at = now()`. Solo se permite si `publication_consent = true`. Si `publication_consent = false`, la acción es rechazada por el servidor con error 400.
  - **Rechazar:** `moderation_status` pasa a `'rejected'`, `published_at = null`.
  - **Retirar:** `moderation_status` pasa a `'rejected'`, `published_at = null` (cumpliendo la restricción check `published_requires_approval`).
  - Ninguna acción administrativa modifica el `display_name`, `rating`, `comment` u `organization` original del cliente.

### 1.3 Separación de Secretos y Seguridad
- La clave `NEXO_SUPABASE_SERVICE_ROLE_KEY` permanece **estrictamente en el servidor** (variables de entorno privadas en Vercel y runtime Node.js).
- Jamás se expone mediante prefijo `NEXT_PUBLIC_`, jamás se envía al cliente y jamás se sube al control de versiones.
- Todas las consultas de lectura privilegiada (reseñas pendientes/rechazadas) y mutaciones de estado se ejecutan en endpoints del servidor (Server Actions / Route Handlers) tras validar la sesión del administrador.

### 1.4 Publicación Automática y Revalidación
- La sección pública en `/` (`#resenas`) consulta `loadPublishedReviews()`, que filtra por `moderation_status = 'published'` y `publication_consent = true`.
- Tras cualquier cambio de estado en el panel administrativo, el servidor ejecuta `revalidatePath("/")`, invalidando de forma instantánea la caché de la página principal para que los cambios se reflejen de inmediato sin intervención manual ni despliegues.

---

## 2. Esquema de Base de Datos y Migraciones

El archivo `docs/database/v3-admin-moderation-schema.sql` contiene la migración para aplicar en Supabase Studio (proyecto `nnujqzopkbzoddqhnavr`):
1. Creación de la tabla `public.nexo_admin_users` con RLS.
2. Creación de la tabla `public.nexo_review_moderation_logs` con RLS e índices.
3. Procedimiento SQL para dar de alta al primer administrador de forma segura.

---

## 3. Plan de Implementación por Etapas

- **V3.1 — Arquitectura y autenticación:** Clientes Supabase SSR, validación de sesiones, tabla de administradores, middleware/guardias de ruta, pantalla de login `/admin/login`, cierre de sesión.
- **V3.2 — Backend de moderación:** API y Server Actions con validación estricta de permisos, transiciones de estado, bitácora de auditoría y protección contra dobles envíos.
- **V3.3 — Interfaz administrativa:** Dashboard `/admin/resenas`, métricas en tiempo real, búsqueda, filtros, ordenación, tarjetas con estrellas y badges, modales de confirmación, manejo de errores y estados vacíos.
- **V3.4 — Integración pública:** Validación de sincronización inmediata con `/` (`#resenas`) y `revalidatePath("/")`.
- **V3.5 — QA y documentación:** Pruebas automatizadas Playwright, auditoría de accesibilidad, linting, typecheck, build y reporte final.

