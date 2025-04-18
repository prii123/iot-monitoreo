import { NextResponse } from 'next/server';

export function middleware(request) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const { pathname } = request.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/companies', '/devices'];
  
  // Rutas de autenticación
  const authRoutes = ['/auth/login', '/auth/register'];

  // Verificar rutas protegidas
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken) {
      // Si no hay accessToken pero hay refreshToken, intentar renovar
      if (refreshToken) {
        const response = NextResponse.redirect(new URL('/api/auth/refresh', request.url));
        return response;
      }
      // Si no hay ningún token, redirigir a login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Si ya está autenticado, redirigir del login/register al dashboard
  if (authRoutes.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}