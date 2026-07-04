import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const produtos = await prisma.product.findMany({
      include: { colors: true, category: true },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(produtos)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar produtos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { colors, ...data } = body

    const produto = await prisma.product.create({
      data: {
        ...data,
        colors: {
          create: colors ?? [],
        },
      },
      include: { colors: true },
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (err: unknown) {
    console.error("Erro ao criar produto:", err)
    const prismaErr = err as { code?: string }
    if (prismaErr.code === "P2002") {
      return NextResponse.json({ error: "Já existe um produto com este slug" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
