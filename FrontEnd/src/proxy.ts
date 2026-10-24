import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Paths that require authenticated student/user access
  const protectedPaths = ['/dashboard', '/courses/enrolled', '/profile'];

  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));
  const isAdminPath = path.startsWith('/admin') && !path.startsWith('/admin-login');

  // If user is trying to access a protected student path without a session
  if (isProtectedPath && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // If user is trying to access an admin path without a session
  if (isAdminPath && !session) {
    const adminLoginUrl = new URL('/admin-login', request.url);
    adminLoginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(adminLoginUrl);
  }

  // Do not redirect away from /login on unverified session string to prevent redirect loops
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
