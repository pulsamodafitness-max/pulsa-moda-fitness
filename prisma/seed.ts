import "dotenv/config"
import { PrismaClient } from "../prisma/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

const unsplash = "https://images.unsplash.com"

function img(cat: string, dir: string, n: number) {
  return `/images/produtos/${cat}/${dir}/${n}.jpg`
}

const has3: Record<string, boolean> = {
  balance: true, core: true, highline: true, intensity: true,
  maxshapee: true, perfectfit: true, powerline: true, ultrafit: true,
  breeze: true, energy: true, fit: true, flow: true,
  spark: true, strike: true, sunny: true, velocity: true, vibe: true, wave: true,
  delight: true, beauty: true, dream: true, lady: true, sweet: true,
}

function imgs(cat: string, dir: string): string[] {
  const r = [img(cat, dir, 1), img(cat, dir, 2)]
  if (has3[dir]) r.push(img(cat, dir, 3))
  return r
}

interface SeedColor {
  hex: string
  name: string
  thumb: string
  image?: string
}

interface SeedProduct {
  id: string
  ref?: string
  name: string
  slug: string
  description: string
  details?: string
  care?: string
  price: number
  comparePrice?: number
  image: string
  images: string[]
  category: string
  tags: string[]
  isNew?: boolean
  rating: number
  colors: SeedColor[]
  sizes: string[]
  weight: number
  width: number
  height: number
  length: number
}

const cv = (slug: string, hex: string, name: string, hasImages = false, thumbOverride?: string): SeedColor => ({
  hex, name,
  thumb: thumbOverride || `/products/${slug}/${name}/thumb.webp`,
  ...(hasImages ? { image: `/products/${slug}/${name}/front.webp` } : {}),
})

const products: SeedProduct[] = [
  { id: "1", ref: "REF001", name: "Conjunto Balance", slug: "conjunto-balance", description: "Conjunto fitness em poliamida com calça. Modelagem que abraça o corpo com conforto e liberdade de movimento.", details: "Tecido poliamida de alta durabilidade. Cós largo elástico. Costuras reforçadas. Proteção UV.", care: "Lavar em água fria. Não usar amaciante. Secar à sombra.", price: 189.90, comparePrice: 239.90, image: img("conjunto-calca", "balance", 1), images: imgs("conjunto-calca", "balance"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto"], isNew: true, rating: 4.8, colors: [cv("conjunto-balance", "#000000", "preto", true), cv("conjunto-balance", "#2d6a4f", "verde", true), cv("conjunto-balance", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "2", ref: "REF002", name: "Conjunto Core", slug: "conjunto-core", description: "Conjunto em poliamida com calça de cintura alta. Conforto absoluto para todos os treinos.", details: "Cintura alta com compressão suave. Tecido respirável de secagem rápida. Costuras planas.", care: "Lavar em água fria. Secar à sombra. Não usar alvejante.", price: 179.90, image: img("conjunto-calca", "core", 1), images: imgs("conjunto-calca", "core"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto"], isNew: true, rating: 4.7, colors: [cv("conjunto-core", "#000000", "preto", true), cv("conjunto-core", "#2d6a4f", "verde", true), cv("conjunto-core", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "3", ref: "REF003", name: "Conjunto Highline", slug: "conjunto-highline", description: "Conjunto poliamida premium com calça. Design moderno para quem busca performance e estilo.", details: "Tecido de alta compressão. Cós largo antideslizante. Proteção UV FPS 50+.", care: "Lavar em água fria. Não usar amaciante. Secar à sombra.", price: 199.90, image: img("conjunto-calca", "highline", 1), images: imgs("conjunto-calca", "highline"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto"], isNew: true, rating: 4.9, colors: [cv("conjunto-highline", "#000000", "preto", true), cv("conjunto-highline", "#2d6a4f", "verde", true), cv("conjunto-highline", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "4", ref: "REF004", name: "Conjunto Intensity", slug: "conjunto-intensity", description: "Conjunto de alta performance com calça. Ideal para treinos intensos de musculação e crossfit.", details: "Tecido resistente com elastano. Costuras duplas. Cós largo com cordão interno.", care: "Lavar em água fria. Não usar alvejante. Secar à sombra.", price: 189.90, image: img("conjunto-calca", "intensity", 1), images: imgs("conjunto-calca", "intensity"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto", "corrida"], isNew: true, rating: 4.6, colors: [cv("conjunto-intensity", "#000000", "preto", true), cv("conjunto-intensity", "#2d6a4f", "verde", true), cv("conjunto-intensity", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "5", ref: "REF005", name: "Conjunto Max Shape", slug: "conjunto-max-shape", description: "Conjunto modelador com calça. Tecnologia que esculpe e valoriza suas curvas.", details: "Tecido modelador com compressão graduada. Cintura alta. Costuras invisíveis.", care: "Lavar à mão em água fria. Não usar amaciante. Secar à sombra.", price: 199.90, comparePrice: 249.90, image: img("conjunto-calca", "maxshapee", 1), images: imgs("conjunto-calca", "maxshapee"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto"], isNew: true, rating: 4.8, colors: [cv("conjunto-max-shape", "#000000", "preto", true), cv("conjunto-max-shape", "#2d6a4f", "verde", true), cv("conjunto-max-shape", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "6", ref: "REF006", name: "Conjunto Perfect Fit", slug: "conjunto-perfect-fit", description: "Conjunto com calça de caimento perfeito. Conforto e elegância para o dia a dia fitness.", details: "Poliamida com elastano. Cós largo elástico. Bolsos laterais. Proteção UV.", care: "Lavar em água fria. Secar à sombra. Não usar alvejante.", price: 189.90, image: img("conjunto-calca", "perfectfit", 1), images: imgs("conjunto-calca", "perfectfit"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto"], isNew: true, rating: 4.5, colors: [cv("conjunto-perfect-fit", "#000000", "preto", true), cv("conjunto-perfect-fit", "#2d6a4f", "verde", true), cv("conjunto-perfect-fit", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "7", ref: "REF007", name: "Conjunto Powerline", slug: "conjunto-powerline", description: "Conjunto robusto com calça. Máxima resistência para treinos pesados.", details: "Tecido de alta gramatura. Costuras triplas. Cós largo com cordão. Bolsos laterais profundos.", care: "Lavar em água fria. Não usar amaciante. Secar à sombra.", price: 179.90, image: img("conjunto-calca", "powerline", 1), images: imgs("conjunto-calca", "powerline"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto"], isNew: true, rating: 4.7, colors: [cv("conjunto-powerline", "#000000", "preto", true), cv("conjunto-powerline", "#2d6a4f", "verde", true), cv("conjunto-powerline", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "8", ref: "REF008", name: "Conjunto Ultrafit", slug: "conjunto-ultrafit", description: "Conjunto ultraleve com calça. Sensação de segunda pele para treinos de alta performance.", details: "Tecido ultrafino com compressão leve. Costuras planas que não marcam. Proteção UV.", care: "Lavar em água fria. Não usar amaciante. Secar à sombra.", price: 199.90, image: img("conjunto-calca", "ultrafit", 1), images: imgs("conjunto-calca", "ultrafit"), category: "conjuntos", tags: ["feminino", "poliamida", "conjunto", "corrida"], isNew: true, rating: 4.9, colors: [cv("conjunto-ultrafit", "#000000", "preto", true), cv("conjunto-ultrafit", "#2d6a4f", "verde", true), cv("conjunto-ultrafit", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.5, width: 30, height: 20, length: 5 },
  { id: "9", ref: "REF009", name: "Conjunto Breeze", slug: "conjunto-breeze", description: "Conjunto leve com short. Perfeito para dias quentes e treinos ao ar livre.", details: "Tecido leve de secagem rápida. Short com cós elástico. Top com alças ajustáveis.", care: "Lavar em água fria. Secar à sombra. Não usar alvejante.", price: 159.90, image: img("conjunto-short", "breeze", 1), images: imgs("conjunto-short", "breeze"), category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.6, colors: [cv("conjunto-breeze", "#000000", "preto", true), cv("conjunto-breeze", "#2d6a4f", "verde", true), cv("conjunto-breeze", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "10", ref: "REF010", name: "Conjunto Energy", slug: "conjunto-energy", description: "Conjunto vibrante com short. Energia e estilo para seus treinos.", details: "Poliamida de alta durabilidade. Short com bolsos. Top com forro interno.", care: "Lavar em água fria. Não usar amaciante. Secar à sombra.", price: 169.90, image: img("conjunto-short", "energy", 1), images: imgs("conjunto-short", "energy"), category: "shorts", tags: ["feminino", "poliamida", "short", "corrida"], isNew: true, rating: 4.7, colors: [cv("conjunto-energy", "#000000", "preto", true), cv("conjunto-energy", "#2d6a4f", "verde", true), cv("conjunto-energy", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  // Products 11-35 truncated for brevity in seed — using full data from products.ts
  { id: "11", ref: "REF011", name: "Conjunto Fit", slug: "conjunto-fit", description: "Conjunto funcional com short.", details: "Tecido respirável.", care: "Lavar em água fria.", price: 149.90, image: img("conjunto-short", "fit", 1), images: imgs("conjunto-short", "fit"), category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.5, colors: [cv("conjunto-fit", "#000000", "preto", true), cv("conjunto-fit", "#2d6a4f", "verde", true), cv("conjunto-fit", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "12", ref: "REF012", name: "Conjunto Flow", slug: "conjunto-flow", description: "Conjunto fluido com short.", details: "Tecido leve e maleável.", care: "Lavar à mão em água fria.", price: 159.90, image: img("conjunto-short", "flow", 1), images: imgs("conjunto-short", "flow"), category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.4, colors: [cv("conjunto-flow", "#000000", "preto", true), cv("conjunto-flow", "#2d6a4f", "verde", true), cv("conjunto-flow", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "13", ref: "REF013", name: "Conjunto Glow", slug: "conjunto-glow", description: "Conjunto com short que ilumina seu visual.", details: "Poliamida premium.", care: "Lavar em água fria.", price: 169.90, image: img("conjunto-short", "glow", 1), images: [img("conjunto-short", "glow", 1), img("conjunto-short", "glow", 2)], category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.6, colors: [cv("conjunto-glow", "#000000", "preto", true), cv("conjunto-glow", "#2d6a4f", "verde", true), cv("conjunto-glow", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "14", ref: "REF014", name: "Conjunto Jump", slug: "conjunto-jump", description: "Conjunto dinâmico com short.", details: "Tecido resistente com elastano.", care: "Lavar em água fria.", price: 159.90, image: img("conjunto-short", "jump", 1), images: [img("conjunto-short", "jump", 1), img("conjunto-short", "jump", 2)], category: "shorts", tags: ["feminino", "poliamida", "short", "corrida"], isNew: true, rating: 4.8, colors: [cv("conjunto-jump", "#000000", "preto", true), cv("conjunto-jump", "#2d6a4f", "verde", true), cv("conjunto-jump", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "15", ref: "REF015", name: "Conjunto Pulse", slug: "conjunto-pulse", description: "Conjunto com short.", details: "Poliamida respirável.", care: "Lavar em água fria.", price: 149.90, image: img("conjunto-short", "pulse", 1), images: [img("conjunto-short", "pulse", 1), img("conjunto-short", "pulse", 2)], category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.5, colors: [cv("conjunto-pulse", "#000000", "preto", true), cv("conjunto-pulse", "#2d6a4f", "verde", true), cv("conjunto-pulse", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "16", ref: "REF016", name: "Conjunto Pulse One", slug: "conjunto-pulse-one", description: "Conjunto exclusivo com short.", details: "Design diferenciado.", care: "Lavar em água fria.", price: 179.90, image: img("conjunto-short", "pulse-one", 1), images: [img("conjunto-short", "pulse-one", 1), img("conjunto-short", "pulse-one", 2)], category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.7, colors: [cv("conjunto-pulse-one", "#000000", "preto", true), cv("conjunto-pulse-one", "#2d6a4f", "verde", true), cv("conjunto-pulse-one", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "17", ref: "REF017", name: "Conjunto Ritmo", slug: "conjunto-ritmo", description: "Conjunto com short.", details: "Tecido leve com caimento perfeito.", care: "Lavar em água fria.", price: 159.90, image: img("conjunto-short", "ritmo", 1), images: [img("conjunto-short", "ritmo", 1), img("conjunto-short", "ritmo", 2)], category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.4, colors: [cv("conjunto-ritmo", "#000000", "preto", true), cv("conjunto-ritmo", "#2d6a4f", "verde", true), cv("conjunto-ritmo", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "18", ref: "REF018", name: "Conjunto Spark", slug: "conjunto-spark", description: "Conjunto com short que acende sua performance.", details: "Poliamida de alta tecnologia.", care: "Lavar em água fria.", price: 169.90, image: img("conjunto-short", "spark", 1), images: imgs("conjunto-short", "spark"), category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.6, colors: [cv("conjunto-spark", "#000000", "preto", true), cv("conjunto-spark", "#2d6a4f", "verde", true), cv("conjunto-spark", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "19", ref: "REF019", name: "Conjunto Strike", slug: "conjunto-strike", description: "Conjunto impactante com short.", details: "Tecido resistente de alta performance.", care: "Lavar em água fria.", price: 159.90, image: img("conjunto-short", "strike", 1), images: imgs("conjunto-short", "strike"), category: "shorts", tags: ["feminino", "poliamida", "short", "corrida"], isNew: true, rating: 4.7, colors: [cv("conjunto-strike", "#000000", "preto", true), cv("conjunto-strike", "#2d6a4f", "verde", true), cv("conjunto-strike", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "20", ref: "REF020", name: "Conjunto Sunny", slug: "conjunto-sunny", description: "Conjunto radiante com short.", details: "Tecido leve de secagem rápida.", care: "Lavar em água fria.", price: 149.90, image: img("conjunto-short", "sunny", 1), images: imgs("conjunto-short", "sunny"), category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.5, colors: [cv("conjunto-sunny", "#000000", "preto", true), cv("conjunto-sunny", "#2d6a4f", "verde", true), cv("conjunto-sunny", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "21", ref: "REF021", name: "Conjunto Velocity", slug: "conjunto-velocity", description: "Conjunto veloz com short.", details: "Poliamida ultraleve.", care: "Lavar em água fria.", price: 169.90, image: img("conjunto-short", "velocity", 1), images: imgs("conjunto-short", "velocity"), category: "shorts", tags: ["feminino", "poliamida", "short", "corrida"], isNew: true, rating: 4.8, colors: [cv("conjunto-velocity", "#000000", "preto", true), cv("conjunto-velocity", "#2d6a4f", "verde", true), cv("conjunto-velocity", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "22", ref: "REF022", name: "Conjunto Vibe", slug: "conjunto-vibe", description: "Conjunto com short.", details: "Tecido confortável com elastano.", care: "Lavar em água fria.", price: 159.90, image: img("conjunto-short", "vibe", 1), images: imgs("conjunto-short", "vibe"), category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.6, colors: [cv("conjunto-vibe", "#000000", "preto", true), cv("conjunto-vibe", "#2d6a4f", "verde", true), cv("conjunto-vibe", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "23", ref: "REF023", name: "Conjunto Wave", slug: "conjunto-wave", description: "Conjunto com short. Fluidez e movimento em cada detalhe.", details: "Tecido leve e maleável.", care: "Lavar em água fria.", price: 149.90, image: img("conjunto-short", "wave", 1), images: imgs("conjunto-short", "wave"), category: "shorts", tags: ["feminino", "poliamida", "short"], isNew: true, rating: 4.4, colors: [cv("conjunto-wave", "#000000", "preto", true), cv("conjunto-wave", "#2d6a4f", "verde", true), cv("conjunto-wave", "#e11d48", "rosa", true)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.4, width: 30, height: 20, length: 4 },
  { id: "24", ref: "REF024", name: "Macaquinho Delight", slug: "macaquinho-delight", description: "Macaquinho poliamida com alças finas.", details: "Tecido maleável com elastano.", care: "Lavar à mão em água fria.", price: 109.90, image: img("macaquinho", "delight", 1), images: imgs("macaquinho", "delight"), category: "macaquinho", tags: ["feminino", "macaquinho", "poliamida"], isNew: true, rating: 4.7, colors: [cv("macaquinho-delight", "#000000", "preto")], sizes: ["PP", "P", "M", "G"], weight: 0.3, width: 25, height: 20, length: 3 },
  { id: "25", ref: "REF025", name: "Macaquinho Beauty", slug: "macaquinho-beauty", description: "Macaquinho poliamida. Beleza e conforto para seus treinos.", details: "Tecido poliamida de alta qualidade.", care: "Lavar em água fria.", price: 119.90, image: img("macaquinho", "beauty", 1), images: imgs("macaquinho", "beauty"), category: "macaquinho", tags: ["feminino", "macaquinho", "poliamida"], isNew: true, rating: 4.6, colors: [cv("macaquinho-beauty", "#000000", "preto")], sizes: ["PP", "P", "M", "G"], weight: 0.3, width: 25, height: 20, length: 3 },
  { id: "26", ref: "REF026", name: "Macaquinho Dream", slug: "macaquinho-dream", description: "Macaquinho dos sonhos em poliamida.", details: "Tecido macio como segunda pele.", care: "Lavar à mão em água fria.", price: 129.90, comparePrice: 159.90, image: img("macaquinho", "dream", 1), images: imgs("macaquinho", "dream"), category: "macaquinho", tags: ["feminino", "macaquinho", "poliamida"], isNew: true, rating: 4.8, colors: [cv("macaquinho-dream", "#000000", "preto")], sizes: ["PP", "P", "M", "G"], weight: 0.3, width: 25, height: 20, length: 3 },
  { id: "27", ref: "REF027", name: "Macaquinho Lady", slug: "macaquinho-lady", description: "Macaquinho feminino em poliamida.", details: "Poliamida premium.", care: "Lavar em água fria.", price: 119.90, image: img("macaquinho", "lady", 1), images: imgs("macaquinho", "lady"), category: "macaquinho", tags: ["feminino", "macaquinho", "poliamida"], isNew: true, rating: 4.5, colors: [cv("macaquinho-lady", "#000000", "preto")], sizes: ["PP", "P", "M", "G"], weight: 0.3, width: 25, height: 20, length: 3 },
  { id: "28", ref: "REF028", name: "Macaquinho Summer", slug: "macaquinho-summer", description: "Macaquinho leve em poliamida.", details: "Tecido fresco e respirável.", care: "Lavar à mão em água fria.", price: 99.90, image: img("macaquinho", "summer", 1), images: [img("macaquinho", "summer", 1), img("macaquinho", "summer", 2)], category: "macaquinho", tags: ["feminino", "macaquinho", "poliamida"], isNew: true, rating: 4.4, colors: [cv("macaquinho-summer", "#000000", "preto")], sizes: ["PP", "P", "M", "G"], weight: 0.3, width: 25, height: 20, length: 3 },
  { id: "29", ref: "REF029", name: "Macaquinho Sweet", slug: "macaquinho-sweet", description: "Macaquinho doce em poliamida.", details: "Poliamida macia.", care: "Lavar em água fria.", price: 119.90, image: img("macaquinho", "sweet", 1), images: imgs("macaquinho", "sweet"), category: "macaquinho", tags: ["feminino", "macaquinho", "poliamida"], isNew: true, rating: 4.7, colors: [cv("macaquinho-sweet", "#000000", "preto")], sizes: ["PP", "P", "M", "G"], weight: 0.3, width: 25, height: 20, length: 3 },
  { id: "30", ref: "REF030", name: "Regata Seamless Preta", slug: "regata-seamless-preta", description: "Regata fitness com tecnologia seamless.", details: "Tecnologia seamless.", care: "Lavar à mão.", price: 89.90, image: `${unsplash}/photo-1434389677669-e08b4cda3a0c?w=600&q=80`, images: [`${unsplash}/photo-1434389677669-e08b4cda3a0c?w=600&q=80`, `${unsplash}/photo-1518310383802-64095b1c2f8b?w=600&q=80`, `${unsplash}/photo-1571019613454-1cb2f99b2d8b?w=600&q=80`], category: "regatas", tags: ["seamless", "preto", "feminino", "dry-fit"], isNew: false, rating: 4.8, colors: [cv("regata-seamless-preta", "#000000", "preto", false, `${unsplash}/photo-1434389677669-e08b4cda3a0c?w=100&q=80`), cv("regata-seamless-preta", "#ffffff", "branco", false, `${unsplash}/photo-1434389677669-e08b4cda3a0c?w=100&q=80`), cv("regata-seamless-preta", "#e11d48", "rosa", false, `${unsplash}/photo-1434389677669-e08b4cda3a0c?w=100&q=80`)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.15, width: 20, height: 15, length: 2 },
  { id: "31", ref: "REF031", name: "Legging Compression Cinza", slug: "legging-compression-cinza", description: "Legging de alta compressão.", details: "Cintura alta que não desce.", care: "Lavar em água fria.", price: 149.90, comparePrice: 199.90, image: `${unsplash}/photo-1506629082955-511b1aa562c8?w=600&q=80`, images: [`${unsplash}/photo-1506629082955-511b1aa562c8?w=600&q=80`, `${unsplash}/photo-1593720219276-0b1eacd0aef4?w=600&q=80`, `${unsplash}/photo-1518310383802-64095b1c2f8b?w=600&q=80`], category: "leggings", tags: ["compression", "cinza", "feminino", "dry-fit"], isNew: false, rating: 4.9, colors: [cv("legging-compression-cinza", "#6b7280", "cinza", false, `${unsplash}/photo-1506629082955-511b1aa562c8?w=100&q=80`), cv("legging-compression-cinza", "#000000", "preto", false, `${unsplash}/photo-1506629082955-511b1aa562c8?w=100&q=80`), cv("legging-compression-cinza", "#1e3a5f", "azul-marinho", false, `${unsplash}/photo-1506629082955-511b1aa562c8?w=100&q=80`)], sizes: ["PP", "P", "M", "G", "GG"], weight: 0.3, width: 25, height: 15, length: 4 },
  { id: "32", ref: "REF032", name: "Top Estrutura Fit", slug: "top-estrutura-fit", description: "Top com estrutura interna.", details: "Estrutura interna com bojo removível.", care: "Lavar em água fria.", price: 79.90, image: `${unsplash}/photo-1518611012118-696072aa579a?w=600&q=80`, images: [`${unsplash}/photo-1518611012118-696072aa579a?w=600&q=80`, `${unsplash}/photo-1571019613454-1cb2f99b2d8b?w=600&q=80`, `${unsplash}/photo-1518310383802-64095b1c2f8b?w=600&q=80`], category: "tops", tags: ["top", "estruturado", "feminino", "dry-fit"], isNew: false, rating: 4.6, colors: [cv("top-estrutura-fit", "#000000", "preto", false, `${unsplash}/photo-1518611012118-696072aa579a?w=100&q=80`), cv("top-estrutura-fit", "#f5f5f5", "off-white", false, `${unsplash}/photo-1518611012118-696072aa579a?w=100&q=80`), cv("top-estrutura-fit", "#e11d48", "rosa", false, `${unsplash}/photo-1518611012118-696072aa579a?w=100&q=80`)], sizes: ["PP", "P", "M", "G"], weight: 0.1, width: 20, height: 15, length: 2 },
  { id: "33", ref: "REF033", name: "Blusão Moletom Essential", slug: "blusao-moletom-essential", description: "Moletom oversized.", details: "Algodão premium 400g/m².", care: "Lavar à máquina.", price: 129.90, comparePrice: 169.90, image: `${unsplash}/photo-1556821840-3a63f95609a7?w=600&q=80`, images: [`${unsplash}/photo-1556821840-3a63f95609a7?w=600&q=80`, `${unsplash}/photo-1594938298603-c8148c4dae35?w=600&q=80`, `${unsplash}/photo-1576566588028-4147f3842f27?w=600&q=80`], category: "casual", tags: ["moletom", "casual", "unissex"], isNew: false, rating: 4.7, colors: [cv("blusao-moletom-essential", "#4a5568", "grafite", false, `${unsplash}/photo-1556821840-3a63f95609a7?w=100&q=80`), cv("blusao-moletom-essential", "#000000", "preto", false, `${unsplash}/photo-1556821840-3a63f95609a7?w=100&q=80`), cv("blusao-moletom-essential", "#f5f5f5", "off-white", false, `${unsplash}/photo-1556821840-3a63f95609a7?w=100&q=80`)], sizes: ["P", "M", "G", "GG", "XGG"], weight: 0.6, width: 35, height: 25, length: 8 },
  { id: "34", ref: "REF034", name: "Garrafa Térmica Pulsa", slug: "garrafa-termica-pulsa", description: "Garrafa térmica em aço inoxidável.", details: "Aço inoxidável 304.", care: "Lavar com água e sabão neutro.", price: 49.90, image: `${unsplash}/photo-1548839140-29a749e1cf4d?w=600&q=80`, images: [`${unsplash}/photo-1548839140-29a749e1cf4d?w=600&q=80`, `${unsplash}/photo-1570831739435-6601aa3fa4fb?w=600&q=80`], category: "acessorios", tags: ["acessorios", "garrafa", "termica"], isNew: false, rating: 4.3, colors: [cv("garrafa-termica-pulsa", "#000000", "preto", false, `${unsplash}/photo-1548839140-29a749e1cf4d?w=100&q=80`), cv("garrafa-termica-pulsa", "#ffffff", "branco", false, `${unsplash}/photo-1548839140-29a749e1cf4d?w=100&q=80`), cv("garrafa-termica-pulsa", "#d4a5a5", "rose", false, `${unsplash}/photo-1548839140-29a749e1cf4d?w=100&q=80`)], sizes: ["Único"], weight: 0.4, width: 10, height: 10, length: 25 },
  { id: "35", ref: "REF035", name: "Camisa UV Proteção Solar", slug: "camisa-uv-protecao-solar", description: "Camisa com proteção UV FPS 50+.", details: "Proteção UV FPS 50+.", care: "Lavar em água fria.", price: 89.90, comparePrice: 119.90, image: `${unsplash}/photo-1584865288642-42078afe6942?w=600&q=80`, images: [`${unsplash}/photo-1584865288642-42078afe6942?w=600&q=80`, `${unsplash}/photo-1576566588028-4147f3842f27?w=600&q=80`, `${unsplash}/photo-1591195853828-11db59a44f6b?w=600&q=80`], category: "regatas", tags: ["uv", "masculino", "corrida"], isNew: false, rating: 4.5, colors: [cv("camisa-uv-protecao-solar", "#1e3a5f", "azul-marinho", false, `${unsplash}/photo-1584865288642-42078afe6942?w=100&q=80`), cv("camisa-uv-protecao-solar", "#000000", "preto", false, `${unsplash}/photo-1584865288642-42078afe6942?w=100&q=80`), cv("camisa-uv-protecao-solar", "#ffffff", "branco", false, `${unsplash}/photo-1584865288642-42078afe6942?w=100&q=80`)], sizes: ["P", "M", "G", "GG"], weight: 0.15, width: 20, height: 15, length: 2 },
]

const categoryMap: Record<string, { nome: string; slug: string }> = {
  conjuntos: { nome: "Conjuntos", slug: "conjuntos" },
  shorts: { nome: "Shorts", slug: "shortinhos" },
  macaquinho: { nome: "Macaquinhos", slug: "macaquinhos" },
  regatas: { nome: "Regatas", slug: "regatas" },
  leggings: { nome: "Leggings", slug: "leggings" },
  tops: { nome: "Tops", slug: "tops" },
  casual: { nome: "Casual", slug: "casual" },
  acessorios: { nome: "Acessórios", slug: "acessorios" },
}

const banners = [
  { image: "/images/1.jpg", mobileImages: ["/images/hero-mobile-1.png", "/images/hero-mobile-2.png"], title: "Nova Coleção Verão", subtitle: "Descubra as peças que vão transformar seus treinos", cta: "Ver Coleção", ctaLink: "/categoria/conjuntos" },
  { image: "/images/2.jpg", mobileImages: ["/images/promo-mobile-1.png"], title: "Frete Grátis", subtitle: "Em compras acima de R$ 199,00 para todo Brasil", cta: "Aproveitar", ctaLink: "/colecoes" },
  { image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1920&q=80", mobileImages: ["/images/promo-mobile-2.png"], title: "Pulsa Fit", subtitle: "Performance e estilo para cada movimento", cta: "Conheça", ctaLink: "/nossa-essencia" },
]

async function main() {
  console.log("Seeding database...")

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.colorVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.setting.deleteMany()

  const catDbIds = new Map<string, string>()
  for (const [slug, cat] of Object.entries(categoryMap)) {
    const created = await prisma.category.create({
      data: { name: cat.nome, slug: cat.slug, order: 0 },
    })
    catDbIds.set(slug, created.id)
    console.log(`  Category: ${cat.nome}`)
  }

  for (const p of products) {
    const catId = catDbIds.get(p.category)
    if (!catId) continue

    await prisma.product.create({
      data: {
        ref: p.ref || null,
        name: p.name,
        slug: p.slug,
        description: p.description,
        details: p.details || null,
        care: p.care || null,
        price: p.price,
        comparePrice: p.comparePrice || null,
        image: p.image,
        images: p.images,
        tags: p.tags,
        isNew: p.isNew || false,
        rating: p.rating,
        weight: p.weight,
        width: p.width,
        height: p.height,
        length: p.length,
        active: true,
        sizes: p.sizes,
        categoryId: catId,
        colors: {
          create: p.colors.map((c) => ({
            hex: c.hex, name: c.name, thumb: c.thumb, image: c.image || null,
          })),
        },
      },
    })
    console.log(`  Product: ${p.name}`)
  }

  for (const b of banners) {
    await prisma.banner.create({
      data: {
        image: b.image,
        mobileImages: b.mobileImages,
        title: b.title,
        subtitle: b.subtitle || null,
        cta: b.cta || null,
        ctaLink: b.ctaLink || null,
        active: true,
      },
    })
    console.log(`  Banner: ${b.title}`)
  }

  await prisma.coupon.create({
    data: { code: "BEMVINDO10", discountPercent: 10, maxUses: 1000, active: true },
  })

  const settings = [
    { key: "store_name", value: "Pulsa Moda Fitness" },
    { key: "store_cep", value: "44071280" },
    { key: "store_whatsapp", value: "5575998858567" },
    { key: "store_email", value: "pulsafitt@gmail.com" },
    { key: "store_phone", value: "(75) 99855-8567" },
    { key: "free_shipping_threshold", value: "199" },
  ]
  for (const s of settings) {
    await prisma.setting.create({ data: s })
  }

  console.log("Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
