import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categorias = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    })
    return NextResponse.json(categorias)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar categorias" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const categoria = await prisma.category.create({ data: body })
    return NextResponse.json(categoria, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const categoria = await prisma.category.update({
      where: { id },
      data,
    })

    return NextResponse.json(categoria)
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 })
    }
    if (code === "P2002") {
      return NextResponse.json({ error: "Já existe uma categoria com este slug" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ message: "Categoria removida" })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 })
    }
    if (code === "P2003") {
      return NextResponse.json({ error: "Categoria possui produtos vinculados. Remova-os primeiro." }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 })
  }
}
