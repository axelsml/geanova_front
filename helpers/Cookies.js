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
