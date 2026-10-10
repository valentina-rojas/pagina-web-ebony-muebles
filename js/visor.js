/* =========================================================
   VISOR / FICHA DE PRODUCTO
   Al hacer clic en una foto (galería o destacados) se abre una ventana con:
   la foto grande, nombre, descripción, precio (si hay) y el botón de WhatsApp.
   ========================================================= */
const visor = byId('lb'), visorImg = visor.querySelector('.lbimg img');
let visorItems = [];   // fotos que se pueden recorrer con las flechas
let visorPos = 0;      // posición de la foto abierta

// Abre el visor con una lista de fotos [{u: url, k: categoría, i: índice}] y la posición inicial
function abrirVisor(items, pos) { visorItems = items; mostrarEnVisor(pos); }

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

function cerrarVisor() { visor.classList.remove('on'); visorImg.removeAttribute('src'); }

// Botones y atajos de teclado
byId('lbx').onclick = cerrarVisor;
byId('lbmore').onclick = cerrarVisor;
byId('lbp').onclick = () => mostrarEnVisor(visorPos - 1);
byId('lbn').onclick = () => mostrarEnVisor(visorPos + 1);
visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });   // clic en el fondo oscuro
document.addEventListener('keydown', e => {
  if (!visor.classList.contains('on')) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') mostrarEnVisor(visorPos - 1);
  if (e.key === 'ArrowRight') mostrarEnVisor(visorPos + 1);
});
