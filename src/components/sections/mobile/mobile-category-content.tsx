"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/types/product"
import { MobileCategoryCard } from "./mobile-category-card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Props {
  nome: string
  produtos: Product[]
}

type SortOption =
  | "relevancia"
  | "mais-vendidos"
  | "mais-recentes"
  | "desconto"
  | "preco-maior"
  | "preco-menor"
  | "nome-a-z"
  | "nome-z-a"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "mais-recentes", label: "Mais recentes" },
  { value: "desconto", label: "Desconto" },
  { value: "preco-maior", label: "Preço: Do maior para o menor" },
  { value: "preco-menor", label: "Preço: Do menor para o maior" },
  { value: "nome-a-z", label: "Nome em ordem crescente" },
  { value: "nome-z-a", label: "Nome em ordem decrescente" },
]

function sortProducts(products: Product[], option: SortOption): Product[] {
  const sorted = [...products]
  switch (option) {
    case "relevancia":
    case "mais-vendidos":
      break
    case "mais-recentes":
      sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew))
      break
    case "desconto":
      sorted.sort((a, b) => {
        const discA = a.comparePrice ? a.comparePrice - a.price : 0
        const discB = b.comparePrice ? b.comparePrice - b.price : 0
        return discB - discA
      })
      break
    case "preco-maior":
      sorted.sort((a, b) => b.price - a.price)
      break
    case "preco-menor":
      sorted.sort((a, b) => a.price - b.price)
      break
    case "nome-a-z":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
      break
    case "nome-z-a":
      sorted.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"))
      break
  }
  return sorted
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [ref, handler])
}

export function MobileCategoryContent({ nome, produtos }: Props) {
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState<SortOption>("relevancia")
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const sortRef = useRef<HTMLDivElement>(null)

  useClickOutside(sortRef, useCallback(() => setSortOpen(false), []))

  const allSizes = useMemo(() => {
    const order = ["PP", "P", "M", "G", "GG", "XGG", "Único"]
    const set = new Set<string>()
    produtos.forEach(p => p.sizes.forEach(s => set.add(s)))
    return order.filter(s => set.has(s))
  }, [produtos])

  const filteredProducts = useMemo(() => {
    let result = [...produtos]
    if (selectedPriceRanges.length > 0) {
      result = result.filter(p =>
        selectedPriceRanges.some(r => {
          if (r === "ate-50") return p.price <= 50
          if (r === "50-100") return p.price > 50 && p.price <= 100
          if (r === "100-150") return p.price > 100 && p.price <= 150
          if (r === "acima-150") return p.price > 150
          return false
        })
      )
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p =>
        p.sizes.some(s => selectedSizes.includes(s))
      )
    }
    return result
  }, [produtos, selectedPriceRanges, selectedSizes])

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, selectedSort),
    [filteredProducts, selectedSort]
  )

  const totalFilters = selectedPriceRanges.length + selectedSizes.length
  const countLabel = sortedProducts.length === produtos.length
    ? `${sortedProducts.length} ${nome.toLowerCase()}`
    : `${sortedProducts.length} de ${produtos.length} ${nome.toLowerCase()}`

  return (
    <div className="pt-4 pb-8">
      {/* Toolbar */}
      <div className="px-4">
        <div className="flex gap-2 mb-3">
        <Sheet>
          <SheetTrigger className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white border border-[#eee] shadow-sm text-sm font-medium text-[#333] hover:border-[#d4a5a5] transition-colors">
            <Filter size={16} />
            Filtros
            {totalFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#d4a5a5] text-white text-[10px] font-bold flex items-center justify-center">
                {totalFilters}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              {totalFilters > 0 && (
                <button
                  onClick={() => { setSelectedPriceRanges([]); setSelectedSizes([]) }}
                  className="text-xs text-[#d4a5a5] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </SheetHeader>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#999] mb-3">
                  Faixa de Preço
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "ate-50", label: "Até R$ 50" },
                    { value: "50-100", label: "R$ 50 - R$ 100" },
                    { value: "100-150", label: "R$ 100 - R$ 150" },
                    { value: "acima-150", label: "Acima de R$ 150" },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() =>
                        setSelectedPriceRanges(prev =>
                          prev.includes(range.value)
                            ? prev.filter(r => r !== range.value)
                            : [...prev, range.value]
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedPriceRanges.includes(range.value)
                          ? "bg-[#d4a5a5] text-white border-[#d4a5a5]"
                          : "bg-white text-[#555] border-[#e0e0e0] hover:border-[#d4a5a5]"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.05em] text-[#999] mb-3">
                  Tamanho
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSizes(prev =>
                          prev.includes(size)
                            ? prev.filter(s => s !== size)
                            : [...prev, size]
                        )
                      }
                      className={`h-9 min-w-[44px] rounded-lg border text-xs font-medium transition-colors ${
                        selectedSizes.includes(size)
                          ? "bg-foreground text-background border-foreground"
                          : "bg-white text-[#555] border-[#e0e0e0] hover:border-[#d4a5a5]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div ref={sortRef} className="flex-1 relative">
          <button
            onClick={() => setSortOpen((prev) => !prev)}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-white border border-[#eee] shadow-sm text-sm font-medium text-[#333] hover:border-[#d4a5a5] transition-colors"
          >
            Ordenar por
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full mt-1 left-0 right-0 z-20 bg-white rounded-xl shadow-lg border border-[#eee] overflow-hidden"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedSort(opt.value)
                      setSortOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      selectedSort === opt.value
                        ? "text-[#d4a5a5] font-medium bg-[#fdf7f7]"
                        : "text-[#555] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

    {/* Counter */}
      <div className="px-4">
        <p className="text-sm text-[#666] mb-4">{countLabel}</p>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-[#999]">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sortedProducts.map((product) => (
            <MobileCategoryCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
