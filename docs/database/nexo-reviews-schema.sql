-- Apply ONLY in a new dedicated Supabase project for Nexo Digital Studio.
-- Never run against the existing LlevaKi project.
create extension if not exists pgcrypto;

create table if not exists public.nexo_customer_reviews (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 90),
  organization text check (organization is null or char_length(btrim(organization)) between 1 and 100),
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(btrim(comment)) between 20 and 700),
  privacy_consent boolean not null default false check (privacy_consent = true),
  publication_consent boolean not null default false,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending','published','rejected')),
  source text not null default 'website' check (source in ('website','manual_whatsapp')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  constraint published_requires_approval check (
    moderation_status <> 'published'
    or (publication_consent = true and published_at is not null)
  )
);
create index if not exists nexo_customer_reviews_public_idx
  on public.nexo_customer_reviews (published_at desc)
  where moderation_status = 'published' and publication_consent = true;

alter table public.nexo_customer_reviews enable row level security;
-- Existing Supabase projects sometimes grant broad privileges on public tables by default.
revoke all on table public.nexo_customer_reviews from public, anon, authenticated;
grant select on table public.nexo_customer_reviews to anon, authenticated;
grant select, insert, update, delete on table public.nexo_customer_reviews to service_role;

create policy "Anyone reads only approved consented testimonials"
on public.nexo_customer_reviews for select to anon, authenticated
using (moderation_status = 'published' and publication_consent = true);

-- No public INSERT/UPDATE/DELETE policies. The only submission path is the
-- Turnstile-verified /api/reviews server route using the server-only Supabase service role key.
-- Supabase Studio / SQL editor (postgres role) handles moderation.
-- To publish, review actual customer consent and run in SQL editor:
-- update public.nexo_customer_reviews
-- set moderation_status='published', published_at=now()
-- where id='<review-uuid>' and publication_consent is true and moderation_status='pending';
-- To withdraw: update ... set moderation_status='rejected', published_at=null where id='...';
