"use server";

import { cookies } from "next/headers";

// Asignar una cookie
export const assignCookie = (nombre, valores) => {
  cookies().set(nombre, valores);
};

// Eliminar una cookie
export const removeCookies = (nombre) => {
  cookies().delete(nombre);
};

// Consultar todas las cookies existentes
export const getCookies = () => {
  return cookies().getAll();
};
export const getValueCookies = (nombre) => {
  const cookiePermisos = getCookie(nombre);
  let permisosParse;
  cookiePermisos.then((cooki) => {
    permisosParse = JSON.parse(cooki.value);
    return permisosParse;
  });
};

export async function getCookieValue(cookieName) {
  const cookieStore = cookies();
  const cookiePromise = cookieStore.get(cookieName);

  if (!cookiePromise) {
    return Promise.resolve(null);
  }

  try {
    const cookieValue = await cookiePromise;
    return Promise.resolve(cookieValue.value);
  } catch (error) {
    console.error("Error getting cookie value:", error);
    return Promise.reject(error);
  }
}

// Consultar una cookie específica por nombre
export const getCookie = (nombre) => {
  return cookies().get(nombre);
};

export const expiredCookie = (name, value) => {
  const twoMinutes = 0 * 60 * 1000; // 2 minutes in milliseconds

  // Set the cookie with an expired date (past date)
  cookies().set(name, value, {
    expires: Date.now() + twoMinutes,
  });
};
