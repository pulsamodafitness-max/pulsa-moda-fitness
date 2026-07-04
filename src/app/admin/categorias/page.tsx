"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Tags, Edit3 } from "lucide-react"
import ImageUpload from "@/components/admin/ImageUpload"

interface Category {
  id: string
  name: string
  slug: string
  image?: string
  icon?: string
  order: number
  _count?: { products: number }
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [image, setImage] = useState("")
  const [icon, setIcon] = useState("")
  const [order, setOrder] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  async function fetchCategories() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/categorias")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCategories(data)
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar categorias" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function resetForm() {
    setName("")
    setSlug("")
    setImage("")
    setIcon("")
    setOrder("")
    setEditingId(null)
  }

  function startEdit(cat: Category) {
    setName(cat.name)
    setSlug(cat.slug)
    setImage(cat.image || "")
    setIcon(cat.icon || "")
    setOrder(cat.order?.toString() || "")
    setEditingId(cat.id)
  }

  function handleNameChange(val: string) {
    setName(val)
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      setFeedback({ type: "error", msg: "Preencha nome e slug" })
      return
    }
    setSaving(true)
    try {
      const body = {
        name: name.trim(),
        slug: slug.trim(),
        image: image.trim() || null,
        icon: icon.trim() || null,
        order: order ? parseInt(order, 10) : 0,
      }

      let res: Response
      if (editingId) {
        res = await fetch("/api/admin/categorias", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        })
      } else {
        res = await fetch("/api/admin/categorias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Erro ao salvar categoria")
      }
      resetForm()
      setFeedback({ type: "success", msg: editingId ? "Categoria atualizada" : "Categoria criada" })
      fetchCategories()
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/categorias?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Erro ao deletar")
      }
      setFeedback({ type: "success", msg: "Categoria deletada" })
      setDeleteId(null)
      fetchCategories()
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Categorias</h1>
        <p className="text-sm text-[#666]">Gerencie as categorias de produtos</p>
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

      {/* Add/Edit form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1a1a1a]">
            {editingId ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">
              Cancelar edição
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs text-[#666]">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="Nome da categoria"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-xs text-[#666]">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="nome-da-categoria"
            />
          </div>
          <div className="w-24 space-y-1.5">
            <label className="text-xs text-[#666]">Ordem</label>
            <input
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="0"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-xs text-[#666]">Ícone (URL)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="https://..."
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#d4a5a5] text-white rounded-xl text-sm font-medium hover:bg-[#c49494] disabled:opacity-50 transition-colors"
            >
              <Plus size={18} />
              {saving ? "Salvando..." : editingId ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </div>
        <ImageUpload
          value={image}
          onChange={setImage}
          folder="categorias"
          label="Imagem da Categoria"
        />
      </form>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-[#999] text-sm">Carregando...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-[#999]">
          <Tags size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhuma categoria cadastrada</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#f7f7f7]">
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Nome
                </th>
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Slug
                </th>
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Produtos
                </th>
                <th className="text-right text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#f7f7f7] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-[#1a1a1a]">{cat.name}</td>
                  <td className="px-5 py-4 text-sm text-[#666]">{cat.slug}</td>
                  <td className="px-5 py-4 text-sm text-[#666]">{cat._count?.products ?? "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 rounded-lg text-[#666] hover:bg-[#f0f0f0] transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
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
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-[#666] mb-5">
              Tem certeza que deseja deletar esta categoria?
            </p>
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
