import { NextResponse } from "next/server";

export async function middleware(request) {
  const usuario = request.cookies.get("usuario");
  
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/registro") {
    return NextResponse.next();
  }
  
  if (request.nextUrl.pathname.includes("/")) {
    if (usuario === undefined) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    try {
      return NextResponse.next();
    } catch (error) {
      console.error("Error:", error); // Registre el error para depuración
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ['/', '/login(.*)', '/lotes(.*)', '/registro(.*)', '/plazos(.*)', '/terrenos(.*)', '/ventas(.*)', '/api(.*)'],
}
