'use server'

import { cookies } from "next/headers"

export const assignCookie = (nombre, valores) => {
     cookies().set(nombre, valores)
}

export const removeCookies = (nombre) => {
     cookies().delete(nombre)
}