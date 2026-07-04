import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categorias = await prisma.category.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(categorias)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar categorias" }, { status: 500 })
  }
}
