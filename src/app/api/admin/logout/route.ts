import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ ok: true })
    const session = await getSession(request, response)
    session.destroy()
    return response
  } catch {
    return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 })
  }
}
