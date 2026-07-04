import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET(request: Request) {
  try {
    const response = NextResponse.json({ ok: true })
    const session = await getSession(request, response)
    return NextResponse.json({ authenticated: !!session.authenticated })
  } catch {
    return NextResponse.json({ error: "Erro ao verificar sessão" }, { status: 500 })
  }
}
