# Nexo Digital Studio — Panel Administrativo de Reseñas (Fase V3)

**Proyecto:** Nexo Digital Studio  
**Repositorio:** `Derzam/NEXO-DIGITAL`  
**Rama base:** `main`  
**Rama de trabajo:** `feat/v3-reviews-admin-panel`  
**Pull Request:** `#20` (Draft)  
**Ruta administrativa:** `/admin/resenas`  
**Ruta de autenticación:** `/admin/login`  
**Supabase Project ID:** `nnujqzopkbzoddqhnavr` (exclusivo de Nexo Digital Studio)  
**Tabla principal:** `public.nexo_customer_reviews`  

---

## 1. Decisiones Arquitectónicas y de Seguridad

### 1.1 Modelo de Autenticación y Sesiones
- **Proveedor:** Supabase Auth vinculado al proyecto exclusivo de Nexo (`nnujqzopkbzoddqhnavr`).
- **Mecanismo:** `@supabase/ssr` con cookies seguras HttpOnly (`SameSite=Lax`, `Secure` en producción).
- **Control de Acceso:**
  1. No existe autoregistro público. La creación de usuarios administradores se realiza exclusivamente mediante invitación o alta manual por el propietario en el panel de Supabase Auth.
  2. La autenticación se verifica en el servidor en cada petición con `auth.getUser()` (validación criptográfica del JWT contra Supabase, no solo lectura de cookies locales).
  3. Comprobación estricta de autorización: la identidad autenticada debe coincidir con un registro activo en la tabla privada `public.nexo_admin_users`. Si el usuario está autenticado pero no está autorizado, se responde con HTTP 403 y se deniega todo acceso.
  4. Redirección automática de usuarios anónimos hacia `/admin/login?next=/admin/resenas`.
  5. Exclusión total de motores de búsqueda: metadatos con `robots: { index: false, follow: false, nocache: true }`, encabezados `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store, no-cache, must-revalidate` garantizados antes y después de la actualización de cookies de sesión, y regla `Disallow: /admin/` en `robots.txt`.
  6. **Protección CSRF y Origen:** Todos los endpoints mutadores (`POST`, `PATCH`) validan la cabecera `Origin` contra los dominios autorizados de Nexo Digital Studio antes de procesar cualquier cambio de estado.

### 1.2 Transacciones Atómicas y Máquina de Estados Estricta
- **Función PostgreSQL Transaccional (`public.nexo_moderate_review`):**
  - La actualización de la reseña en `public.nexo_customer_reviews` y la inserción del evento en `public.nexo_review_moderation_logs` se ejecutan en **una sola transacción de base de datos** bajo nivel de aislamiento seguro.
  - Se bloquea la fila mediante `SELECT ... FOR UPDATE` para evitar condiciones de carrera concurrentes y dobles clics.
  - Si cualquiera de las dos operaciones falla, PostgreSQL aborta la transacción y revierte automáticamente cualquier modificación (Rollback garantizado).
  - La función está restringida exclusivamente al rol `service_role`; los roles `anon`, `authenticated` y `public` tienen revocado el permiso de ejecución (`REVOKE EXECUTE`).
- **Transiciones Estrictas Permitidas:**
  1. `pending → published`: Solo permitida mediante acción `approve` y exigiendo obligatoriamente `publication_consent = true`. Si el consentimiento es falso, la operación falla y aborta.
  2. `pending → rejected`: Permitida mediante acción `reject`.
  3. `published → rejected`: Permitida mediante acción `withdraw` (retirada).
  4. **Cualquier otra transición está estrictamente bloqueada:** No se permite aprobar una reseña ya publicada (evita aprobaciones duplicadas), no se permite retirar una reseña ya rechazada, y no se permite reactivar una reseña rechazada desde las rutas habituales.

### 1.3 Integridad de la Bitácora y Privacidad (LOPDP / GDPR)
- **Inmutabilidad Absoluta:**
  - La tabla `public.nexo_review_moderation_logs` es append-only: solo se otorga privilegio `INSERT` y `SELECT` a `service_role`.
  - Un trigger a nivel de base de datos (`trg_prevent_audit_log_tampering`) intercepta y aborta con excepción cualquier intento de `UPDATE` o `DELETE`.
- **Integridad Referencial Segura (Sin Cascada Destructiva):**
  - Anteriormente, una relación `ON DELETE CASCADE` borraba la bitácora si se eliminaba una reseña o un usuario.
  - Se modificó a `ON DELETE SET NULL`, incorporando adicionalmente `target_review_uuid text not null` y `admin_email text not null`. De esta forma, el rastro de auditoría permanece intacto e inmutable para siempre.
- **Cumplimiento de Privacidad:**
  - Si un cliente ejerce sus derechos de supresión de datos personales (LOPDP Ecuador / GDPR), los campos de contenido e identidad en `public.nexo_customer_reviews` (`display_name`, `comment`, `organization`) pueden anonimizarse o retirarse.
  - La bitácora en `public.nexo_review_moderation_logs` no almacena comentarios ni datos sensibles del cliente, únicamente metadatos de auditoría operacional (timestamp, acción, estado anterior, estado nuevo, identificador UUID y correo del moderador), cumpliendo los requisitos legales de trazabilidad y rendición de cuentas sin vulnerar la privacidad del titular.

### 1.4 Separación de Secretos y Seguridad
- La clave `NEXO_SUPABASE_SERVICE_ROLE_KEY` permanece **estrictamente en el servidor** (variables de entorno privadas en Vercel y runtime Node.js).
- Jamás se expone mediante prefijo `NEXT_PUBLIC_`, jamás se envía al cliente y jamás se sube al control de versiones.

### 1.5 Publicación Automática y Revalidación
- La sección pública en `/` (`#resenas`) consulta `loadPublishedReviews()`, que filtra por `moderation_status = 'published'` y `publication_consent = true`.
- Tras cualquier cambio de estado en el panel administrativo, el servidor ejecuta `revalidatePath("/")`, invalidando de forma instantánea la caché de la página principal para que los cambios se reflejen de inmediato sin intervención manual ni despliegues.

---

## 2. Diferenciación de Entornos de Pruebas

Para garantizar la reproducibilidad y la seguridad sin incurrir en costes ni exponer datos:
1. **Entorno Aislado / Mock / Fixtures (Predeterminado en Local y CI):**
   - Ejecuta las pruebas automatizadas de interfaz, máquina de estados, seguridad de endpoints, CSRF, accesibilidad y responsive utilizando mocks e interceptores de red en memoria.
   - No requiere credenciales reales de Supabase ni realiza mutaciones en bases de datos externas.
2. **Entorno de Staging con Supabase Real:**
   - Se activa cuando las variables `NEXO_SUPABASE_URL` y `NEXO_SUPABASE_SERVICE_ROLE_KEY` correspondientes al proyecto `nnujqzopkbzoddqhnavr` están configuradas en el entorno.
   - Permite verificar la ejecución física de la función RPC `nexo_moderate_review` y los triggers de PostgreSQL.

---

## 3. Esquema de Base de Datos y Migraciones

El archivo `docs/database/v3-admin-moderation-schema.sql` contiene la migración para aplicar en Supabase Studio (proyecto `nnujqzopkbzoddqhnavr`):
1. Creación de la tabla `public.nexo_admin_users` con RLS.
2. Creación de la tabla `public.nexo_review_moderation_logs` con trigger de inmutabilidad y columnas inmutables.
3. Creación de la función transaccional atómica `public.nexo_moderate_review`.
4. Procedimiento SQL para dar de alta al primer administrador de forma segura.
5. Procedimiento de reversión (rollback).
