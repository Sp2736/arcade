import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Demo Middleware
 * Disables production authentication boundaries for the GitHub Pages static demo.
 * Ensures all protected routes are accessible without server-side redirects to login.
 */
export function middleware(request: NextRequest) {
  // Allow all navigation without redirection
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

