"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { X, Search, Clock, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { RecentSearch } from "@/types/navbar"
import type { Product } from "@/types/product"

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

const popularCategories = [
  { label: "Conjuntos", slug: "conjuntos" },
  { label: "Leggings", slug: "leggings" },
  { label: "Shorts", slug: "shortinhos" },
  { label: "Tops", slug: "tops" },
  { label: "Macaquinhos", slug: "macaquinhos" },
  { label: "Promoções", slug: "promocoes" },
]

const STORAGE_KEY = "pulsa-recent-searches"

function loadRecent(): RecentSearch[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveRecent(term: string) {
  try {
    const existing = loadRecent().filter((s) => s.term !== term)
    const updated = [{ term, timestamp: Date.now() }, ...existing].slice(0, 5)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {}
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    if (open) {
      setQuery("")
      setRecentSearches(loadRecent())
      fetch("/api/produtos?limit=4")
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setFeatured(data) })
        .catch(() => {})
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, handleKeyDown])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    saveRecent(q)
    onClose()
    router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  function handleRecentClick(term: string) {
    setQuery("")
    onClose()
    router.push(`/busca?q=${encodeURIComponent(term)}`)
  }

  function clearRecent() {
    localStorage.removeItem(STORAGE_KEY)
    setRecentSearches([])
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Pesquisar"
        >
          {/* SEARCH BAR */}
          <div className="flex items-center gap-3 px-4 h-16 border-b border-[#f0f0f0] shrink-0">
            <form onSubmit={handleSubmit} className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="O que você procura?"
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#f5f5f5] text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#d4a5a5] transition-all"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
            </form>
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors shrink-0"
              aria-label="Fechar pesquisa"
            >
              <X size={22} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
            {/* RECENT SEARCHES */}
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#999] flex items-center gap-2">
                    <Clock size={14} /> Pesquisas recentes
                  </h3>
                  <button
                    onClick={clearRecent}
                    className="text-xs text-[#d4a5a5] hover:text-[#c49494] transition-colors"
                  >
                    Limpar
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s.timestamp}
                      onClick={() => handleRecentClick(s.term)}
                      className="block w-full text-left text-sm text-[#666] hover:text-[#1a1a1a] transition-colors py-1.5"
                    >
                      {s.term}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* POPULAR CATEGORIES */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#999] mb-3 flex items-center gap-2">
                <TrendingUp size={14} /> Categorias populares
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    onClick={onClose}
                    className="inline-flex h-9 items-center rounded-full border border-[#e0e0e0] px-4 text-xs font-medium text-[#666] hover:border-[#d4a5a5] hover:text-[#d4a5a5] transition-colors no-underline"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#999] mb-3">
                Produtos em destaque
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {featured.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produto/${p.slug}`}
                    onClick={onClose}
                    className="flex gap-3 items-center rounded-lg border border-[#f0f0f0] p-2 hover:border-[#e0e0e0] transition-colors no-underline"
                  >
                    <div className="w-14 h-14 rounded-md bg-muted relative shrink-0 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#444] truncate">{p.name}</p>
                      <p className="text-xs font-semibold text-[#1a1a1a] mt-0.5">
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
