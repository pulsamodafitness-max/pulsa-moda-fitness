import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const pedidos = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(pedidos)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar pedidos" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    const pedido = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    })

    return NextResponse.json(pedido)
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 })
  }
}
