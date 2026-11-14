import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("accessToken")?.value;

  const role = request.cookies.get("role")?.value?.toUpperCase();

  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isProtectedPath =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");

  // 1. If unauthenticated user tries to access protected pages -> redirect to /login
  if (!token && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated user tries to access auth pages (/login) -> redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Role-Based Access Control (RBAC):
  // Admin-only modules & creation paths:
  const isAdminOnlyPath =
    pathname.startsWith("/dashboard/submissions") ||
    pathname.startsWith("/dashboard/members") ||
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/badges/create") ||
    pathname.startsWith("/dashboard/badges/edit") ||
    pathname.startsWith("/dashboard/events/new") ||
    pathname.includes("/edite") ||
    pathname.startsWith("/dashboard/challenges/create-challenge") ||
    pathname.startsWith("/dashboard/news/create") ||
    pathname.startsWith("/dashboard/news/edit");

  if (token && role === "MEMBER" && isAdminOnlyPath) {
    // Member/runner cannot access admin moderation, user management, or admin creation forms
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons
     */
    "/((?!api|_next/static|_next/image|favicon.ico|image|demoData|public|uploads).*)",
  ],
};
