import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const produto = await prisma.product.findUnique({
      where: { id },
      include: { colors: true, category: true },
    })

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json(produto)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar produto" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { colors, ...data } = body

    const updateData: Record<string, unknown> = { ...data }
    if ("colors" in body) {
      updateData.colors = {
        deleteMany: {},
        create: (colors ?? []).map(({ hex, name, thumb, image }: { hex: string; name: string; thumb: string; image?: string }) => ({ hex, name, thumb, image })),
      }
    }

    const produto = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { colors: true, category: true },
    })

    return NextResponse.json(produto)
  } catch (err: unknown) {
    console.error("Erro ao atualizar produto:", err)
    const prismaErr = err as { code?: string }
    if (prismaErr.code === "P2025") {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }
    if (prismaErr.code === "P2002") {
      return NextResponse.json({ error: "Já existe um produto com este slug" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.colorVariant.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: "Produto removido" })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }
    if (code === "P2003") {
      return NextResponse.json({ error: "Produto possui pedidos vinculados" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 })
  }
}
