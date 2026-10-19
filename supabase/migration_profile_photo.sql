-- Migración: foto de perfil (XSTCH-Logs)
-- Ejecutar en el SQL Editor de Supabase, después de migration_perfil_y_gym.sql.

-- Columna para la URL pública de la foto
alter table public.profile add column if not exists photo_url text;

-- Bucket público para las fotos de perfil
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policies del bucket (mismo criterio permisivo que el resto de las tablas vía anon key)
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "avatars_anon_write" on storage.objects;
create policy "avatars_anon_write" on storage.objects for insert with check (bucket_id = 'avatars');

drop policy if exists "avatars_anon_update" on storage.objects;
create policy "avatars_anon_update" on storage.objects for update using (bucket_id = 'avatars') with check (bucket_id = 'avatars');

drop policy if exists "avatars_anon_delete" on storage.objects;
create policy "avatars_anon_delete" on storage.objects for delete using (bucket_id = 'avatars');
