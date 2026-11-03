-- ==============================================================================
-- Nexo Digital Studio — Staging Synthetic Seed Data (Fase V3.6)
-- AVISO CRÍTICO: Ejecutar ÚNICAMENTE en proyecto Staging aislado.
-- NUNCA ejecutar en Producción (nnujqzopkbzoddqhnavr) ni en proyectos ajenos.
-- ==============================================================================

-- 1. Insertar reseñas sintéticas de prueba con UUIDs deterministas
insert into public.nexo_customer_reviews (
  id,
  display_name,
  organization,
  rating,
  comment,
  privacy_consent,
  publication_consent,
  moderation_status,
  source,
  created_at
) values
-- Caso 1: Reseña pendiente con consentimiento (Lista para aprobar)
(
  '00000000-0000-0000-0000-000000000001',
  'Cliente Sintético Aprobación',
  'Empresa Staging Test',
  5,
  'Comentario sintético de prueba para validación de flujo de aprobación con consentimiento otorgado.',
  true,
  true,
  'pending',
  'website',
  now()
),
-- Caso 2: Reseña pendiente SIN consentimiento de publicación (Debe bloquearse su aprobación)
(
  '00000000-0000-0000-0000-000000000002',
  'Cliente Sintético Privado',
  'Sin Publicación Corp',
  4,
  'Comentario sintético privado que NO autoriza la publicación en la web (publication_consent = false).',
  true,
  false,
  'pending',
  'website',
  now()
),
-- Caso 3: Reseña publicada con consentimiento (Lista para probar retirada)
(
  '00000000-0000-0000-0000-000000000003',
  'Cliente Sintético Publicado',
  'Activo Staging SAC',
  5,
  'Comentario sintético publicado inicialmente para validar la acción de retirada de la página web.',
  true,
  true,
  'published',
  'website',
  now()
),
-- Caso 4: Reseña ya rechazada (Debe bloquear cualquier aprobación posterior)
(
  '00000000-0000-0000-0000-000000000004',
  'Cliente Sintético Rechazado',
  'Archivado Test',
  2,
  'Comentario sintético en estado rejected para validar que la máquina de estados impide transiciones ilegales.',
  true,
  true,
  'rejected',
  'website',
  now()
)
on conflict (id) do nothing;

-- 2. Administradores sintéticos de prueba
-- Admin activo para pruebas de autorización válida
insert into public.nexo_admin_users (
  id,
  user_id,
  email,
  role,
  is_active
) values
(
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-0000000000a1',
  'admin-staging@nexodigitalstudio.net',
  'admin',
  true
),
-- Admin inactivo para pruebas de rechazo (is_active = false -> 403 Forbidden)
(
  '00000000-0000-0000-0000-0000000000a2',
  '00000000-0000-0000-0000-0000000000a2',
  'inactivo-staging@nexodigitalstudio.net',
  'admin',
  false
)
on conflict (user_id) do nothing;
