import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const cupons = await prisma.coupon.findMany({
      orderBy: { code: "asc" },
    })
    return NextResponse.json(cupons)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar cupons" }, { status: 500 })
  }
}

const CUPOM_FIELDS = ["code", "discountPercent", "maxUses", "expiresAt", "active"] as const

type CouponData = {
  code?: string
  discountPercent?: number
  maxUses?: number
  expiresAt?: string | null
  active?: boolean
}

function pickCouponData(body: Record<string, unknown>): CouponData {
  const data: CouponData = {}
  for (const key of CUPOM_FIELDS) {
    if (key in body) (data as Record<string, unknown>)[key] = body[key]
  }
  if (typeof data.code === "string") data.code = data.code.trim().toUpperCase()
  return data
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = pickCouponData(body)

    if (!data.code || data.discountPercent === undefined) {
      return NextResponse.json({ error: "Código e percentual são obrigatórios" }, { status: 400 })
    }

    if (typeof data.discountPercent !== "number" || data.discountPercent <= 0 || data.discountPercent > 100) {
      return NextResponse.json({ error: "Percentual deve ser entre 1 e 100" }, { status: 400 })
    }

    const cupom = await prisma.coupon.create({ data: data as never })
    return NextResponse.json(cupom, { status: 201 })
  } catch (err: unknown) {
    console.error("Erro ao criar cupom:", err)
    const prismaErr = err as { code?: string }
    if (prismaErr.code === "P2002") {
      return NextResponse.json({ error: "Já existe um cupom com este código" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro ao criar cupom" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })
    }

    const data = pickCouponData(body)

    const cupom = await prisma.coupon.update({
      where: { id },
      data: data as never,
    })

    return NextResponse.json(cupom)
  } catch (err: unknown) {
    console.error("Erro ao atualizar cupom:", err)
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }
    if (code === "P2002") {
      return NextResponse.json({ error: "Já existe um cupom com este código" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro ao atualizar cupom" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })
    }

    await prisma.coupon.delete({ where: { id } })

    return NextResponse.json({ message: "Cupom removido" })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === "P2025") {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ error: "Erro ao deletar cupom" }, { status: 500 })
  }
}
