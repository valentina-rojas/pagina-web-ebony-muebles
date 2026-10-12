/* =========================================================
   MENÚ SUPERIOR
   - Desplegable "Productos": se cierra al elegir una opción, al tocar afuera o con Esc.
   - Celular: botón de 3 rayitas que abre y cierra todo el menú.
   ========================================================= */
const menuProductos = byId('dd'), botonMenu = byId('burger'), panelMenu = byId('menu-nav');

// Cierra el menú del celular
function cerrarMenuMovil() {
  panelMenu.classList.remove('abierto');
  botonMenu.setAttribute('aria-expanded', 'false');
}

// Botón de 3 rayitas
botonMenu.addEventListener('click', e => {
  e.stopPropagation();
  const abierto = panelMenu.classList.toggle('abierto');
  botonMenu.setAttribute('aria-expanded', String(!!abierto));
});

document.addEventListener('click', e => {
  if (!menuProductos.contains(e.target) || e.target.closest('li a')) menuProductos.open = false;
  if (!panelMenu.contains(e.target) || e.target.closest('a')) cerrarMenuMovil();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  menuProductos.open = false;
  cerrarMenuMovil();
});
