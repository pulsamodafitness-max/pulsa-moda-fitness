"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronUp, Package } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  categoryId: string
  category?: Category
  active: boolean
  images: string[]
  ref: string
}

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function fetchProducts() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (categoryFilter) params.set("categoryId", categoryFilter)
      const res = await fetch(`/api/admin/produtos?${params.toString()}`)
      if (!res.ok) throw new Error("Erro ao carregar produtos")
      const data = await res.json()
      setProducts(data)
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar produtos" })
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categorias")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, categoryFilter])

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/produtos/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Erro ao deletar")
      }
      setFeedback({ type: "success", msg: "Produto deletado com sucesso" })
      setDeleteId(null)
      fetchProducts()
    } catch (e) {
      setFeedback({ type: "error", msg: e instanceof Error ? e.message : "Erro ao deletar produto" })
    }
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ref?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || p.categoryId === categoryFilter
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Produtos</h1>
          <p className="text-sm text-[#666]">Gerencie seu catálogo de produtos</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d4a5a5] text-white rounded-xl text-sm font-medium hover:bg-[#c49494] transition-colors"
        >
          <Plus size={18} />
          Novo Produto
        </Link>
      </div>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.msg}
          <button onClick={() => setFeedback(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#999] text-sm">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[#999]">
          <Package size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhum produto encontrado</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-[#e0e0e0] p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-[#f7f7f7] flex-shrink-0 overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a1a1a] truncate">{product.name}</p>
                    <p className="text-xs text-[#999]">{product.ref}</p>
                    <p className="text-sm font-semibold text-[#d4a5a5] mt-1">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {product.category && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#f0f0f0] text-[#666] rounded-full">
                          {product.category.name}
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          product.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#f0f0f0]">
                  <Link
                    href={`/admin/produtos/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-[#e0e0e0] rounded-xl text-[#666] hover:bg-[#f7f7f7] transition-colors"
                  >
                    <Edit size={14} />
                    Editar
                  </Link>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e0e0] bg-[#f7f7f7]">
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Produto
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Ref
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Categoria
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Preço
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f7f7f7] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f7f7f7] flex-shrink-0 overflow-hidden">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-[#1a1a1a]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666]">{product.ref || "—"}</td>
                    <td className="px-5 py-4 text-sm text-[#666]">{product.category?.name || "—"}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#1a1a1a]">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                          product.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="p-2 rounded-lg text-[#666] hover:bg-[#f0f0f0] transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-[#666] mb-5">Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-[#e0e0e0] rounded-xl text-[#666] hover:bg-[#f7f7f7] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
