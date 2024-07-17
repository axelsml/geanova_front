import { getCookieValue } from "./Cookies";

export const getCookiePermisos = async (pantalla, callback) => {
  try {
    // Obtener el valor de la cookie
    const cookieValue = await getCookieValue("permisos");
    const permisosParse = JSON.parse(cookieValue);
    // Buscar el permiso específico
    const item = permisosParse.find((item) => item.nombrePantalla === pantalla);

    // Setear el permiso en el estado
    return callback(item.nivel_id);
  } catch (error) {
    return console.error("Error getting cookie value:", error);
  }
};
