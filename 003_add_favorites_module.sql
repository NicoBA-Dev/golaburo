-- ============================================================
-- GO LABURO — Módulo nuevo (Examen Integrador PDF 7): FAVORITOS
-- El cliente guarda técnicos preferidos con una nota personal
-- opcional, para acceder rápido a ellos sin volver a buscar.
--
-- Ejecutar este archivo completo en Supabase → SQL Editor,
-- DESPUÉS de 001_init_schema.sql (usa profiles y technical_profiles).
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLA FAVORITES
-- ------------------------------------------------------------
create table public.favorites (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references public.profiles(id) on delete cascade,
  technician_id  uuid not null references public.technical_profiles(id) on delete cascade,
  note           text check (char_length(note) <= 140),
  created_at     timestamptz not null default now(),
  unique (client_id, technician_id) -- un mismo técnico no puede duplicarse en la lista
);

create index idx_favorites_client on public.favorites(client_id);
create index idx_favorites_technician on public.favorites(technician_id);

-- ------------------------------------------------------------
-- 2. VALIDACIÓN CRUZADA: un técnico no puede agregarse a sí mismo
--    como favorito. Mismo patrón que validate_new_service_request()
--    en 001_init_schema.sql (un CHECK de fila no puede consultar
--    otra tabla, por eso va en trigger).
-- ------------------------------------------------------------
create or replace function public.validate_new_favorite()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_profile_id uuid;
begin
  select profile_id into v_owner_profile_id
  from public.technical_profiles
  where id = new.technician_id;

  if v_owner_profile_id is null then
    raise exception 'El técnico no existe.';
  end if;

  if v_owner_profile_id = new.client_id then
    raise exception 'No puedes agregarte a ti mismo como favorito.';
  end if;

  return new;
end;
$$;

create trigger trg_favorites_validate_insert
  before insert on public.favorites
  for each row execute function public.validate_new_favorite();

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY — cada cliente solo ve/edita sus propios
--    favoritos (mismo criterio que profiles_select_own).
-- ------------------------------------------------------------
alter table public.favorites enable row level security;

create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = client_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = client_id);

create policy "favorites_update_own"
  on public.favorites for update
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = client_id);

-- ------------------------------------------------------------
-- 4. GRANTS — igual que el resto de tablas base (sección 11 de
--    001_init_schema.sql): RLS filtra filas, pero PostgREST
--    igual necesita el permiso de tabla a nivel de rol.
-- ------------------------------------------------------------
grant select, insert, update, delete on public.favorites to authenticated;
