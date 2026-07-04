import { getProductsByCategory } from "@/data/products"
import type { Product } from "@/types/product"
import { prisma } from "@/lib/prisma"

export interface CategoriaConfig {
  slug: string
  nome: string
  descricao: string
  image?: string
  filter: (product: Product) => boolean
}

const categoriaMap: Record<string, CategoriaConfig> = {
  conjuntos: {
    slug: "conjuntos",
    nome: "Conjuntos de Calça",
    descricao: "Conjuntos completos com calça em poliamida. Conforto e performance para todos os treinos.",
    filter: (p) => p.category === "conjuntos",
  },
  shortinhos: {
    slug: "shortinhos",
    nome: "Conjuntos de Shorts",
    descricao: "Shorts e conjuntos leves para dias quentes e treinos intensos.",
    filter: (p) => p.category === "shorts",
  },
  macaquinhos: {
    slug: "macaquinhos",
    nome: "Macaquinhos",
    descricao: "Macaquinhos fitness em poliamida. Modelagem que valoriza o corpo com conforto absoluto.",
    filter: (p) => p.category === "macaquinho",
  },
  "camisas-uv": {
    slug: "camisas-uv",
    nome: "Camisas UV",
    descricao: "Proteção solar com estilo. Perfeitas para treinos ao ar livre.",
    filter: (p) => p.tags.includes("uv"),
  },
  "camisas-dryfit": {
    slug: "camisas-dryfit",
    nome: "Camisas Dry Fit",
    descricao: "Tecnologia dry-fit para máxima absorção e conforto.",
    filter: (p) => p.tags.includes("dry-fit"),
  },
  feminino: {
    slug: "feminino",
    nome: "Feminino",
    descricao: "Moda fitness feminina premium.",
    filter: (p) => p.tags.includes("feminino"),
  },
  masculino: {
    slug: "masculino",
    nome: "Masculino",
    descricao: "Moda fitness masculina com performance e estilo.",
    filter: (p) => p.tags.includes("masculino"),
  },
  acessorios: {
    slug: "acessorios",
    nome: "Acessórios",
    descricao: "Complete seu look com nossos acessórios fitness.",
    filter: (p) => p.tags.includes("acessorios"),
  },
  regatas: {
    slug: "regatas",
    nome: "Regatas",
    descricao: "Regatas para todos os estilos de treino.",
    filter: (p) => p.category === "regatas",
  },
  leggings: {
    slug: "leggings",
    nome: "Leggings",
    descricao: "Leggings com compressão e conforto para o seu treino.",
    filter: (p) => p.category === "leggings",
  },
  tops: {
    slug: "tops",
    nome: "Tops",
    descricao: "Tops fitness com suporte e estilo.",
    filter: (p) => p.category === "tops",
  },
  corrida: {
    slug: "corrida",
    nome: "Corrida",
    descricao: "Looks perfeitos para corrida e cardio.",
    filter: (p) => p.tags.includes("corrida"),
  },
  lancamentos: {
    slug: "lancamentos",
    nome: "Lançamentos",
    descricao: "As novidades mais recentes da Pulsa Fit.",
    filter: (p) => p.isNew === true,
  },
}

function mergeWithDB(hardcoded: CategoriaConfig, dbCat: { name: string; image?: string | null }): CategoriaConfig {
  return {
    ...hardcoded,
    nome: dbCat.name || hardcoded.nome,
    image: dbCat.image || undefined,
  }
}

async function fetchDBCategorias() {
  try {
    return await prisma.category.findMany({ orderBy: { order: "asc" } })
  } catch {
    return []
  }
}

export async function getCategoria(slug: string): Promise<CategoriaConfig | undefined> {
  const hardcoded = categoriaMap[slug]
  const dbCategorias = await fetchDBCategorias()
  const dbCat = dbCategorias.find((c) => c.slug === slug)

  if (hardcoded) {
    return dbCat ? mergeWithDB(hardcoded, dbCat) : hardcoded
  }

  if (dbCat) {
    return {
      slug: dbCat.slug,
      nome: dbCat.name,
      descricao: "",
      image: dbCat.image || undefined,
      filter: () => false,
    }
  }

  return undefined
}

export async function getProductsFromCategoria(config: CategoriaConfig): Promise<Product[]> {
  return getProductsByCategory(config.slug)
}

export async function getAllCategorias(): Promise<CategoriaConfig[]> {
  const dbCategorias = await fetchDBCategorias()
  return Object.values(categoriaMap).map((hc) => {
    const dbCat = dbCategorias.find((c) => c.slug === hc.slug)
    return dbCat ? mergeWithDB(hc, dbCat) : hc
  })
}
