-- ============================================================
-- GO LABURO — Ayuda para pruebas manuales de usuarios
-- ============================================================
-- 1) Crea el usuario en Authentication > Users > Add User (dashboard),
--    o vía API/CLI. Copia el UUID que te asigna Supabase.
-- 2) (Opcional) Completa/corrige nombre y teléfono si el trigger
--    los dejó vacíos (porque no llenaste "User Metadata" al crear el user).
-- 3) (Opcional) Si además quieres que ese mismo usuario sea Técnico,
--    corre el INSERT de technical_profiles con su categoría.

-- ---- 2) Completar datos básicos del perfil (ya se crea vacío por el trigger) ----
update public.profiles
set full_name = 'Juan Pérez',
    phone     = '+591 700 00000'
where id = '00000000-0000-0000-0000-000000000000'; -- reemplaza por el UUID real

-- ---- 3) Activar Perfil Técnico para ese mismo usuario ----
insert into public.technical_profiles (
  profile_id, category_id, bio, coverage_zones, base_rate, years_experience
)
select
  '00000000-0000-0000-0000-000000000000',              -- reemplaza por el UUID real
  c.id,
  'Electricista con 5 años de experiencia en instalaciones y mantenimiento.',
  array['Cercado', 'Tiquipaya', 'Quillacollo'],
  80.00,
  5
from public.categories c
where c.name = 'Electricidad';

-- Nota: el propio usuario, ya autenticado desde la app, puede hacer esto mismo
-- sin necesidad del SQL editor (RF-02/RF-08), porque las policies
-- "profiles_update_own" y "technical_profiles_insert_own" ya lo permiten.
-- Este script es solo un atajo para poblar datos de prueba rápido.
