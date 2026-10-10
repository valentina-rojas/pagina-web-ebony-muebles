/* =========================================================
   PRODUCTOS DESTACADOS · carrusel deslizable
   La lista sale de DESTACADOS (datos.js) o, si se usa Supabase,
   de los productos marcados como "Destacado" en el panel.
   ========================================================= */

// Fotos del carrusel: [{u: url, k: categoría, i: índice}]
let FEAT = DESTACADOS.map(([k, i]) => ({u: (P[k] || [])[i], k, i})).filter(x => x.u);

// Dibuja las tarjetas del carrusel
function renderDestacados() {
  byId('ft').innerHTML = FEAT.map((x, n) => {
    const prod = PRODUCTOS[clave(x)] || {};
    const nombre = esc(prod.n || C[x.k][0]);
    return `<a class="fi" href="#/${x.k}" data-n="${n}">` +
             `<div class="im"><img loading="lazy" src="${esc(x.u)}" alt="${nombre}"></div>` +
             `<h3>${nombre}</h3><span>${esc(prod.p || 'Ver detalle')}</span></a>`;
  }).join('');
}
renderDestacados();

// Clic en una tarjeta: abre la ficha del producto (en lugar de ir a la categoría)
byId('ft').addEventListener('click', e => {
  const tarjeta = e.target.closest('.fi');
  if (!tarjeta) return;
  e.preventDefault();
  abrirVisor(FEAT, +tarjeta.dataset.n);
});

// Flechas de desplazamiento
const pista = byId('ft');
const desplazar = d => pista.scrollBy({left: d * pista.clientWidth * .8, behavior: 'smooth'});
byId('fp').onclick = () => desplazar(-1);
byId('fn').onclick = () => desplazar(1);
