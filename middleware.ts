import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Simple session presence check (cookie named "session").
  // This avoids depending on Supabase in middleware so dev can run.
  // A proper session validation against MongoDB will be implemented next.
  const sessionCookie = request.cookies.get("session")?.value

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protect admin routes (presence check only for now)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect authenticated users away from login/signup
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
