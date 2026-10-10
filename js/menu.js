/* =========================================================
   MENÚ DESPLEGABLE "Productos"
   Se cierra al elegir una opción, al tocar afuera o con Esc.
   ========================================================= */
const menuProductos = byId('dd');
document.addEventListener('click', e => {
  if (!menuProductos.contains(e.target) || e.target.closest('li a')) menuProductos.open = false;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') menuProductos.open = false; });
