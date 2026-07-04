import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    })

    const mapped = banners.map((b) => ({
      id: b.id,
      image: b.image,
      title: b.title,
      subtitle: b.subtitle || undefined,
      cta: b.cta || undefined,
      ctaLink: b.ctaLink || undefined,
      mobileImages: b.mobileImages,
    }))

    return NextResponse.json(mapped)
  } catch {
    return NextResponse.json({ error: "Erro ao carregar banners" }, { status: 500 })
  }
}