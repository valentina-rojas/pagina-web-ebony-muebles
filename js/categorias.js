/* =========================================================
   CATEGORÍAS · arma, a partir de la lista C de datos.js:
   - la lista desplegable del menú
   - las tarjetas con foto de la sección "Nuestros productos"
   - las opciones del formulario de contacto
   Para agregar una categoría, solo hay que sumarla en datos.js.
   ========================================================= */
(function () {
  const items = Object.entries(C);

  byId('menu-categorias').innerHTML =
    '<li><a href="#productos">Ver todos</a></li>' +
    items.map(([k, v]) => `<li><a href="#/${k}">${v[0]}</a></li>`).join('');

  byId('grid-categorias').innerHTML = items.map(([k, v]) =>
    `<a class="cat" href="#/${k}"><img src="imagenes/portadas/${k}.jpg" alt="" loading="lazy"><h3>${v[0]}</h3><p>${v[1]}</p></a>`
  ).join('');

  byId('cs').innerHTML =
    '<option value="">Elegí una categoría</option>' +
    items.map(([, v]) => `<option value="${v[0]}">${v[0]}</option>`).join('') +
    '<option value="Otro">Otro mueble</option>';
})();
