/* =========================================================
   NAVEGACIÓN · alterna entre la página principal y la galería
   Las categorías usan enlaces tipo  #/bibliotecas  (sin recargar la página).
   ========================================================= */
const TITULO = 'Ebony Muebles — Muebles artesanales clásicos';
const paginaInicio = byId('home'), paginaGaleria = byId('galeria');

function navegar() {
  const m = location.hash.match(/^#\/(\w+)/);
  const k = m && C[m[1]] ? m[1] : null;              // categoría pedida, si existe

  if (k) {                                           // --- ver galería de una categoría ---
    renderGaleria(k);
    paginaInicio.hidden = true;
    paginaGaleria.hidden = false;
    window.scrollTo(0, 0);
    document.title = C[k][0] + ' — Ebony Muebles';
  } else {                                           // --- ver página principal ---
    const veniaDeGaleria = paginaInicio.hidden;
    if (location.hash === '#contacto' && veniaDeGaleria) preseleccionarCategoria();
    paginaInicio.hidden = false;
    paginaGaleria.hidden = true;
    document.title = TITULO;
    const destino = byId(location.hash.slice(1));    // baja hasta la sección (#productos, #contacto...)
    if (destino && veniaDeGaleria) destino.scrollIntoView();
  }
}
