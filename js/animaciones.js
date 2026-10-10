/* =========================================================
   ANIMACIONES AL HACER SCROLL
   Los elementos aparecen subiendo suavemente cuando entran en pantalla.
   (Los estilos del efecto están en css/estilos.css, sección 12.)
   ========================================================= */

// Observa cuándo un elemento entra en pantalla y le agrega la clase "in"
const observador = 'IntersectionObserver' in window
  ? new IntersectionObserver(entradas => entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); observador.unobserve(e.target); }
    }), {threshold: .12, rootMargin: '0px 0px -5% 0px'})
  : null;

// Marca una lista de elementos para que aparezcan con animación (escalonados de a tres)
function revelar(lista) {
  const porPadre = new Map();
  lista.forEach(el => {
    if (el.classList.contains('rv')) return;
    el.classList.add('rv');
    const padre = el.parentElement, orden = porPadre.get(padre) || 0;
    porPadre.set(padre, orden + 1);
    el.style.setProperty('--d', (orden % 3) * .12 + 's');
    observador ? observador.observe(el) : el.classList.add('in');
  });
}

// Se usa cada vez que se dibuja una galería nueva
function revelarGaleria() { revelar(document.querySelectorAll('#gg .ph')); }

// Elementos de la página principal que animan al aparecer
revelar(document.querySelectorAll(
  '.about .fotobox, .about .atext, .about .facts>div, .productos h2, .productos>p, .cat,' +
  ' .fhead, .ftrack, .contact>div, #cf'
));
