import { prisma } from "@/lib/prisma"
import type { Product } from "@/types/product"

function mapProduct(p: any): Product {
  return {
    id: p.id,
    ref: p.ref || undefined,
    name: p.name,
    slug: p.slug,
    description: p.description,
    details: p.details || undefined,
    care: p.care || undefined,
    price: p.price,
    comparePrice: p.comparePrice || undefined,
    image: p.image,
    images: p.images,
    category: p.category.slug,
    tags: p.tags,
    isNew: p.isNew || undefined,
    rating: p.rating,
    colors: p.colors.map((c: any) => ({
      hex: c.hex,
      name: c.name,
      thumb: c.thumb,
      image: c.image || undefined,
    })),
    sizes: p.sizes,
    weight: p.weight,
    width: p.width,
    height: p.height,
    length: p.length,
  }
}

const include = {
  colors: true,
  category: { select: { slug: true } },
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category: { slug: categorySlug }, active: true },
    include,
  })
  return products.map(mapProduct)
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { tags: { has: tag }, active: true },
    include,
  })
  return products.map(mapProduct)
}

export async function getNewProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isNew: true, active: true },
    orderBy: { id: "asc" },
    take: 4,
    include,
  })
  return products.map(mapProduct)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { id: "asc" },
    take: 4,
    include,
  })
  return products.map(mapProduct)
}

export async function getFavoriteProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { rating: { gte: 4.7 }, active: true },
    orderBy: { id: "asc" },
    take: 4,
    include,
  })
  return products.map(mapProduct)
}

export async function getRunningProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { tags: { has: "corrida" }, active: true },
    include,
  })
  return products.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include,
  })
  return product ? mapProduct(product) : undefined
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
        { category: { slug: { contains: q, mode: "insensitive" } } },
      ],
    },
    include,
  })
  return products.map(mapProduct)
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      id: { not: product.id },
      OR: [
        { category: { slug: product.category } },
        { tags: { hasSome: product.tags } },
      ],
    },
    include,
    take: 4,
  })
  return products.map(mapProduct)
}
