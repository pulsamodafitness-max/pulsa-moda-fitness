import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(banners)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar banners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const banner = await prisma.banner.create({ data: body })
    return NextResponse.json(banner, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar banner" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const banner = await prisma.banner.update({
      where: { id },
      data,
    })

    return NextResponse.json(banner)
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ error: "Erro ao atualizar banner" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })
    }

    await prisma.banner.delete({ where: { id } })

    return NextResponse.json({ message: "Banner removido" })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ error: "Erro ao deletar banner" }, { status: 500 })
  }
}
