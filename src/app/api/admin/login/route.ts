import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json({ error: "Servidor mal configurado" }, { status: 500 })
    }

    const response = NextResponse.json({ ok: true })
    const session = await getSession(request, response)

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 })
    }

    session.authenticated = true

    await session.save()
    return response
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
