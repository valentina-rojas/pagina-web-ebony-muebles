
/* ---- WhatsApp ---- */
const WA = '5493492611548';

/* ---- Categorías ----
   clave: [título, descripción corta]
   La clave es también el nombre de la carpeta de fotos (imagenes/<clave>/)
   y de la portada (imagenes/portadas/<clave>.jpg). */
const C = {
  bibliotecas: ['Bibliotecas', 'Estantes fijos o regulables, en la madera que elijas.'],
  armeros:     ['Armeros', 'Armeros de madera, fabricados a medida.'],
  escritorios: ['Escritorios', 'Para casa u oficina, con o sin cajones.'],
  vanitorys:   ['Vanitorys', 'Resistentes a la humedad, con la mesada que prefieras.'],
  percheros:   ['Percheros', 'Entradas ordenadas, con ganchos, espejo o banco.'],
  cristaleros: ['Cristaleros', 'Vitrinas con vidrio y estantes para vajilla.'],
  dormitorio:  ['Dormitorio', 'Camas, mesas de luz, cómodas y placares para descansar.'],
  cocina:      ['Cocina', 'Alacenas, bajo mesadas y muebles auxiliares.'],
  living:      ['Living', 'Mesas ratonas, mesas de arrime, bibliotecas y muebles para TV.']
};

/* ---- Fotos de cada categoría ----
   Las fotos van en imagenes/<categoría>/ con nombres 01.jpg, 02.jpg, 03.jpg...
   Acá se indica cuántas fotos hay en cada carpeta. */
const FOTOS = {
  bibliotecas: 20, armeros: 1, escritorios: 1, vanitorys: 1, percheros: 1,
  cristaleros: 1, dormitorio: 1, cocina: 1, living: 1
};

// Lista de rutas armada a partir del número de fotos (no hace falta tocarla)
const P = Object.fromEntries(
  Object.entries(FOTOS).map(([k, n]) => [k, Array.from({length: n}, (_, i) => `imagenes/${k}/${num(i)}.jpg`)])
);

/* ---- Productos destacados (carrusel) ----
   Cada par es ['categoría', N] donde N = número de la foto menos 1.
   Ej: ['bibliotecas', 2] es la foto 03 de imagenes/bibliotecas/. */
const DESTACADOS = [
  ['bibliotecas', 19], ['percheros', 0], ['cristaleros', 0], ['bibliotecas', 2],
  ['dormitorio', 0], ['escritorios', 0], ['bibliotecas', 15], ['living', 0],
  ['vanitorys', 0], ['bibliotecas', 18], ['armeros', 0], ['cocina', 0]
];

/* ---- Datos de cada producto (opcional) ----
   Clave: 'categoría/NN' (NN = número de foto). Campos: n = nombre, d = descripción, p = precio.
   Si una foto no figura acá, se muestra el nombre de la categoría.
   Ejemplo:
     'bibliotecas/03': {n: 'Biblioteca blanca con puertas', d: 'Dos cuerpos, estantes regulables.', p: '$ 450.000'},
   (Si usás Supabase, estos datos vienen del panel admin.html.) */
const PRODUCTOS = {
};
