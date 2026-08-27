-- ============================================================
-- GO LABURO — Migración inicial de base de datos (Supabase/Postgres)
-- Cubre RF-01 a RF-27 y RNF-05, RNF-06, RNF-08
-- ============================================================

-- ------------------------------------------------------------
-- 0. EXTENSIONES
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------
create type request_status as enum ('pending', 'accepted', 'rejected', 'completed');

-- ------------------------------------------------------------
-- 2. CATEGORIES (RF-10, RF-11)
-- ------------------------------------------------------------
create table public.categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  icon          text,               -- nombre/slug del ícono usado en el frontend
  description   text,
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. PROFILES (extiende auth.users) — RF-01, RF-02, RF-03, RF-04
--    Un solo perfil puede ser Cliente y además activar Perfil Técnico.
-- ------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  phone         text not null,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4. TECHNICAL_PROFILES (RF-08, RF-09, RF-14)
-- ------------------------------------------------------------
create table public.technical_profiles (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null unique references public.profiles(id) on delete cascade,
  category_id       uuid not null references public.categories(id),
  bio               text,
  coverage_zones    text[] not null default '{}',   -- ej: {"Cercado","Tiquipaya"}
  base_rate         numeric(10,2) not null default 0,
  is_active         boolean not null default true,
  avg_rating        numeric(3,2) not null default 0,   -- RF-25, se actualiza por trigger
  ratings_count     integer not null default 0,
  years_experience  integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_technical_profiles_category on public.technical_profiles(category_id);
create index idx_technical_profiles_zones on public.technical_profiles using gin (coverage_zones);

-- ------------------------------------------------------------
-- 5. SERVICE_REQUESTS (RF-15 a RF-21, RF-27)
-- ------------------------------------------------------------
create table public.service_requests (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid not null references public.profiles(id) on delete cascade,
  technician_id         uuid not null references public.technical_profiles(id) on delete cascade,
  category_id           uuid not null references public.categories(id),
  description           text not null check (char_length(description) between 1 and 200),
  suggested_date         date not null,
  suggested_time_range  text,               -- ej: "14:00 - 16:00"
  zone                  text not null,
  address               text not null,
  status                request_status not null default 'pending',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_service_requests_client on public.service_requests(client_id);
create index idx_service_requests_technician on public.service_requests(technician_id);
create index idx_service_requests_status on public.service_requests(status);
create index idx_service_requests_client_status on public.service_requests(client_id, status);

-- ------------------------------------------------------------
-- 6. REVIEWS (RF-23, RF-24, RF-25, RF-26)
-- ------------------------------------------------------------
create table public.reviews (
  id                  uuid primary key default gen_random_uuid(),
  service_request_id  uuid not null unique references public.service_requests(id) on delete cascade,
  client_id           uuid not null references public.profiles(id) on delete cascade,
  technician_id       uuid not null references public.technical_profiles(id) on delete cascade,
  rating              smallint not null check (rating between 1 and 5),
  comment             text check (char_length(comment) <= 200),
  created_at          timestamptz not null default now()
);

create index idx_reviews_technician on public.reviews(technician_id);
create index idx_reviews_client on public.reviews(client_id);
-- Nota: reviews.service_request_id ya tiene índice implícito por el UNIQUE constraint,
-- no hace falta uno adicional.

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

-- 7.1 updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_technical_profiles_updated_at
  before update on public.technical_profiles
  for each row execute function public.set_updated_at();

create trigger trg_service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

-- 7.2 Crear profile automáticamente al registrarse (RF-01)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7.3 Solo se puede crear una solicitud si el técnico está activo,
--     y solo se puede completar/rechazar desde 'pending'/'accepted' (RF-20).
--     Además, congela todas las columnas salvo `status` (y updated_at, que
--     se gestiona en otro trigger): ni el técnico ni el cliente pueden usar
--     un UPDATE para reasignar la solicitud a otro técnico, cambiar el
--     cliente dueño, la categoría, la descripción, la dirección, etc.
create or replace function public.validate_status_transition()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'UPDATE' then
    if old.status = 'completed' or old.status = 'rejected' then
      raise exception 'No se puede modificar una solicitud finalizada (%).', old.status;
    end if;
    if new.status = 'completed' and old.status <> 'accepted' then
      raise exception 'Solo se puede completar una solicitud previamente aceptada.';
    end if;

    if new.client_id is distinct from old.client_id
       or new.technician_id is distinct from old.technician_id
       or new.category_id is distinct from old.category_id
       or new.description is distinct from old.description
       or new.suggested_date is distinct from old.suggested_date
       or new.suggested_time_range is distinct from old.suggested_time_range
       or new.zone is distinct from old.zone
       or new.address is distinct from old.address
       or new.created_at is distinct from old.created_at
    then
      raise exception 'No se pueden modificar los datos de la solicitud, solo su estado.';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_service_requests_status_guard
  before update on public.service_requests
  for each row execute function public.validate_status_transition();

-- 7.3b Validaciones cruzadas al crear una solicitud:
--      (a) un técnico no puede solicitarse un servicio a sí mismo
--      (b) el técnico destino debe estar activo (is_active = true)
--      Un CHECK de fila no puede consultar otra tabla, por eso va en trigger.
create or replace function public.validate_new_service_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_profile_id uuid;
  v_is_active         boolean;
begin
  select profile_id, is_active
    into v_owner_profile_id, v_is_active
  from public.technical_profiles
  where id = new.technician_id;

  if v_owner_profile_id is null then
    raise exception 'El técnico solicitado no existe.';
  end if;

  if v_owner_profile_id = new.client_id then
    raise exception 'Un técnico no puede solicitarse un servicio a sí mismo.';
  end if;

  if not v_is_active then
    raise exception 'No se puede solicitar un servicio a un técnico inactivo.';
  end if;

  return new;
end;
$$;

create trigger trg_service_requests_validate_insert
  before insert on public.service_requests
  for each row execute function public.validate_new_service_request();

-- 7.4 Recalcular promedio de calificaciones del técnico (RF-25)
-- SECURITY DEFINER es obligatorio: quien dispara esto es el cliente insertando
-- su review, y el cliente NO tiene permiso de UPDATE sobre technical_profiles
-- (solo el propio técnico lo tiene). Sin esto, cada review fallaría por RLS.
create or replace function public.update_technician_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_technician uuid;
begin
  target_technician := coalesce(new.technician_id, old.technician_id);

  update public.technical_profiles t
  set
    ratings_count = sub.cnt,
    avg_rating    = round(sub.avg_r, 2)
  from (
    select count(*) as cnt, coalesce(avg(rating), 0) as avg_r
    from public.reviews
    where technician_id = target_technician
  ) sub
  where t.id = target_technician;

  return null;
end;
$$;

create trigger trg_reviews_after_change
  after insert or update or delete on public.reviews
  for each row execute function public.update_technician_rating();

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.technical_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.service_requests enable row level security;
alter table public.reviews enable row level security;

-- ---------- CATEGORIES: lectura pública, escritura solo admin (service_role) ----------
create policy "categories_select_all"
  on public.categories for select
  using (true);

-- ---------- PROFILES ----------
-- Regla base: SOLO el dueño puede leer su fila por defecto (incluye teléfono, RF-13).
-- Excepción controlada: la policy "profiles_select_linked_via_request" (abajo)
-- abre la fila SOLO a la contraparte de una service_request activa/histórica.
-- IMPORTANTE: nunca agregar aquí una política SELECT con "using (true)":
-- las políticas de una misma acción se combinan con OR, así que cualquier
-- policy permisiva sin condición volvería a exponer el teléfono de todos.
-- Los datos públicos GENÉRICOS de un técnico (sin vínculo de solicitud) se
-- sirven EXCLUSIVAMENTE a través de la vista technicians_public (sección 9),
-- cuyo dueño (postgres) tiene BYPASSRLS y por lo tanto no depende de
-- esta política para funcionar.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Un usuario puede ver el perfil de la OTRA parte de una solicitud vigente:
--   - si yo soy el cliente de una solicitud, veo el perfil del dueño del técnico
--   - si yo soy el técnico (dueño de un technical_profile), veo el perfil del cliente
-- Esto es lo que necesita el Dashboard del Técnico (Ilustración N°11) para
-- mostrar nombre/teléfono/dirección del cliente en un JOIN embebido de PostgREST
-- (select('*, profiles(...)')), algo que una función RPC no puede resolver
-- porque el embed necesita acceso RLS real a la fila, no una llamada aparte.
create policy "profiles_select_linked_via_request"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.service_requests sr
      join public.technical_profiles tp on tp.id = sr.technician_id
      where
        (sr.client_id = auth.uid() and tp.profile_id = profiles.id)
        or
        (tp.profile_id = auth.uid() and sr.client_id = profiles.id)
    )
  );

-- ---------- TECHNICAL_PROFILES ----------
create policy "technical_profiles_select_all"
  on public.technical_profiles for select
  using (true);

create policy "technical_profiles_insert_own"
  on public.technical_profiles for insert
  with check (auth.uid() = profile_id);

create policy "technical_profiles_update_own"
  on public.technical_profiles for update
  using (auth.uid() = profile_id);

-- ---------- SERVICE_REQUESTS ----------
-- El cliente ve/crea sus propias solicitudes.
create policy "service_requests_select_as_client"
  on public.service_requests for select
  using (auth.uid() = client_id);

-- El técnico ve las solicitudes dirigidas a su perfil técnico.
create policy "service_requests_select_as_technician"
  on public.service_requests for select
  using (
    auth.uid() = (
      select profile_id from public.technical_profiles
      where id = technician_id
    )
  );

create policy "service_requests_insert_as_client"
  on public.service_requests for insert
  with check (auth.uid() = client_id);

-- El técnico solo puede actualizar el estado de solicitudes propias.
create policy "service_requests_update_as_technician"
  on public.service_requests for update
  using (
    auth.uid() = (
      select profile_id from public.technical_profiles
      where id = technician_id
    )
  );

-- El cliente puede:
--   (a) cancelar (-> rejected) su propia solicitud mientras esté 'pending' o 'accepted'
--       (fuerza mayor: el técnico ya aceptó pero el cliente necesita cancelar igual)
--   (b) marcar como completada (-> completed) su propia solicitud una vez 'accepted'
--       (Ilustración N°10: "Órdenes Concluidas" / "Calificar Servicio" ocurre del
--       lado del cliente, así que el cliente necesita poder cerrar el ciclo él mismo,
--       no solo el técnico).
-- El trigger trg_service_requests_status_guard sigue siendo la autoridad final:
-- bloquea 'completed' si old.status no era 'accepted', y bloquea cualquier cambio
-- si old.status ya era 'completed'/'rejected', sin importar qué policy lo permitió.
create policy "service_requests_client_status_update"
  on public.service_requests for update
  using (
    auth.uid() = client_id
    and status in ('pending', 'accepted')
  )
  with check (
    auth.uid() = client_id
    and status in ('rejected', 'completed')
  );

-- ---------- REVIEWS ----------
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

-- Solo el cliente dueño de una solicitud completada puede calificarla (RF-23, RF-26 vía unique constraint).
-- Se valida además que el technician_id insertado coincida EXACTAMENTE con el
-- técnico real de esa solicitud: sin esto, un cliente podía calificar su propia
-- solicitud completada pero apuntar la fila a otro technician_id arbitrario,
-- inflando o hundiendo el avg_rating de un técnico ajeno (RF-25).
create policy "reviews_insert_as_client"
  on public.reviews for insert
  with check (
    auth.uid() = client_id
    and exists (
      select 1 from public.service_requests sr
      where sr.id = service_request_id
        and sr.client_id = auth.uid()
        and sr.status = 'completed'
        and sr.technician_id = reviews.technician_id
    )
  );

-- ============================================================
-- 9. VISTA PÚBLICA DE TÉCNICOS (oculta teléfono hasta solicitar servicio, RF-13)
-- ============================================================
-- security_invoker = false (explícito, no depender del default implícito):
--   la vista consulta las tablas base con los permisos de su DUEÑO (postgres,
--   que tiene BYPASSRLS), no con los del usuario que hace la consulta.
--   Así, aunque profiles solo permita "auth.uid() = id", cualquier usuario
--   autenticado puede seguir viendo el listado de técnicos a través de esta
--   vista, porque nunca toca profiles directamente, sino a través de ella.
-- security_barrier = true: evita que el optimizador "empuje" predicados del
--   usuario hacia adentro de la vista de forma que puedan filtrar/inferir
--   columnas no expuestas (como el teléfono, que ni siquiera está seleccionado
--   aquí, pero es buena práctica de defensa en profundidad).
create or replace view public.technicians_public
with (security_barrier = true, security_invoker = false)
as
select
  tp.id,
  tp.profile_id,
  p.full_name,
  p.avatar_url,
  tp.category_id,
  c.name as category_name,
  tp.bio,
  tp.coverage_zones,
  tp.base_rate,
  tp.avg_rating,
  tp.ratings_count,
  tp.years_experience,
  tp.is_active
from public.technical_profiles tp
join public.profiles p on p.id = tp.profile_id
join public.categories c on c.id = tp.category_id
where tp.is_active = true;

-- El teléfono se expone en una consulta aparte, protegida:
-- solo si auth.uid() coincide con el técnico o con un cliente
-- que ya tenga una service_request hacia ese técnico.
create or replace function public.get_technician_phone(p_technician_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone text;
  v_profile_id uuid;
begin
  select profile_id into v_profile_id
  from public.technical_profiles
  where id = p_technician_id;

  if v_profile_id = auth.uid() then
    select phone into v_phone from public.profiles where id = v_profile_id;
    return v_phone;
  end if;

  if exists (
    select 1 from public.service_requests
    where technician_id = p_technician_id
      and client_id = auth.uid()
  ) then
    select phone into v_phone from public.profiles where id = v_profile_id;
    return v_phone;
  end if;

  return null; -- no autorizado a ver el teléfono todavía
end;
$$;

-- Simétrica a get_technician_phone: el TÉCNICO obtiene el teléfono del CLIENTE
-- para una solicitud puntual (Dashboard del Técnico, Ilustración N°11).
-- Nota: con la policy "profiles_select_linked_via_request" ya es posible leer
-- el teléfono directamente en un JOIN embebido de PostgREST; esta función se
-- deja igual como acceso explícito por request_id, útil cuando el frontend
-- solo quiere pedir el dato puntual sin traer todo el perfil embebido.
create or replace function public.get_client_phone(p_request_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone      text;
  v_client_id  uuid;
  v_tech_owner uuid;
begin
  select sr.client_id, tp.profile_id
    into v_client_id, v_tech_owner
  from public.service_requests sr
  join public.technical_profiles tp on tp.id = sr.technician_id
  where sr.id = p_request_id;

  if v_tech_owner is null or v_tech_owner <> auth.uid() then
    return null; -- no autorizado: no es el técnico dueño de esta solicitud
  end if;

  select phone into v_phone from public.profiles where id = v_client_id;
  return v_phone;
end;
$$;

-- ============================================================
-- 9b. VISTA PÚBLICA DE RESEÑAS (muestra nombre/avatar del autor, RF-24)
-- ============================================================
-- Mismo patrón que technicians_public: cualquier cliente nuevo que entra al
-- perfil de un técnico (Ilustración N°7) necesita leer full_name/avatar_url
-- de los autores de las reseñas, y NO tiene vínculo de service_request con
-- ellos (solo con el técnico). La policy "profiles_select_linked_via_request"
-- no cubre este caso, así que se resuelve con una vista definer-style más,
-- que expone únicamente nombre/avatar del cliente autor (nunca su teléfono).
create or replace view public.reviews_public
with (security_barrier = true, security_invoker = false)
as
select
  r.id,
  r.service_request_id,
  r.technician_id,
  r.rating,
  r.comment,
  r.created_at,
  p.full_name as client_name,
  p.avatar_url as client_avatar
from public.reviews r
join public.profiles p on p.id = r.client_id;

-- ============================================================
-- 10. SEED básico de categorías (opcional, ajustar a gusto)
-- ============================================================
insert into public.categories (name, icon) values
  ('Plomería', 'droplet'),
  ('Electricidad', 'zap'),
  ('Cerrajería', 'key'),
  ('Pintura', 'brush'),
  ('Reparación de electrodomésticos', 'tool')
on conflict (name) do nothing;

-- ============================================================
-- 11. GRANTS
-- ============================================================
-- IMPORTANTE: RLS filtra FILAS, pero no reemplaza el permiso de tabla/columna
-- a nivel de rol. Sin estos GRANT explícitos, PostgREST (la capa que usa el
-- cliente de Supabase) devuelve 403/404 aunque las policies sean correctas.
-- Supabase suele configurar defaults amplios para "anon"/"authenticated",
-- pero los dejamos explícitos aquí para que la migración sea autocontenida
-- y no dependa de configuración implícita del proyecto.

grant usage on schema public to anon, authenticated;

-- Catálogo público, lectura para cualquiera (logueado o no)
grant select on public.categories to anon, authenticated;

-- Vista pública de técnicos
grant select on public.technicians_public to anon, authenticated;

-- Vista pública de reseñas (autor con nombre/avatar, sin teléfono)
grant select on public.reviews_public to anon, authenticated;

-- Tablas base: solo usuarios autenticados operan sobre ellas (RLS acota filas)
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.technical_profiles to authenticated;
grant select, insert, update on public.service_requests to authenticated;
grant select, insert on public.reviews to authenticated;

-- Función RPC llamada directamente desde el cliente (supabase.rpc(...))
grant execute on function public.get_technician_phone(uuid) to authenticated;
grant execute on function public.get_client_phone(uuid) to authenticated;

-- Secuencias/objetos internos de las tablas ya quedan cubiertos porque las
-- PK son uuid con gen_random_uuid() (default), no hay serial/sequence que otorgar.

-- ============================================================
-- 12. REALTIME (RF-21: notificar cambios de estado de una solicitud)
-- ============================================================
-- Sin esto, los cambios en service_requests no emiten eventos por WebSocket
-- y el cliente/técnico no se enteran del cambio de estado sin recargar.
alter publication supabase_realtime add table public.service_requests;
