/* =========================================================
   CONTACTO · el formulario abre WhatsApp con el mensaje armado
   (el número está en WA, en datos.js)
   ========================================================= */
   
const formContacto = byId('cf'), selCategoria = byId('cs');

// Al llegar desde una galería ("Consultar por esta categoría"), deja elegida esa categoría
function preseleccionarCategoria() {
  if (ultimaCategoria) selCategoria.value = ultimaCategoria;
}

formContacto.addEventListener('submit', e => {
  e.preventDefault();
  const campos = ['cn', 'cc', 'cm'].map(byId);          // nombre, contacto, mensaje
  let completo = true;
  campos.forEach(c => {
    const vacio = !c.value.trim();
    c.classList.toggle('invalid', vacio);               // borde rojo si está vacío
    if (vacio) completo = false;
  });
  const aviso = byId('cr');
  if (!completo) { aviso.textContent = 'Completá tu nombre, un dato de contacto y el mensaje.'; return; }

  const cuerpo = `Nombre: ${campos[0].value}\nContacto: ${campos[1].value}\nCategoría: ${selCategoria.value || '-'}\n\n${campos[2].value}`;
  aviso.textContent = 'Se abrirá WhatsApp con tu consulta lista para enviar.';
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero hacer una consulta.\n\n' + cuerpo)}`, '_blank', 'noopener');
});
