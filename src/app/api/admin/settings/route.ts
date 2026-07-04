import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar configurações" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Formato inválido: array esperado" }, { status: 400 })
    }

    const isValid = body.every(
      (item: unknown) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).key === "string" &&
        typeof (item as Record<string, unknown>).value === "string",
    )

    if (!isValid) {
      return NextResponse.json({ error: "Cada item deve ter key e value como string" }, { status: 400 })
    }

    const settings = body as { key: string; value: string }[]

    for (const { key, value } of settings) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }

    const all = await prisma.setting.findMany({ orderBy: { key: "asc" } })
    return NextResponse.json(all)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
