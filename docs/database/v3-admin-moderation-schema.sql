-- ==============================================================================
-- Nexo Digital Studio — Migración Fase V3: Panel Administrativo de Reseñas
-- Proyecto Supabase Autorizado: nnujqzopkbzoddqhnavr (Nexo Digital Studio)
-- AVISO CRÍTICO: NO aplicar en LlevaKí ni en ningún otro proyecto.
-- ==============================================================================

-- 1. Tabla de administradores autorizados
create table if not exists public.nexo_admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'superadmin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS para nexo_admin_users
alter table public.nexo_admin_users enable row level security;
revoke all on table public.nexo_admin_users from public, anon, authenticated;
grant select, insert, update, delete on table public.nexo_admin_users to service_role;

-- 2. Tabla de bitácora de auditoría de moderación (Inmutable y con integridad referencial segura)
-- Integridad referencial:
-- - review_id usa ON DELETE SET NULL para evitar borrado en cascada del historial.
-- - target_review_uuid conserva el identificador UUID histórico de la reseña permanentemente.
-- - admin_id usa ON DELETE SET NULL para preservar el historial si la cuenta de auth se da de baja.
-- - admin_email conserva el correo del moderador como registro inmutable.
create table if not exists public.nexo_review_moderation_logs (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.nexo_customer_reviews(id) on delete set null,
  target_review_uuid text not null,
  action text not null check (action in ('approve', 'reject', 'withdraw')),
  previous_status text not null check (previous_status in ('pending', 'published', 'rejected')),
  new_status text not null check (new_status in ('pending', 'published', 'rejected')),
  admin_id uuid references auth.users(id) on delete set null,
  admin_email text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists nexo_moderation_logs_review_idx
  on public.nexo_review_moderation_logs (target_review_uuid, created_at desc);

create index if not exists nexo_moderation_logs_admin_idx
  on public.nexo_review_moderation_logs (admin_id, created_at desc);

-- RLS para nexo_review_moderation_logs
alter table public.nexo_review_moderation_logs enable row level security;
revoke all on table public.nexo_review_moderation_logs from public, anon, authenticated;
-- Privilegios mínimos: SOLO select e insert para service_role. Nunca UPDATE ni DELETE.
grant select, insert on table public.nexo_review_moderation_logs to service_role;

-- 3. Trigger de protección: Impide cualquier modificación o eliminación de registros de auditoría
create or replace function public.nexo_prevent_audit_log_tampering()
returns trigger
language plpgsql
security definer
as $$
begin
  raise exception 'Los registros de auditoría de moderación son inmutables y no pueden modificarse ni eliminarse.';
end;
$$;

drop trigger if exists trg_prevent_audit_log_tampering on public.nexo_review_moderation_logs;
create trigger trg_prevent_audit_log_tampering
before update or delete on public.nexo_review_moderation_logs
for each row execute function public.nexo_prevent_audit_log_tampering();

-- 4. Función transaccional atómica de moderación
-- Ejecuta la actualización del estado y el registro de auditoría en una sola transacción.
-- Si cualquiera de las dos operaciones falla, nada se confirma en la base de datos (rollback automático).
create or replace function public.nexo_moderate_review(
  p_review_id uuid,
  p_action text,
  p_admin_id uuid,
  p_admin_email text,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_current_status text;
  v_publication_consent boolean;
  v_new_status text;
  v_published_at timestamptz;
  v_log_id uuid;
  v_result jsonb;
begin
  -- A. Validar acción permitida
  if p_action not in ('approve', 'reject', 'withdraw') then
    raise exception 'Acción inválida: %. Las acciones permitidas son approve, reject o withdraw.', p_action
      using errcode = 'INVALID_PARAMETER_VALUE';
  end if;

  -- B. Validar presencia de datos de auditoría
  if p_admin_id is null or p_admin_email is null or btrim(p_admin_email) = '' then
    raise exception 'Se requiere identificación válida de administrador para registrar la auditoría.'
      using errcode = 'INVALID_PARAMETER_VALUE';
  end if;

  -- C. Bloquear la fila de la reseña para evitar condiciones de carrera concurrentes
  select moderation_status, publication_consent
  into v_current_status, v_publication_consent
  from public.nexo_customer_reviews
  where id = p_review_id
  for update;

  if not found then
    raise exception 'Reseña con ID % no encontrada.', p_review_id
      using errcode = 'NO_DATA_FOUND';
  end if;

  -- D. Validar transiciones de estado estrictas:
  -- 1) pending -> published (solo mediante approve y con publication_consent = true)
  if p_action = 'approve' then
    if v_current_status <> 'pending' then
      raise exception 'Transición inválida: solo se pueden aprobar reseñas en estado pending (estado actual: %).', v_current_status
        using errcode = 'CHECK_VIOLATION';
    end if;

    if v_publication_consent is not true then
      raise exception 'No se puede publicar una reseña sin el consentimiento explícito del cliente (publication_consent = true).'
        using errcode = 'CHECK_VIOLATION';
    end if;

    v_new_status := 'published';
    v_published_at := now();

  -- 2) pending -> rejected (solo mediante reject)
  elsif p_action = 'reject' then
    if v_current_status <> 'pending' then
      raise exception 'Transición inválida: solo se pueden rechazar reseñas en estado pending (estado actual: %).', v_current_status
        using errcode = 'CHECK_VIOLATION';
    end if;

    v_new_status := 'rejected';
    v_published_at := null;

  -- 3) published -> rejected (solo mediante withdraw)
  elsif p_action = 'withdraw' then
    if v_current_status <> 'published' then
      raise exception 'Transición inválida: solo se pueden retirar reseñas en estado published (estado actual: %).', v_current_status
        using errcode = 'CHECK_VIOLATION';
    end if;

    v_new_status := 'rejected';
    v_published_at := null;
  end if;

  -- E. Actualizar la reseña atómicamente
  update public.nexo_customer_reviews
  set
    moderation_status = v_new_status,
    published_at = v_published_at
  where id = p_review_id;

  -- F. Insertar la bitácora de auditoría en la misma transacción
  insert into public.nexo_review_moderation_logs (
    review_id,
    target_review_uuid,
    action,
    previous_status,
    new_status,
    admin_id,
    admin_email,
    notes,
    created_at
  ) values (
    p_review_id,
    p_review_id::text,
    p_action,
    v_current_status,
    v_new_status,
    p_admin_id,
    p_admin_email,
    p_notes,
    now()
  ) returning id into v_log_id;

  -- G. Construir y retornar resultado
  v_result := jsonb_build_object(
    'success', true,
    'review_id', p_review_id,
    'action', p_action,
    'previous_status', v_current_status,
    'new_status', v_new_status,
    'published_at', v_published_at,
    'audit_log_id', v_log_id
  );

  return v_result;
end;
$$;

-- Privilegios mínimos: Nunca otorgar ejecución a anon o authenticated
revoke execute on function public.nexo_moderate_review(uuid, text, uuid, text, text) from public, anon, authenticated;
grant execute on function public.nexo_moderate_review(uuid, text, uuid, text, text) to service_role;

-- ==============================================================================
-- INSTRUCCIONES: Habilitar al primer administrador de forma segura
-- ==============================================================================
-- PASO 1: En Supabase Studio (Proyecto nnujqzopkbzoddqhnavr) -> Authentication -> Users.
--         Hacer clic en "Add User" -> "Create user" e introducir el correo y contraseña
--         segura del administrador. (Con confirmación automática activada).
--
-- PASO 2: En SQL Editor de Supabase, ejecutar la siguiente consulta sustituyendo el correo:
--
-- insert into public.nexo_admin_users (user_id, email, role, is_active)
-- select id, email, 'superadmin', true
-- from auth.users
-- where email = 'propietario@nexodigitalstudio.net'
-- on conflict (user_id) do update set is_active = true, role = 'superadmin';
--
-- ==============================================================================
-- PRIVACIDAD Y DERECHOS ARCO (LOPDP ECUADOR / GDPR)
-- ==============================================================================
-- Si un cliente solicita la supresión de sus datos personales:
-- 1. Los datos identificativos en public.nexo_customer_reviews se anonimizan o retiran:
--    update public.nexo_customer_reviews
--    set display_name = '[Anonimizado por solicitud de titular]',
--        organization = null,
--        comment = '[Contenido eliminado por ejercicio de derechos de privacidad]',
--        moderation_status = 'rejected',
--        published_at = null
--    where id = '<UUID_DE_RESEÑA>';
-- 2. El registro en public.nexo_review_moderation_logs conserva target_review_uuid,
--    la fecha y el administrador responsable para cumplimiento legal y auditoría interna,
--    sin almacenar datos de carácter personal del cliente.
--
-- ==============================================================================
-- PROCEDIMIENTO DE REVERSIÓN (ROLLBACK)
-- ==============================================================================
-- drop function if exists public.nexo_moderate_review(uuid, text, uuid, text, text);
-- drop trigger if exists trg_prevent_audit_log_tampering on public.nexo_review_moderation_logs;
-- drop function if exists public.nexo_prevent_audit_log_tampering();
-- drop table if exists public.nexo_review_moderation_logs cascade;
-- drop table if exists public.nexo_admin_users cascade;
