import { NextRequest, NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get("authToken")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token exists, allow the request
  // (Full verification happens in API routes if needed)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all routes except public ones
    "/((?!login|api/auth/login|_next/static|_next/image|images|favicon.ico).*)",
  ],
};
