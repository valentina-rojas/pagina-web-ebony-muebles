/* =========================================================
   PRODUCTOS DESDE SUPABASE (opcional)
   Si config.js tiene la URL y la clave, se leen los productos cargados
   desde el panel admin.html y reemplazan a las fotos de la carpeta
   (solo en las categorías que tengan productos). Si algo falla,
   el sitio sigue funcionando con las fotos de la carpeta "imagenes".
   ========================================================= */
   
async function cargarSupabase() {
  if (typeof SUPA_URL !== 'string' || !SUPA_URL || !SUPA_KEY) return false;   // no configurado
  try {
    const url = SUPA_URL.replace(/\/+$/, '') + '/rest/v1/productos?select=*&visible=eq.true&order=orden.asc,id.asc';
    const r = await fetch(url, {headers: {apikey: SUPA_KEY}});
    if (!r.ok) return false;
    const filas = await r.json(), vistas = {}, destacados = [];

    filas.forEach(x => {
      const k = x.categoria;
      if (!C[k] || !x.imagen_url) return;
      if (!vistas[k]) {                                       // primera vez que aparece la categoría:
        vistas[k] = 1;                                        // se descartan las fotos locales
        P[k] = [];
        Object.keys(PRODUCTOS).forEach(q => { if (q.startsWith(k + '/')) delete PRODUCTOS[q]; });
      }
      const i = P[k].push(x.imagen_url) - 1;
      PRODUCTOS[k + '/' + num(i)] = {n: x.nombre, d: x.descripcion || ''};
      if (x.destacado) destacados.push({u: x.imagen_url, k, i});
    });

    if (destacados.length) FEAT = destacados;                 // el carrusel usa los marcados como destacados
    return filas.length > 0;
  } catch (e) {
    return false;
  }
}
