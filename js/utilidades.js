/* =========================================================
   UTILIDADES · funciones de ayuda usadas por los demás archivos
   ========================================================= */

// Atajo para buscar un elemento por su id
const byId = id => document.getElementById(id);

// Escapa texto para insertarlo de forma segura dentro de HTML
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Número de foto con dos cifras: 0 -> "01", 19 -> "20"
const num = i => String(i + 1).padStart(2, '0');

// Clave de un producto: 'bibliotecas/03' (categoría + número de foto)
const clave = x => x.k + '/' + num(x.i);
