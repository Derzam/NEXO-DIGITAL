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

-- 2. Tabla de bitácora de auditoría de moderación
create table if not exists public.nexo_review_moderation_logs (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.nexo_customer_reviews(id) on delete cascade,
  action text not null check (action in ('approve', 'reject', 'withdraw')),
  previous_status text not null check (previous_status in ('pending', 'published', 'rejected')),
  new_status text not null check (new_status in ('pending', 'published', 'rejected')),
  admin_id uuid not null references auth.users(id) on delete cascade,
  admin_email text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists nexo_moderation_logs_review_idx
  on public.nexo_review_moderation_logs (review_id, created_at desc);

create index if not exists nexo_moderation_logs_admin_idx
  on public.nexo_review_moderation_logs (admin_id, created_at desc);

-- RLS para nexo_review_moderation_logs
alter table public.nexo_review_moderation_logs enable row level security;
revoke all on table public.nexo_review_moderation_logs from public, anon, authenticated;
grant select, insert, update, delete on table public.nexo_review_moderation_logs to service_role;

-- ==============================================================================
-- INSTRUCCIONES: Habilitar al primer administrador de forma segura
-- ==============================================================================
-- PASO 1: En Supabase Studio (Proyecto nnujqzopkbzoddqhnavr) -> Authentication -> Users.
--         Hacer clic en "Add User" -> "Create user" e introducir el correo y contraseña
--         segura del administrador. (Sin confirmación por correo si es manual).
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
-- PROCEDIMIENTO DE REVERSIÓN (ROLLBACK)
-- ==============================================================================
-- drop table if exists public.nexo_review_moderation_logs cascade;
-- drop table if exists public.nexo_admin_users cascade;

