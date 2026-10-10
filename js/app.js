/* =========================================================
   ARRANQUE DEL SITIO
   ========================================================= */

// Muestra la página o galería que corresponda y reacciona a los cambios de enlace
window.addEventListener('hashchange', navegar);
navegar();

// Si Supabase está configurado, carga los productos y vuelve a dibujar lo que cambió
cargarSupabase().then(hayDatos => {
  if (!hayDatos) return;
  renderDestacados();
  if (location.hash.startsWith('#/')) navegar();
});
