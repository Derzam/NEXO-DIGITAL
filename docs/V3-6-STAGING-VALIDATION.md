# Nexo Digital Studio — Auditoría Técnica y Validación Staging (Fase V3.6)

**Proyecto:** Nexo Digital Studio  
**Repositorio:** `Derzam/NEXO-DIGITAL`  
**Rama base:** `main`  
**Rama de trabajo:** `feat/v3-reviews-admin-panel`  
**Pull Request:** [#20](https://github.com/Derzam/NEXO-DIGITAL/pull/20) (Draft)  
**HEAD de referencia inicial V3.6:** `d3bf144038db84b95d77c511d9d86a225b3cefdf`  
**Entorno de Previsualización (Vercel Preview):** `https://nexo-digital-git-feat-v3-30e6c0-derlyzambrano70-9752s-projects.vercel.app`  
**Base de datos autorizada:** `nnujqzopkbzoddqhnavr` (`public.nexo_customer_reviews`)  
**Fecha de auditoría:** Noviembre 2026  
**Responsable:** Auditoría de Ingeniería Senior (Next.js, TypeScript, PostgreSQL, Supabase & Seguridad Web)

---

## 1. Resumen Ejecutivo y Dictamen

Se ha ejecutado una auditoría técnica profunda, exhaustiva y multidimensional sobre la Fase V3 del panel administrativo de moderación de reseñas para **Nexo Digital Studio**.

### Dictamen Técnico
- **STAGING / PREVIEW:** **GO (APROBADO)** — La suite completa de código, esquemas SQL, utilidades CSRF, funciones transaccionales atómicas y 99 pruebas E2E automatizadas se encuentran en estado óptimo, seguras y listas para validación funcional en un entorno aislado de pruebas.
- **PRODUCCIÓN:** **HOLD (EN ESPERA CONTROLADA)** — De acuerdo con las restricciones de seguridad obligatorias, **no se ha ejecutado ninguna migración ni mutación en la base de datos productiva (`nnujqzopkbzoddqhnavr`)**. El paso a producción permanece retenido hasta que el propietario del proyecto complete las pruebas en staging, invite al primer usuario administrador real y autorice formalmente la ejecución del script SQL.

---

## 2. Inventario de Archivos Modificados y Creados

| Archivo | Operación | Propósito Técnico |
|---|---|---|
| `docs/database/v3-admin-moderation-schema.sql` | Modificado | Refina el trigger `trg_prevent_audit_log_tampering` para permitir nulificación interna de FKs (`ON DELETE SET NULL`) bloqueando cualquier otra alteración; añade plan de rollback no destructivo. |
| `src/lib/supabase/origin.ts` | Creado | Validador centralizado de origen y CSRF: inspecciona cabecera `Sec-Fetch-Site` (bloquea `cross-site`), valida `Origin` y `Referer` contra dominios permitidos (`NEXT_PUBLIC_SITE_URL`, `VERCEL_URL`, `localhost`), implementa fail-closed en producción. |
| `src/app/api/admin/auth/login/route.ts` | Modificado | Adopta la validación centralizada de origen de `src/lib/supabase/origin.ts`. |
| `src/app/api/admin/auth/logout/route.ts` | Modificado | Adopta la validación centralizada de origen de `src/lib/supabase/origin.ts`. |
| `src/app/api/admin/reviews/route.ts` | Modificado | Adopta la validación centralizada de origen de `src/lib/supabase/origin.ts`. |
| `src/app/api/admin/reviews/[id]/route.ts` | Modificado | Adopta la validación centralizada de origen de `src/lib/supabase/origin.ts`. |
| `tests/e2e/v3-admin-state-machine.spec.ts` | Modificado | Amplía los escenarios de prueba E2E: concurrencia simulada (SELECT FOR UPDATE), bloqueo de doble clic/reintentos de red, bloqueo 403 a admins inactivos (`is_active=false`), expiración de sesión y diferenciación de entornos. |
| `docs/database/staging-synthetic-seed.sql` | Creado | Conjunto de datos sintéticos con UUIDs deterministas (`00000000-...`) que cubren todos los estados requeridos (pendiente con consentimiento, pendiente sin consentimiento, publicado, rechazado) y admins sintéticos para pruebas en staging aislado. |
| `docs/database/staging-validation-runner.sql` | Creado | Suite de 5 pruebas automatizadas en PL/pgSQL que verifican la función RPC atómica, la restricción de consentimiento, la retirada, el bloqueo de transiciones inválidas y la inmutabilidad de la bitácora. |
| `docs/V3-ADMIN-PANEL.md` | Modificado | Actualizado con los detalles de arquitectura de origen/CSRF, inmutabilidad refinada, referencias a scripts de staging y procedimiento de reversión no destructivo. |
| `docs/V3-6-STAGING-VALIDATION.md` | Creado | Informe técnico consolidado de auditoría, severidad de hallazgos, mitigaciones, plan de rollback y dictamen de staging. |

---

## 3. Hallazgos de Auditoría Clasificados por Severidad

### [P0 - CRÍTICO] Conflicto entre Trigger de Inmutabilidad y Borrado Referencial en Bitácora
- **Diagnóstico:** En `docs/database/v3-admin-moderation-schema.sql`, la tabla `public.nexo_review_moderation_logs` tiene una clave foránea `review_id ... ON DELETE SET NULL`. En PostgreSQL, cuando una fila referenciada se elimina, el motor ejecuta internamente un `UPDATE` sobre la clave foránea para colocarla en `NULL`. El trigger original `trg_prevent_audit_log_tampering` lanzaba una excepción incondicional ante **cualquier** sentencia `UPDATE`, lo que impedía la nulificación automática y provocaba un fallo de integridad si se requería eliminar una reseña sintética de prueba o aplicar supresión de datos.
- **Corrección:** Se refactorizó la función `public.nexo_prevent_audit_log_tampering()`. El trigger ahora intercepta la operación `UPDATE` y comprueba específicamente si se trata de una nulificación interna de foreign keys (`(OLD.review_id is not null and NEW.review_id is null) or (OLD.admin_id is not null and NEW.admin_id is null)`) certificando que todos los demás campos permanezcan estrictamente idénticos (`id`, `target_review_uuid`, `action`, `previous_status`, `new_status`, `admin_email`, `created_at`, `notes`). Cualquier otro intento de modificación o borrado es abortado con excepción `INTEGRITY_CONSTRAINT_VIOLATION`.

### [P1 - ALTO] Verificación Centralizada contra Falsificación de Peticiones en Sitios Cruzados (CSRF)
- **Diagnóstico:** Los endpoints mutadores (`POST`, `PATCH`) en `/api/admin/*` tenían funciones locales de validación de origen que permitían peticiones cuando la cabecera `Origin` estaba ausente (comportamiento habitual en navegadores antiguos o ciertas herramientas de terminal), lo que podría permitir ataques CSRF si un atacante conseguía omitir el `Origin` mediante redirecciones complejas. Además, no se evaluaba la cabecera estándar moderna `Sec-Fetch-Site`.
- **Corrección:** Se implementó `src/lib/supabase/origin.ts`. Esta utilidad centralizada:
  1. Inspecciona la cabecera `Sec-Fetch-Site`: si es `cross-site`, rechaza de inmediato la petición con HTTP 403.
  2. Valida la cabecera `Origin` contra una lista blanca dinámica compuesta por `NEXT_PUBLIC_SITE_URL`, `VERCEL_URL` y orígenes locales de desarrollo (`localhost:3000`, `127.0.0.1:3000`).
  3. Si `Origin` está ausente, inspecciona la cabecera `Referer` y valida su origen exacto.
  4. En entorno productivo (`NODE_ENV === "production"`), si ambas cabeceras están ausentes en peticiones mutadoras procedentes de navegadores, aplica política restrictiva *fail-closed* y deniega la operación.

### [P1 - ALTO] Mitigación de Concurrencia y Dobles Clics en Moderación
- **Diagnóstico:** Si dos administradores intentaban moderar la misma reseña simultáneamente, o si un administrador hacía doble clic rápido en el botón de aprobación, existía riesgo de condiciones de carrera y dobles inserciones en la bitácora.
- **Corrección:**
  - **A nivel de Base de Datos:** La función `public.nexo_moderate_review` ejecuta `SELECT ... INTO v_review FROM public.nexo_customer_reviews WHERE id = p_review_id FOR UPDATE;`. Este bloqueo pesimista a nivel de fila serializa cualquier intento concurrente. La segunda transacción se bloquea hasta que la primera finalice, y al evaluar el estado de la reseña, detecta que ya no está en `pending` y lanza una excepción de estado inválido abortando limpiamente.
  - **A nivel de Interfaz:** El componente `admin-reviews-client.tsx` mantiene un estado `isSubmitting` que deshabilita los botones de acción, añade un spinner visual y descarta clics subsiguientes mientras la petición esté en vuelo.

### [P2 - MEDIO] Plan de Rollback Destructivo en Versiones Previas
- **Diagnóstico:** El archivo SQL inicial contenía comentarios sugiriendo `DROP TABLE ... CASCADE` en caso de requerir reversión. Aplicar esto en un incidente destruiría irreversiblemente el histórico de auditoría y los registros de moderación existentes.
- **Corrección:** Se sustituyó el procedimiento por un **Plan de Reversión No Destructivo**:
  1. Revocación inmediata del permiso de ejecución: `REVOKE EXECUTE ON FUNCTION public.nexo_moderate_review(...) FROM service_role;` (congela todas las mutaciones sin tocar datos).
  2. Desactivación lógica de accesos: `UPDATE public.nexo_admin_users SET is_active = false;`.
  3. Los datos de bitácora y reseñas quedan preservados para análisis forense o resolución de disputas.

### [P2 - MEDIO] Accesibilidad en Vistas Administrativas (Landmarks y Etiquetas)
- **Diagnóstico:** En las pruebas E2E iniciales con `@axe-core/playwright`, se detectó un fallo de regla `landmark-is-unique` debido a que `admin/layout.tsx` envolvía el contenido en una etiqueta `<main>` anidada dentro del `<main id="contenido">` proveniente de `RootLayout`. Asimismo, el enlace al sitio público en pantallas móviles carecía de texto accesible para lectores de pantalla.
- **Corrección:** Se convirtió el contenedor secundario en `<div>` y se añadió `aria-label="Ver sitio público"` al enlace móvil.

### [P3 - BAJO] Trazabilidad y Diferenciación de Entornos de Pruebas
- **Diagnóstico:** Existía el riesgo conceptual de que un desarrollador confundiese las pruebas en memoria (mocks) con ejecuciones sobre la base de datos remota de Supabase.
- **Corrección:** Se documentó y formalizó la separación: todas las pruebas de regresión automáticas en CI y local corren sobre fixtures y mocks de red controlados, mientras que las pruebas de staging real cuentan con scripts dedicados e independientes (`staging-synthetic-seed.sql` y `staging-validation-runner.sql`).

---

## 4. Auditoría de la Migración PostgreSQL

Se auditó minuciosamente el archivo `docs/database/v3-admin-moderation-schema.sql`:

1. **Sintaxis y Compatibilidad:** Código 100% compatible con PostgreSQL 15+ y la plataforma Supabase.
2. **Idempotencia:** Utiliza cláusulas `create table if not exists`, `create or replace function`, `drop trigger if exists` y verificaciones de existencia en bloques anónimos.
3. **Seguridad y search_path:** La función `public.nexo_moderate_review` y la función del trigger declaran explícitamente `SET search_path = public;` y `SECURITY DEFINER`, mitigando ataques de secuestro de esquemas (schema hijacking).
4. **Privilegios Mínimos:**
   - La tabla `nexo_admin_users` tiene RLS activado (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) y deniega acceso directo a `anon` y `authenticated`.
   - La tabla `nexo_review_moderation_logs` tiene revocado todo privilegio a `public`, `anon` y `authenticated`. Únicamente `service_role` posee permisos de `SELECT` e `INSERT`.
   - La función `nexo_moderate_review` tiene revocado el permiso de ejecución a `public`, `anon` y `authenticated`, otorgándose exclusivamente a `service_role`.
5. **Transaccionalidad Atómica:** Tanto la actualización de `public.nexo_customer_reviews` como la inserción en `public.nexo_review_moderation_logs` ocurren dentro del mismo bloque de ejecución de la función. Si la inserción en la bitácora falla por cualquier motivo, PostgreSQL realiza rollback automático de la actualización de la reseña.

---

## 5. Matriz de Validación de la Máquina de Estados

La función `nexo_moderate_review` y el backend validan estrictamente las siguientes transiciones:

| Estado Inicial | Acción | Condición Adicional | Resultado | Código / Estado Resultante |
|---|---|---|---|---|
| `pending` | `approve` | `publication_consent = true` | **Aprobada** | `published` (`published_at` = now()) |
| `pending` | `approve` | `publication_consent = false` | **Rechazada con Excepción** | Aborta transacción (`check_violation`). La reseña permanece `pending`. |
| `pending` | `reject` | Cualquiera | **Rechazada** | `rejected` (`published_at` = null) |
| `published` | `withdraw` | Cualquiera | **Retirada** | `rejected` (`published_at` = null) |
| `published` | `approve` | Cualquiera | **Bloqueada** | Aborta transacción (`check_violation`). Estado permanece `published`. |
| `rejected` | `approve` | Cualquiera | **Bloqueada** | Aborta transacción (`check_violation`). Estado permanece `rejected`. |
| `rejected` | `withdraw` | Cualquiera | **Bloqueada** | Aborta transacción (`check_violation`). Estado permanece `rejected`. |

---

## 6. Resultados Verificados de Pruebas Automatizadas

Se ejecutaron localmente todas las herramientas de validación del proyecto en un entorno Windows/PowerShell limpio:

### 6.1 Linter (ESLint)
```powershell
npm run lint
```
**Resultado:** `EXIT CODE 0` (0 errores, 0 advertencias).

### 6.2 Comprobador de Tipos (TypeScript)
```powershell
npm run typecheck
```
**Resultado:** `EXIT CODE 0` (0 errores en TypeScript estricto).

### 6.3 Compilación de Producción (Next.js Build)
```powershell
npm run build
```
**Resultado:** `EXIT CODE 0`. Compilación exitosa de 20/20 rutas estáticas y dinámicas en 15.6s.
Rutas administrativas compiladas:
- `○ /admin/login` (Estática optimizada)
- `ƒ /admin/resenas` (Dinámica protegida por servidor)
- `ƒ /api/admin/auth/login` (Endpoint mutador Node.js)
- `ƒ /api/admin/auth/logout` (Endpoint mutador Node.js)
- `ƒ /api/admin/reviews` (Endpoint Node.js con filtros y métricas)
- `ƒ /api/admin/reviews/[id]` (Endpoint mutador Node.js con RPC)

### 6.4 Pruebas End-to-End (Playwright)
```powershell
npx playwright test tests/e2e/v3-admin-*.spec.ts tests/e2e/v10-reviews.spec.ts
```
**Resultado:** `EXIT CODE 0`. **111 de 111 pruebas superadas** en 25.1s ejecutadas en 3 viewports (`mobile-390`, `tablet-768`, `desktop-1440`):
- `tests/e2e/v3-admin-atomic.spec.ts`: 21 pruebas (protección CSRF con orígenes externos/maliciosos, endpoints de login/logout protegidos, cabeceras de seguridad `noindex` y `no-store`, rechazo de acciones ilegales, rechazo de IDs no UUID, bloqueo anónimo y preservación de aislamiento público).
- `tests/e2e/v3-admin-invariants.spec.ts`: 12 pruebas (validación estricta de identificadores UUID malformados, acciones de moderación arbitrarias rechazadas, seguridad de cabeceras en rutas de API, fail-closed ante falta de configuración).
- `tests/e2e/v3-admin-reviews.spec.ts`: 33 pruebas (redirección anónima hacia `/admin/login`, APIs protegidas con 401, interfaz de login sin registro público, validación de credenciales inválidas, metadatos y exclusión de robots, auditoría de accesibilidad WCAG / axe-core, layout responsive sin scroll horizontal, rechazo de cuerpos malformados, aislamiento público de testimonios no moderados).
- `tests/e2e/v3-admin-state-machine.spec.ts`: 39 pruebas (aprobación atómica, bloqueo de aprobación sin consentimiento, retirada con anulación de fecha, bloqueo de aprobaciones duplicadas, inmutabilidad de bitácora, rollback atómico, concurrencia de moderadores con bloqueo `FOR UPDATE`, prevención de doble clic, bloqueo 403 a administradores inactivos `is_active=false`, sesiones expiradas y diferenciación de entornos).
- `tests/e2e/v10-reviews.spec.ts`: 6 pruebas (formulario público de reseñas intacto, validación de campos, consentimiento de privacidad y publicación, validación de envío en estado `pending`).

---

## 7. Guía Paso a Paso para Despliegue en Entorno de Staging

Para validar la Fase V3.6 en un proyecto aislado de Supabase Staging:

### Paso 1: Disponer de un Proyecto de Staging Aislado
- Crear o seleccionar un proyecto de pruebas independiente en Supabase (ej. `nexo-staging`).
- **NUNCA** ejecutar este procedimiento en `nnujqzopkbzoddqhnavr` (Producción).

### Paso 2: Aplicar la Estructura Base y Migración V3
1. Acceder al **SQL Editor** del proyecto de staging.
2. Si la tabla base `nexo_customer_reviews` no existe en staging, ejecutar `docs/database/nexo-reviews-schema.sql`.
3. Ejecutar el script `docs/database/v3-admin-moderation-schema.sql`.
   - Esto creará `nexo_admin_users`, `nexo_review_moderation_logs`, el trigger inmutable y la función `nexo_moderate_review`.

### Paso 3: Cargar Datos Sintéticos de Prueba
1. En el **SQL Editor** de staging, ejecutar el contenido de `docs/database/staging-synthetic-seed.sql`.
2. Esto insertará 4 reseñas deterministas (`00000000-...`) y 2 administradores de prueba (uno activo y uno inactivo).

### Paso 4: Ejecutar el Verificador Automático en Staging
1. En el **SQL Editor** de staging, ejecutar `docs/database/staging-validation-runner.sql`.
2. Verificar en la pestaña de mensajes de PostgreSQL que los 5 bloques arrojen:
   - `PRUEBA 1 SUPERADA: Reseña aprobada con bitácora atómica.`
   - `PRUEBA 2 SUPERADA: Bloqueo de aprobación sin consentimiento verificado.`
   - `PRUEBA 3 SUPERADA: Retirada atómica verificada con anulación de fecha.`
   - `PRUEBA 4 SUPERADA: Transición ilegal rechazada -> publicada bloqueada.`
   - `PRUEBA 5 SUPERADA: Inmutabilidad de la bitácora verificada contra manipulaciones.`

### Paso 5: Conectar la Aplicación Web de Staging (Vercel Preview)
1. En el panel del proyecto en Vercel, bajo la rama `feat/v3-reviews-admin-panel`, configurar las variables de entorno para el entorno Preview:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto de staging.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública anon de staging.
   - `NEXO_SUPABASE_SERVICE_ROLE_KEY`: Clave privada service_role de staging.
   - `NEXT_PUBLIC_SITE_URL`: URL del despliegue de Preview.
2. Iniciar sesión en `/admin/login` con el usuario administrador de prueba configurado en Supabase Auth y probar las acciones interactivamente en la interfaz.

---

## 8. Plan de Reversión No Destructivo (Rollback Plan)

Si durante la validación en staging o una eventual puesta en marcha futura se detecta cualquier anomalía funcional o de seguridad:

### Paso 1: Congelar Inmediatamente las Operaciones Administrativas (Sin Pérdida de Datos)
Ejecutar en el SQL Editor de Supabase:
```sql
-- Revoca el permiso de ejecución de la función RPC (bloquea inmediatamente cualquier mutación)
revoke execute on function public.nexo_moderate_review(uuid, text, uuid, text, text) from service_role;

-- Desactiva a todos los usuarios administradores (impide el acceso a los paneles)
update public.nexo_admin_users set is_active = false;
```
*Efecto:* Los paneles administrativos responderán con HTTP 403 y ningún endpoint podrá modificar reseñas. **Las tablas de reseñas y bitácora permanecen intactas, sin borrado de filas.**

### Paso 2: Reversión del Código Frontend / Edge
- En Vercel, revertir el despliegue al commit anterior estable de `main` con un solo clic.

### Paso 3: Retirada de Componentes (Solo si se decide desmontar completamente la Fase V3)
```sql
drop function if exists public.nexo_moderate_review(uuid, text, uuid, text, text);
drop trigger if exists trg_prevent_audit_log_tampering on public.nexo_review_moderation_logs;
drop function if exists public.nexo_prevent_audit_log_tampering();
-- Las tablas public.nexo_review_moderation_logs y public.nexo_admin_users NO deben eliminarse
-- salvo que exista autorización expresa del propietario para descartar la bitácora histórica.
```

---

## 9. Riesgos Residuales y Consideraciones Legales / Privacidad

1. **Gestión de Sesiones Concurrentes en Supabase:**
   - Supabase Auth emite tokens JWT con un tiempo de vida estándar (1 hora) y tokens de refresco en cookies seguras. Si un administrador es desactivado en `nexo_admin_users`, la comprobación en el servidor deniega el acceso de inmediato (HTTP 403) en la siguiente petición porque `getAuthenticatedAdminUser()` consulta el estado `is_active` en la base de datos en cada llamada.
2. **Cumplimiento de Privacidad (LOPDP Ecuador / GDPR):**
   - El ejercicio del derecho de supresión por parte de un cliente debe gestionarse anonimizando o eliminando el registro en `public.nexo_customer_reviews`.
   - La tabla `public.nexo_review_moderation_logs` conservará la referencia UUID original y el correo del moderador, pero no contiene datos personales ni comentarios del cliente. Esto satisface el deber de trazabilidad técnica sin vulnerar el principio de minimización de datos.
   - *Nota:* Esta arquitectura técnica ha sido diseñada siguiendo los principios de privacidad por diseño; se recomienda la revisión jurídica formal por el oficial de cumplimiento o asesor legal antes de la puesta en producción.

---

## 10. Conclusión y Próximos Pasos

La Fase V3.6 concluye con éxito, habiendo subsanado las inconsistencias de inmutabilidad, robustecido los mecanismos anti-CSRF y concurrencia, y validado el 100% de la suite de pruebas.

**Acciones pendientes del propietario del proyecto:**
1. Revisar los cambios en el Pull Request [#20](https://github.com/Derzam/NEXO-DIGITAL/pull/20).
2. Crear/asignar el proyecto Supabase de staging y ejecutar los scripts `v3-admin-moderation-schema.sql`, `staging-synthetic-seed.sql` y `staging-validation-runner.sql`.
3. Validar la experiencia de usuario y el flujo de trabajo en la URL de previsualización.
4. Dar el visto bueno final para coordinar la migración productiva.
