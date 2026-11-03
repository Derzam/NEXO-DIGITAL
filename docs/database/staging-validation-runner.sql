-- ==============================================================================
-- Nexo Digital Studio — Staging Validation Runner (Fase V3.6)
-- AVISO: Ejecutar en SQL Editor del entorno de Staging aislado.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PRUEBA 1: Aprobación atómica de reseña con consentimiento
-- Esperado: Éxito (status pasa a 'published', published_at poblado, log insertado)
-- ------------------------------------------------------------------------------
do $$
declare
  v_res jsonb;
  v_status text;
  v_logs_count int;
begin
  v_res := public.nexo_moderate_review(
    '00000000-0000-0000-0000-000000000001',
    'approve',
    '00000000-0000-0000-0000-0000000000a1',
    'admin-staging@nexodigitalstudio.net',
    'Nota de prueba: verificación en staging'
  );

  select moderation_status into v_status
  from public.nexo_customer_reviews
  where id = '00000000-0000-0000-0000-000000000001';

  select count(*) into v_logs_count
  from public.nexo_review_moderation_logs
  where target_review_uuid = '00000000-0000-0000-0000-000000000001' and action = 'approve';

  if v_status <> 'published' or v_logs_count = 0 then
    raise exception 'FALLO EN PRUEBA 1: La reseña no fue aprobada atómicamente.';
  else
    raise notice 'PRUEBA 1 SUPERADA: Reseña aprobada con bitácora atómica (% logs).', v_logs_count;
  end if;
end;
$$;

-- ------------------------------------------------------------------------------
-- PRUEBA 2: Bloqueo de aprobación SIN consentimiento de publicación
-- Esperado: Excepción 'No se puede publicar una reseña sin el consentimiento...'
--           y la reseña debe permanecer en 'pending'.
-- ------------------------------------------------------------------------------
do $$
declare
  v_error_caught boolean := false;
  v_status text;
begin
  begin
    perform public.nexo_moderate_review(
      '00000000-0000-0000-0000-000000000002',
      'approve',
      '00000000-0000-0000-0000-0000000000a1',
      'admin-staging@nexodigitalstudio.net'
    );
  exception
    when check_violation then
      v_error_caught := true;
  end;

  select moderation_status into v_status
  from public.nexo_customer_reviews
  where id = '00000000-0000-0000-0000-000000000002';

  if not v_error_caught or v_status <> 'pending' then
    raise exception 'FALLO EN PRUEBA 2: Se permitió aprobar una reseña sin consentimiento.';
  else
    raise notice 'PRUEBA 2 SUPERADA: Bloqueo de aprobación sin consentimiento verificado.';
  end if;
end;
$$;

-- ------------------------------------------------------------------------------
-- PRUEBA 3: Retirada de reseña previamente publicada
-- Esperado: Éxito (status pasa a 'rejected', published_at a null, log 'withdraw')
-- ------------------------------------------------------------------------------
do $$
declare
  v_res jsonb;
  v_status text;
  v_published_at timestamptz;
  v_logs_count int;
begin
  v_res := public.nexo_moderate_review(
    '00000000-0000-0000-0000-000000000003',
    'withdraw',
    '00000000-0000-0000-0000-0000000000a1',
    'admin-staging@nexodigitalstudio.net',
    'Nota de prueba: retirada exitosa'
  );

  select moderation_status, published_at into v_status, v_published_at
  from public.nexo_customer_reviews
  where id = '00000000-0000-0000-0000-000000000003';

  select count(*) into v_logs_count
  from public.nexo_review_moderation_logs
  where target_review_uuid = '00000000-0000-0000-0000-000000000003' and action = 'withdraw';

  if v_status <> 'rejected' or v_published_at is not null or v_logs_count = 0 then
    raise exception 'FALLO EN PRUEBA 3: La retirada de la reseña no fue correcta.';
  else
    raise notice 'PRUEBA 3 SUPERADA: Retirada atómica verificada con anulación de fecha.';
  end if;
end;
$$;

-- ------------------------------------------------------------------------------
-- PRUEBA 4: Bloqueo de transiciones ilegales (Aprobar reseña rechazada o re-aprobar)
-- Esperado: Excepción check_violation
-- ------------------------------------------------------------------------------
do $$
declare
  v_error_caught boolean := false;
begin
  begin
    perform public.nexo_moderate_review(
      '00000000-0000-0000-0000-000000000004',
      'approve',
      '00000000-0000-0000-0000-0000000000a1',
      'admin-staging@nexodigitalstudio.net'
    );
  exception
    when check_violation then
      v_error_caught := true;
  end;

  if not v_error_caught then
    raise exception 'FALLO EN PRUEBA 4: Se permitió reactivar una reseña rechazada.';
  else
    raise notice 'PRUEBA 4 SUPERADA: Transición ilegal rechazada -> publicada bloqueada.';
  end if;
end;
$$;

-- ------------------------------------------------------------------------------
-- PRUEBA 5: Inmutabilidad de la bitácora (Trigger de protección contra DELETE y UPDATE)
-- Esperado: Excepciones de integridad ante intentos de manipulación
-- ------------------------------------------------------------------------------
do $$
declare
  v_del_error boolean := false;
  v_upd_error boolean := false;
  v_log_id uuid;
begin
  select id into v_log_id from public.nexo_review_moderation_logs limit 1;

  if v_log_id is not null then
    -- Intento 1: Eliminar registro
    begin
      delete from public.nexo_review_moderation_logs where id = v_log_id;
    exception
      when integrity_constraint_violation then
        v_del_error := true;
    end;

    -- Intento 2: Modificar registro
    begin
      update public.nexo_review_moderation_logs set action = 'tampered' where id = v_log_id;
    exception
      when integrity_constraint_violation then
        v_upd_error := true;
    end;

    if not v_del_error or not v_upd_error then
      raise exception 'FALLO EN PRUEBA 5: El trigger de inmutabilidad no bloqueó la modificación o borrado.';
    else
      raise notice 'PRUEBA 5 SUPERADA: Inmutabilidad de auditoría protegida frente a DELETE y UPDATE.';
    end if;
  else
    raise notice 'PRUEBA 5 OMITIDA: No hay registros de auditoría previos.';
  end if;
end;
$$;

-- ==============================================================================
-- LIMPIEZA SEGURA DE DATOS SINTÉTICOS EN STAGING
-- Elimina EXCLUSIVAMENTE los registros sintéticos con prefijo '00000000-'.
-- ==============================================================================
-- delete from public.nexo_customer_reviews where id::text like '00000000-%';
-- delete from public.nexo_admin_users where user_id::text like '00000000-%';
