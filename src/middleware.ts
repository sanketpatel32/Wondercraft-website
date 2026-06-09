import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super_secret_cyan_server_management_jwt_key_at_least_32_chars"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminsRoute = pathname.startsWith("/dashboard/admins");

  const token = request.cookies.get("token")?.value;

  if (isDashboardRoute) {
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      if (isAdminsRoute && role !== "superadmin") {
        const url = new URL("/dashboard", request.url);
        return NextResponse.redirect(url);
      }
    } catch {
      const url = new URL("/login", request.url);
      const response = NextResponse.redirect(url);
      response.cookies.delete("token");
      return response;
    }
  }

  if (pathname === "/login" && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
