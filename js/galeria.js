/* =========================================================
   GALERÍA DE UNA CATEGORÍA
   Dibuja la grilla de miniaturas de la categoría elegida.
   Al hacer clic en una miniatura se abre la ficha (visor.js).
   ========================================================= */
let categoriaActual = '';    // clave de la categoría que se está viendo
let ultimaCategoria = '';    // su título (se usa para preseleccionarla en el formulario de contacto)

function renderGaleria(k) {
  const [titulo, descripcion] = C[k], fotos = P[k] || [];
  categoriaActual = k;
  ultimaCategoria = titulo;
  byId('gt').textContent = titulo;
  byId('gd').textContent = descripcion;
  byId('gg').innerHTML = fotos.length
    ? fotos.map((u, i) => `<figure class="ph" data-i="${i}"><img loading="lazy" src="${esc(u)}" alt="${titulo} de Ebony Muebles, foto ${i + 1}"></figure>`).join('')
    : '<p class="vacio">Pronto vamos a subir fotos de esta categoría.</p>';
  revelarGaleria();
}

// Clic en una miniatura: abre el visor con todas las fotos de la categoría
byId('gg').addEventListener('click', e => {
  const foto = e.target.closest('.ph');
  if (foto) abrirVisor((P[categoriaActual] || []).map((u, i) => ({u, k: categoriaActual, i})), +foto.dataset.i);
});
