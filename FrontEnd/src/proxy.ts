import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/courses/enrolled', '/profile'];
  
  // Paths for unauthenticated users only
  const authPaths = ['/login', '/register'];

  const isProtectedPath = protectedPaths.some(p => path.startsWith(p));
  const isAuthPath = authPaths.some(p => path.startsWith(p));

  // If user is trying to access a protected path without a session
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is trying to access login/register while already authenticated
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
