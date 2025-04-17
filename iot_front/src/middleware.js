import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/companies', '/devices'];
  
  // Rutas de autenticación
  const authRoutes = ['/auth/login', '/auth/register'];

  // Verificar rutas protegidas
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Si ya está autenticado, redirigir del login/register al dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}