/* =========================================================
   VISOR / FICHA DE PRODUCTO
   Al hacer clic en una foto (galería o destacados) se abre una ventana con:
   la foto grande, nombre, descripción, precio (si hay) y el botón de WhatsApp.
   ========================================================= */
const visor = byId('lb'), visorImg = visor.querySelector('.lbimg img');
let visorItems = [];   // fotos que se pueden recorrer con las flechas
let visorPos = 0;      // posición de la foto abierta

// Abre el visor con una lista de fotos [{u: url, k: categoría, i: índice}] y la posición inicial.
// Agrega una entrada al historial: así el botón "atrás" del celular/navegador cierra la ficha
// en lugar de cambiar la página que está detrás.
function abrirVisor(items, pos) {
  const yaAbierto = visor.classList.contains('on');
  visorItems = items;
  mostrarEnVisor(pos);
  if (!yaAbierto) { try { history.pushState({visor: true}, ''); } catch (e) {} }
}

// Muestra la foto número "pos" y completa sus datos
function mostrarEnVisor(pos) {
  if (!visorItems.length) return;
  visorPos = (pos + visorItems.length) % visorItems.length;           // da la vuelta al llegar al final
  const it = visorItems[visorPos];
  const prod = PRODUCTOS[clave(it)] || {};
  const cat = C[it.k][0];
  const nombre = prod.n || cat;
  const etiqueta = prod.n ? `${prod.n} (${cat})` : `${cat}, foto ${num(it.i)}`;

  visorImg.src = it.u;
  visorImg.alt = nombre;
  byId('lbcat').textContent = prod.n ? cat : '';
  byId('lbt').textContent = nombre;
  byId('lbd').textContent = prod.d || C[it.k][1];
  byId('lbpr').textContent = prod.p || '';

  // Botón de WhatsApp con el mensaje armado
  const mensaje = `Hola, me interesa este mueble: ${etiqueta}. ¿Podrían darme más información?`;
  byId('lbw').href = `https://wa.me/${WA}?text=${encodeURIComponent(mensaje)}`;
  byId('lbmore').href = '#/' + it.k;

  // Si hay una sola foto, se ocultan las flechas
  byId('lbp').style.display = byId('lbn').style.display = visorItems.length > 1 ? '' : 'none';
  visor.classList.add('on');
}

// Cierra la ficha. Si se cierra con la X / Esc / fondo, también se quita la entrada del historial
// (cuando se cierra con "atrás", el navegador ya la quitó: deHistorial = true).
function cerrarVisor(deHistorial) {
  if (!visor.classList.contains('on')) return;
  visor.classList.remove('on');
  visorImg.removeAttribute('src');
  if (deHistorial !== true && history.state && history.state.visor) history.back();
}
window.addEventListener('popstate', () => cerrarVisor(true));

// Botones y atajos de teclado
byId('lbx').onclick = () => cerrarVisor();
// "Ver más de esta categoría": cierra la ficha y va a la galería (reemplaza la entrada del historial)
byId('lbmore').onclick = e => {
  e.preventDefault();
  cerrarVisor(true);
  history.replaceState(null, '', e.currentTarget.getAttribute('href'));
  navegar();
};
byId('lbp').onclick = () => mostrarEnVisor(visorPos - 1);
byId('lbn').onclick = () => mostrarEnVisor(visorPos + 1);
visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });   // clic en el fondo oscuro
document.addEventListener('keydown', e => {
  if (!visor.classList.contains('on')) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') mostrarEnVisor(visorPos - 1);
  if (e.key === 'ArrowRight') mostrarEnVisor(visorPos + 1);
});
