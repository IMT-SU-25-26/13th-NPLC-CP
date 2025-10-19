import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for better-auth session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie?.value;

  const isOnLoginPage = pathname.startsWith("/auth/login");

  // If user has a session and tries to access login, redirect to problems
  if (hasSession && isOnLoginPage) {
    return NextResponse.redirect(new URL("/problems", request.url));
  }

  // If user has a session, allow access to all pages
  if (hasSession) {
    return NextResponse.next();
  }

  // If no session, protect certain routes
  if (!hasSession) {
    const protectedRoutes = ["/problems", "/leaderboard", "/admin"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * This ensures the middleware runs on our auth pages to handle redirects.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
