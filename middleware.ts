import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookieName = request.cookies.getAll().find(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'))?.name;
  const authCookie = cookieName ? request.cookies.get(cookieName) : null;
  
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard-');

  if (isDashboardRoute && !authCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (authCookie && isDashboardRoute) {
    try {
      const tokenData = JSON.parse(authCookie.value);
      const accessToken = Array.isArray(tokenData) ? tokenData[0] : null;

      if (!accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const payloadBase64 = accessToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
      const isExpired = decodedPayload.exp * 1000 < Date.now();

      if (isExpired) {
         return NextResponse.redirect(new URL('/', request.url));
      }

    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard-student/:path*',
    '/dashboard-faculty/:path*',
  ],
};