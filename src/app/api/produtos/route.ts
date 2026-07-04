import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get("ids")
    const limitParam = searchParams.get("limit")

    const where = idsParam
      ? { id: { in: idsParam.split(",") }, active: true }
      : { active: true }

    const produtos = await prisma.product.findMany({
      where,
      include: {
        colors: true,
        category: { select: { slug: true, name: true } },
      },
      orderBy: { id: "asc" },
      ...(limitParam ? { take: parseInt(limitParam, 10) } : {}),
    })

    const mapped = produtos.map((p) => ({
      id: p.id,
      ref: p.ref,
      name: p.name,
      slug: p.slug,
      description: p.description,
      details: p.details,
      care: p.care,
      price: p.price,
      comparePrice: p.comparePrice,
      image: p.image,
      images: p.images,
      category: p.category.slug,
      tags: p.tags,
      isNew: p.isNew,
      rating: p.rating,
      colors: p.colors.map((c) => ({
        hex: c.hex,
        name: c.name,
        thumb: c.thumb,
        image: c.image,
      })),
      sizes: p.sizes,
      weight: p.weight,
      width: p.width,
      height: p.height,
      length: p.length,
    }))

    return NextResponse.json(mapped)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar produtos" }, { status: 500 })
  }
}
