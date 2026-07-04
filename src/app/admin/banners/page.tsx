"use client"

import { useState, useEffect } from "react"
import { Plus, Edit3, Trash2, Image as ImageIcon } from "lucide-react"
import ImageUpload from "@/components/admin/ImageUpload"

interface Banner {
  id: string
  image: string
  mobileImages: string[]
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  active: boolean
  order: number
  createdAt: string
}

const emptyForm = {
  image: "",
  mobileImages: "",
  title: "",
  subtitle: "",
  cta: "",
  ctaLink: "",
  active: true,
  order: "",
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  async function fetchBanners() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/banners")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBanners(data)
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar banners" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  function startEdit(banner: Banner) {
    setForm({
      image: banner.image || "",
      mobileImages: (banner.mobileImages || []).join(", "),
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      cta: banner.cta || "",
      ctaLink: banner.ctaLink || "",
      active: banner.active ?? true,
      order: banner.order?.toString() || "",
    })
    setEditingId(banner.id)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image || !form.title) {
      setFeedback({ type: "error", msg: "Preencha URL da imagem e título" })
      return
    }

    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        image: form.image,
        mobileImages: form.mobileImages
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean),
        title: form.title,
        subtitle: form.subtitle,
        cta: form.cta,
        ctaLink: form.ctaLink,
        active: form.active,
        order: form.order ? parseInt(form.order, 10) : 0,
      }

      if (editingId) {
        body.id = editingId
      }

      const url = "/api/admin/banners"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Erro ao salvar banner")
      }

      setFeedback({
        type: "success",
        msg: editingId ? "Banner atualizado" : "Banner criado com sucesso",
      })
      resetForm()
      fetchBanners()
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setFeedback({ type: "success", msg: "Banner deletado" })
      setDeleteId(null)
      fetchBanners()
    } catch {
      setFeedback({ type: "error", msg: "Erro ao deletar banner" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Banners</h1>
        <p className="text-sm text-[#666]">Gerencie os banners da página inicial</p>
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1a1a1a]">
            {editingId ? "Editar Banner" : "Novo Banner"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
            >
              Cancelar edição
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="banners"
            label="URL da Imagem"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">URLs Mobile (separadas por vírgula)</label>
            <input
              type="text"
              value={form.mobileImages}
              onChange={(e) => setForm({ ...form, mobileImages: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="https://... , https://..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="Título do banner"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Subtítulo</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="Subtítulo"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">CTA</label>
            <input
              type="text"
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="Ver Coleção"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Link do CTA</label>
            <input
              type="text"
              value={form.ctaLink}
              onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="/colecao"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Ordem</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <label className="text-sm font-medium text-[#1a1a1a]">Ativo</label>
            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.active ? "bg-green-500" : "bg-[#ccc]"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#d4a5a5] text-white rounded-xl text-sm font-medium hover:bg-[#c49494] disabled:opacity-50 transition-colors"
          >
            <Plus size={18} />
            {saving ? "Salvando..." : editingId ? "Atualizar Banner" : "Adicionar Banner"}
          </button>
        </div>
      </form>

      {/* Banner list */}
      {loading ? (
        <div className="text-center py-12 text-[#999] text-sm">Carregando...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 text-[#999]">
          <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhum banner cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden"
            >
              <div className="aspect-[2/1] bg-[#f7f7f7] relative">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                    <ImageIcon size={32} />
                  </div>
                )}
                {banner.mobileImages?.length > 0 && (
                  <span className="absolute top-2 right-2 bg-white/90 text-[10px] px-2 py-0.5 rounded-full text-[#666]">
                    +{banner.mobileImages.length} mobile
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium text-[#1a1a1a]">{banner.title}</h3>
                      {banner.subtitle && (
                        <p className="text-xs text-[#666]">{banner.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          banner.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {banner.active ? "Ativo" : "Inativo"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#f0f0f0] text-[#666] rounded-full">
                        #{banner.order}
                      </span>
                    </div>
                  </div>
                {banner.cta && (
                  <p className="text-xs text-[#d4a5a5]">
                    CTA: {banner.cta} {banner.ctaLink && `→ ${banner.ctaLink}`}
                  </p>
                )}
                <div className="flex gap-2 pt-2 border-t border-[#f0f0f0]">
                  <button
                    onClick={() => startEdit(banner)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-[#e0e0e0] rounded-xl text-[#666] hover:bg-[#f7f7f7] transition-colors"
                  >
                    <Edit3 size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteId(banner.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-[#666] mb-5">Tem certeza que deseja deletar este banner?</p>
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
