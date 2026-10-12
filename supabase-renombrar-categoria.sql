-- =====================================================================
--  RENOMBRAR UNA CATEGORÍA EN SUPABASE  (ejemplo: "espejos" -> "armeros")
--  Pegalo en Supabase > SQL Editor > Run. Hacelo ANTES de subir el sitio actualizado.
--  Para otra categoría, cambiá 'espejos' / 'armeros' en el UPDATE
--  y la lista de nombres del CHECK.
--
--  Qué hace y qué NO hace:
--  - NO borra ningún producto, ni cambia nombres, descripciones, fotos, orden ni otras categorías.
--  - SOLO cambia el valor de la columna "categoria" de 'espejos' a 'armeros'.
--  - Está dentro de BEGIN/COMMIT: si algo falla, no se aplica nada (queda todo como estaba).
-- =====================================================================
begin;

-- 1) Se quita la regla que limita los nombres de categoría permitidos
alter table public.productos drop constraint if exists productos_categoria_check;

-- 2) Los productos de la categoría vieja pasan a la nueva
update public.productos set categoria = 'armeros' where categoria = 'espejos';

-- 3) Se vuelve a crear la regla, con la lista nueva
alter table public.productos add constraint productos_categoria_check check (categoria in
  ('bibliotecas','armeros','escritorios','vanitorys','percheros',
   'cristaleros','dormitorio','cocina','living'));

commit;

-- Para comprobar el resultado, ejecutá esta consulta (cuenta productos por categoría):
-- select categoria, count(*) from public.productos group by categoria order by categoria;

-- Nota: las fotos ya subidas siguen funcionando aunque estén en una carpeta llamada "espejos"
-- del almacenamiento; las nuevas se guardan en "armeros". No hace falta moverlas.
