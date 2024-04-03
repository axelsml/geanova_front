export  let usuario_id

if (typeof window !== 'undefined') {
  // Solo accedemos a localStorage si estamos en el navegador
  usuario_id = JSON.parse(window.localStorage.getItem('usuario'))?.id || null;
}
