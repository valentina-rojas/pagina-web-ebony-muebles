/* Panel de productos de Ebony Muebles (admin.html)
   Necesita config.js con SUPA_URL y SUPA_KEY. Ver GUIA-SUPABASE.txt */
/* =========================================================
   CONFIGURACIÓN · categorías y datos básicos
   LOCALES = cuántas fotos hay en cada carpeta imagenes/<categoría>/
   (solo se usa para el botón "Importar fotos actuales")
   ========================================================= */
const CATS=[['bibliotecas','Bibliotecas'],['armeros','Armeros'],['escritorios','Escritorios'],['vanitorys','Vanitorys'],['percheros','Percheros'],['cristaleros','Cristaleros'],['dormitorio','Dormitorio'],['cocina','Cocina'],['living','Living']];
const LOCALES={bibliotecas:20,armeros:1,escritorios:1,vanitorys:1,percheros:1,cristaleros:1,dormitorio:1,cocina:1,living:1};
const $=s=>document.querySelector(s),BASE=(typeof SUPA_URL==='string'?SUPA_URL:'').replace(/\/+$/,''),KEY=typeof SUPA_KEY==='string'?SUPA_KEY:'';
const nm=k=>(CATS.find(c=>c[0]===k)||[k,k])[1],J={'Content-Type':'application/json',Prefer:'return=minimal'};
let session=null,rows=[],editing=null;
try{session=JSON.parse(localStorage.getItem('ebony_admin'))}catch(e){}
/* =========================================================
   INTERFAZ · mensajes y armado de elementos
   ========================================================= */
function msg(t,err){const m=$('#msg');m.textContent=t||'';m.className=t?(err?'err':'ok'):''}
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs||{})){if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(k==='class')e.className=v;else if(v!==false&&v!=null)e.setAttribute(k,v===true?'':v)}kids.flat().filter(c=>c!=null&&c!==false).forEach(c=>e.append(c));return e}
/* =========================================================
   SESIÓN · ingreso con Supabase Auth (correo y contraseña)
   ========================================================= */
function show(){$('#login').hidden=!!session;$('#app').hidden=!session;$('#imp').hidden=$('#out').hidden=!session}
function saveSession(j){session={access:j.access_token,refresh:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000};localStorage.setItem('ebony_admin',JSON.stringify(session))}
function logout(){session=null;localStorage.removeItem('ebony_admin');rows=[];show()}
async function token(){
 if(!session)throw new Error('Iniciá sesión');
 if(Date.now()>session.exp-60000){
  const r=await fetch(BASE+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh})});
  const j=await r.json();if(!r.ok){logout();throw new Error('La sesión venció. Volvé a ingresar.')}saveSession(j)}
 return session.access}
/* =========================================================
   COMUNICACIÓN CON SUPABASE · base de datos (REST) y fotos (Storage)
   ========================================================= */
async function api(path,opt={}){
 const t=await token();
 const r=await fetch(BASE+path,{...opt,headers:{apikey:KEY,Authorization:'Bearer '+t,...(opt.headers||{})}});
 if(!r.ok){let m='';try{const j=await r.json();m=j.message||j.error||j.msg||''}catch(e){}
  throw new Error((m||'Error '+r.status)+(r.status===401||r.status===403?' (¿sesión vencida o sin permisos?)':''))}
 return (r.headers.get('content-type')||'').includes('json')?r.json():null}
async function run(fn,ok){document.body.classList.add('busy');try{await fn();await load();msg(ok||'Listo ✓')}catch(e){msg(e.message,1)}finally{document.body.classList.remove('busy')}}
async function load(){rows=await api('/rest/v1/productos?select=*&order=categoria.asc,orden.asc,id.asc');renderList()}
const pub=p=>BASE+'/storage/v1/object/public/productos/'+p;
const subir=(p,b)=>api('/storage/v1/object/productos/'+p,{method:'POST',headers:{'Content-Type':'image/jpeg','x-upsert':'true'},body:b});
const borrarImg=async p=>{try{await api('/storage/v1/object/productos/'+p,{method:'DELETE'})}catch(e){}};
const patch=(id,o)=>api('/rest/v1/productos?id=eq.'+id,{method:'PATCH',headers:J,body:JSON.stringify(o)});
const maxOrden=k=>Math.max(0,...rows.filter(r=>r.categoria===k).map(r=>r.orden||0));
/* =========================================================
   IMÁGENES · se reducen a 1400 px y se guardan como JPG liviano
   ========================================================= */
function comprimir(file,max=1400){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
  c.toBlob(b=>b?ok(b):no(new Error('No se pudo procesar la imagen')),'image/jpeg',.82)};
 im.onerror=()=>no(new Error('Formato de imagen no compatible. Usá JPG o PNG.'));im.src=u})}
/* =========================================================
   LISTADO · muestra los productos agrupados por categoría
   ========================================================= */
function item(r,i,n){return h('article',{class:'it'+(r.visible?'':' off'),'data-id':r.id},
 h('span',{class:'grip'+(n>1?'':' off'),title:'Arrastrar para cambiar el orden',onpointerdown:e=>iniciarArrastre(e,e.currentTarget.parentElement)},'⋮⋮'),
 h('img',{src:r.imagen_url,alt:r.nombre,loading:'lazy'}),
 h('div',{class:'txt'},h('b',{},r.nombre),h('span',{},r.descripcion||'Sin descripción'),h('div',{class:'tags'},r.destacado?h('i',{},'Destacado'):null,r.visible?null:h('i',{class:'off'},'Oculto'))),
 h('div',{class:'acts'},
  h('button',{title:'Subir',disabled:i===0,onclick:()=>run(()=>mover(r,-1))},'↑'),
  h('button',{title:'Bajar',disabled:i===n-1,onclick:()=>run(()=>mover(r,1))},'↓'),
  h('button',{onclick:()=>abrirForm(r)},'Editar'),
  h('button',{onclick:()=>run(()=>patch(r.id,{visible:!r.visible}))},r.visible?'Ocultar':'Mostrar'),
  h('button',{class:'del',onclick:()=>eliminar(r)},'Eliminar')))}
let filtro=localStorage.getItem('ebony_admin_filtro')||'';   // categoría elegida ('' = todas)
function setFiltro(k){filtro=k;localStorage.setItem('ebony_admin_filtro',k);renderList()}
function renderFiltros(){const box=$('#filtros');box.replaceChildren();
 const chip=(k,t,n)=>h('button',{type:'button',class:'chip'+(filtro===k?' on':''),'aria-pressed':filtro===k?'true':'false',onclick:()=>setFiltro(k)},t,h('small',{},String(n)));
 box.append(chip('','Todas',rows.length),...CATS.map(([k,t])=>chip(k,t,rows.filter(r=>r.categoria===k).length)))}
function renderList(){renderFiltros();const box=$('#list');box.replaceChildren();
 if(!rows.length){box.append(h('p',{class:'empty'},'Todavía no hay productos cargados. Agregá uno o usá “Importar fotos actuales”.'));return}
 let hay=false;
 CATS.filter(([k])=>!filtro||k===filtro).forEach(([k,t])=>{const l=rows.filter(r=>r.categoria===k);if(!l.length)return;hay=true;
  box.append(h('h2',{},t,h('small',{},'  '+l.length+(l.length>1?' fotos':' foto'))),h('div',{class:'items'},l.map((r,i)=>item(r,i,l.length))))});
 if(!hay)box.append(h('p',{class:'empty'},'Todavía no hay productos en esta categoría. Usá “+ Agregar producto” para cargar el primero.'))}

/* =========================================================
   ARRASTRAR PARA ORDENAR · se agarra el ícono ⋮⋮ de un producto y se suelta en su nuevo lugar
   (funciona con mouse y con el dedo en el celular; las flechas ↑ ↓ siguen disponibles)
   ========================================================= */
let arr=null;   // arrastre en curso: {el, cont, antes, y}

// Dado el alto (Y) del puntero y los demás productos, devuelve ANTES de cuál hay que insertar (null = al final)
function destinoArrastre(y,otros){for(const o of otros){const r=o.getBoundingClientRect();if(y<r.top+r.height/2)return o}return null}

function recolocar(){   // mueve el producto arrastrado a la posición que marca el puntero
 const otros=[...arr.cont.children].filter(x=>x!==arr.el),d=destinoArrastre(arr.y,otros);
 if(d!==arr.el.nextElementSibling)arr.cont.insertBefore(arr.el,d)}
function moverArrastre(e){if(arr){arr.y=e.clientY;recolocar()}}
function autoScroll(){   // si el puntero está cerca del borde de la pantalla, la lista se desplaza sola
 if(!arr)return;const m=90;
 if(arr.y<m){window.scrollBy(0,-Math.ceil((m-arr.y)/6));recolocar()}
 else if(arr.y>innerHeight-m){window.scrollBy(0,Math.ceil((arr.y-(innerHeight-m))/6));recolocar()}
 requestAnimationFrame(autoScroll)}
function iniciarArrastre(e,el){
 if(e.pointerType==='mouse'&&e.button!==0)return;
 e.preventDefault();
 const cont=el.parentElement;
 arr={el,cont,antes:[...cont.children].map(x=>x.dataset.id).join(','),y:e.clientY};
 el.classList.add('arrastrando');document.body.classList.add('arrastrando-ya');
 document.addEventListener('pointermove',moverArrastre);
 document.addEventListener('pointerup',soltarArrastre);
 document.addEventListener('pointercancel',soltarArrastre);
 requestAnimationFrame(autoScroll)}
function soltarArrastre(){
 if(!arr)return;
 const {el,cont,antes}=arr;arr=null;
 document.removeEventListener('pointermove',moverArrastre);
 document.removeEventListener('pointerup',soltarArrastre);
 document.removeEventListener('pointercancel',soltarArrastre);
 el.classList.remove('arrastrando');document.body.classList.remove('arrastrando-ya');
 const ids=[...cont.children].map(x=>x.dataset.id);
 if(ids.join(',')===antes)return;   // no se movió
 run(async()=>{try{   // guarda el nuevo orden (1, 2, 3...) solo en los productos que cambiaron de lugar
   for(let k=0;k<ids.length;k++){const r=rows.find(x=>String(x.id)===ids[k]);if(r&&r.orden!==k+1)await patch(r.id,{orden:k+1})}
  }catch(err){await load();throw err}},'Orden guardado ✓')}

/* =========================================================
   ACCIONES · ordenar, ocultar y eliminar
   ========================================================= */
async function mover(r,d){const l=rows.filter(x=>x.categoria===r.categoria).sort((a,b)=>a.orden-b.orden||a.id-b.id),i=l.indexOf(r),j=i+d;if(j<0||j>=l.length)return;
 [l[i],l[j]]=[l[j],l[i]];for(let k=0;k<l.length;k++)if(l[k].orden!==k+1)await patch(l[k].id,{orden:k+1})}
function eliminar(r){if(!confirm('¿Eliminar “'+r.nombre+'”? No se puede deshacer.'))return;
 run(async()=>{await api('/rest/v1/productos?id=eq.'+r.id,{method:'DELETE'});if(r.imagen_path)await borrarImg(r.imagen_path)},'Producto eliminado')}
/* =========================================================
   FORMULARIO · agregar y editar un producto
   ========================================================= */
function abrirForm(r){editing=r||null;const f=$('#pf');f.reset();
 f.categoria.value=r?r.categoria:(filtro||CATS[0][0]);f.nombre.value=r?r.nombre:'';f.descripcion.value=r?(r.descripcion||''):'';
 f.destacado.checked=!!(r&&r.destacado);f.visible.checked=r?r.visible:true;
 const p=$('#prev');if(r){p.src=r.imagen_url;p.style.display='block'}else{p.removeAttribute('src');p.style.display='none'}
 f.hidden=false;f.scrollIntoView({behavior:'smooth',block:'start'});f.nombre.focus()}
$('#new').onclick=()=>abrirForm(null);
$('#cancel').onclick=()=>{$('#pf').hidden=true;editing=null};
$('#pf').imagen.onchange=e=>{const f=e.target.files[0],p=$('#prev');if(f){p.src=URL.createObjectURL(f);p.style.display='block'}};
$('#pf').onsubmit=e=>{e.preventDefault();const f=e.target,file=f.imagen.files[0],cat=f.categoria.value,nombre=f.nombre.value.trim();
 if(!nombre)return msg('Escribí un nombre.',1);if(!editing&&!file)return msg('Elegí una imagen.',1);
 const ed=editing;
 run(async()=>{let img={};
  if(file){const b=await comprimir(file),p=cat+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,7)+'.jpg';await subir(p,b);img={imagen_path:p,imagen_url:pub(p)}}
  const d={categoria:cat,nombre,descripcion:f.descripcion.value.trim(),destacado:f.destacado.checked,visible:f.visible.checked,...img};
  if(ed){if(cat!==ed.categoria)d.orden=maxOrden(cat)+1;await patch(ed.id,d);if(file&&ed.imagen_path)await borrarImg(ed.imagen_path)}
  else{d.orden=maxOrden(cat)+1;await api('/rest/v1/productos',{method:'POST',headers:J,body:JSON.stringify(d)})}
  if(filtro&&cat!==filtro){filtro=cat;localStorage.setItem('ebony_admin_filtro',cat)}   // si cambió de categoría, el filtro lo sigue
  $('#pf').hidden=true;editing=null},'Guardado ✓')};
/* =========================================================
   IMPORTAR · sube a Supabase las fotos que ya están en la carpeta imagenes
   ========================================================= */
$('#imp').onclick=()=>{if(!confirm('Se van a subir las fotos de la carpeta “imagenes” al panel (las que todavía no estén). ¿Continuar?'))return;
 run(async()=>{let n=0;for(const[k,c]of Object.entries(LOCALES))for(let i=1;i<=c;i++){
  const nn=String(i).padStart(2,'0'),p=k+'/import-'+nn+'.jpg';if(rows.some(r=>r.imagen_path===p))continue;
  msg('Importando '+nm(k)+' '+nn+'…');const r=await fetch('imagenes/'+k+'/'+nn+'.jpg');if(!r.ok)continue;
  await subir(p,await r.blob());
  await api('/rest/v1/productos',{method:'POST',headers:J,body:JSON.stringify({categoria:k,nombre:nm(k)+' '+nn,descripcion:'',imagen_url:pub(p),imagen_path:p,orden:i,destacado:false,visible:true})});n++}
  msg(n+' fotos importadas.')},'Importación terminada ✓')};
/* =========================================================
   INICIO · botón salir, formulario de ingreso y arranque del panel
   ========================================================= */
$('#out').onclick=logout;
$('#lf').onsubmit=async e=>{e.preventDefault();const f=e.target;msg('');
 try{const r=await fetch(BASE+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email:f.email.value.trim(),password:f.pw.value})});
  const j=await r.json();if(!r.ok)throw new Error(j.error_description||j.msg||'Correo o contraseña incorrectos');
  saveSession(j);f.reset();show();await load()}catch(err){msg(err.message,1)}};
CATS.forEach(([k,t])=>$('#fcat').append(h('option',{value:k},t)));
if(!BASE||!KEY){msg('Falta completar config.js con los datos de Supabase (ver GUIA-SUPABASE.txt).',1)}
else{show();if(session)load().catch(e=>msg(e.message,1))}
