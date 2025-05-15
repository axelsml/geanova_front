export let rol_id;

if (typeof window !== "undefined") {
  // Solo accedemos a localStorage si estamos en el navegador
  rol_id = JSON.parse(window.localStorage.getItem("usuario"))?.rol_id || null;
}
