import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")
  const isAdminApi = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")

  if (isAdminPage || isAdminApi) {
    const response = NextResponse.next()
    const session = await getSession(request, response)

    if (!session.authenticated) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
