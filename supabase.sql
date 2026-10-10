-- =====================================================================
--  EBONY MUEBLES · Base de datos (Supabase)
--  1) Reemplazá CAMBIAR@CORREO.COM (en la función es_admin, más abajo)
--     por el correo del administrador, en minúsculas.
--  2) Pegá todo este archivo en Supabase → SQL Editor → Run.
-- =====================================================================

-- Tabla de productos
create table if not exists public.productos (
  id           bigint generated always as identity primary key,
  categoria    text not null check (categoria in
                 ('bibliotecas','espejos','escritorios','vanitorys','percheros',
                  'cristaleros','dormitorio','cocina','living')),
  nombre       text not null,
  descripcion  text,
  imagen_url   text not null,
  imagen_path  text,
  destacado    boolean not null default false,
  visible      boolean not null default true,
  orden        int not null default 0,
  creado       timestamptz not null default now()
);
create index if not exists productos_cat_orden on public.productos (categoria, orden);

-- ¿Quién es el administrador? (único correo que puede cargar/editar)
create or replace function public.es_admin() returns boolean
language sql stable as $$
  select coalesce(lower(auth.jwt() ->> 'email') = lower('CAMBIAR@CORREO.COM'), false)
$$;

-- Permisos y seguridad a nivel de fila
grant select on public.productos to anon;
grant select, insert, update, delete on public.productos to authenticated;
alter table public.productos enable row level security;

drop policy if exists "publico ve visibles" on public.productos;
drop policy if exists "admin ve todo"       on public.productos;
drop policy if exists "admin inserta"       on public.productos;
drop policy if exists "admin actualiza"     on public.productos;
drop policy if exists "admin borra"         on public.productos;

create policy "publico ve visibles" on public.productos for select using (visible = true);
create policy "admin ve todo"       on public.productos for select to authenticated using (public.es_admin());
create policy "admin inserta"       on public.productos for insert to authenticated with check (public.es_admin());
create policy "admin actualiza"     on public.productos for update to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "admin borra"         on public.productos for delete to authenticated using (public.es_admin());

-- Almacenamiento de fotos (carpeta pública "productos")
insert into storage.buckets (id, name, public) values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "fotos publicas"    on storage.objects;
drop policy if exists "admin sube fotos"  on storage.objects;
drop policy if exists "admin edita fotos" on storage.objects;
drop policy if exists "admin borra fotos" on storage.objects;

create policy "fotos publicas"    on storage.objects for select using (bucket_id = 'productos');
create policy "admin sube fotos"  on storage.objects for insert to authenticated with check (bucket_id = 'productos' and public.es_admin());
create policy "admin edita fotos" on storage.objects for update to authenticated using (bucket_id = 'productos' and public.es_admin());
create policy "admin borra fotos" on storage.objects for delete to authenticated using (bucket_id = 'productos' and public.es_admin());
