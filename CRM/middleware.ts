import { NextRequest, NextResponse } from "next/server";

// Routes under /crm that don't require authentication
const publicCrmRoutes = ["/crm/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public CRM routes (e.g. /crm/login)
  if (publicCrmRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get("authToken")?.value;

  // If no token, redirect to CRM login
  if (!token) {
    return NextResponse.redirect(new URL("/crm/login", request.url));
  }

  // Token exists, allow the request
  // (JWT signature is verified in each API route handler)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect /crm exactly and /crm/* routes (except /crm/login)
    "/crm",
    "/crm/((?!login).*)",
  ],
};
