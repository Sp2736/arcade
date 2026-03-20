import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for Supabase session cookies. Supabase usually names them starting with 'sb-'
  const supabaseCookie = request.cookies.getAll().find(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/';
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard-');

  // If trying to access a dashboard without a token, kick them to home/login
  if (isDashboardRoute && !supabaseCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Optional: If they are already logged in and try to visit the login page, send them to their dashboard
  // (You would need logic here to determine if they are faculty or student based on their token claims, 
  // but a generic redirect to a routing page works too).

  return NextResponse.next();
}

// Specify which routes this middleware should run on to optimize performance
export const config = {
  matcher: [
    '/dashboard-student/:path*',
    '/dashboard-faculty/:path*',
  ],
};