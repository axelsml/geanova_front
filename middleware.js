import { NextResponse } from "next/server";

export async function middleware(request) {
  try {
    // Obtener la cookie "usuario"
    const usuario = request.cookies.get("usuario");

    /*  if (request.nextUrl.pathname.includes("/login")) {
      console.log("!usuario: ", !usuario);

      if (usuario) {
        console.log("Usuario autenticado, redirigiendo a /");
      }

      try {
        // El usuario está autenticado, continuar con la solicitud
        console.log("Usuario autenticado, continuando...");
        return NextResponse.next();
      } catch (error) {
        console.error("Error en la verificación del usuario:", error);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } */

    // Permitir acceso a las rutas de login y registro sin verificación
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/registro"
    ) {
      return NextResponse.next();
    }

    // Si la ruta es '/', verifica la existencia de la cookie "usuario"
    if (request.nextUrl.pathname.includes("/")) {
      if (!usuario) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      try {
        // El usuario está autenticado, continuar con la solicitud
        return NextResponse.next();
      } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  } catch (error) {
    // En caso de error, redirigir al login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login(.*)",
    "/lotes(.*)",
    "/cliente(.*)",
    "/configuracion(.*)",
    "/registro(.*)",
    "/plazos(.*)",
    "/terrenos(.*)",
    "/ventas(.*)",
    "/api(.*)",
  ],
};
