import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie?.value;

  // Debug logging for production
  if (process.env.NODE_ENV === "production") {
    console.log("[Middleware] Path:", pathname);
    console.log("[Middleware] Has session:", hasSession);
    console.log("[Middleware] All cookies:", request.cookies.getAll().map(c => c.name));
  }

  const isOnLoginPage = pathname.startsWith("/auth/login");

  if (hasSession && isOnLoginPage) {
    return NextResponse.redirect(new URL("/problems", request.url));
  }

  if (hasSession) {
    return NextResponse.next();
  }

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
   * - backgrounds, logos, fonts (public assets)
   * This ensures the middleware runs on our auth pages to handle redirects.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|backgrounds|logos|fonts|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
