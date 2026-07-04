"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Ticket, Edit3 } from "lucide-react"

interface Coupon {
  id: string
  code: string
  discountPercent: number
  maxUses: number
  usedCount: number
  expiresAt: string
  active: boolean
}

const emptyForm = {
  code: "",
  discountPercent: "",
  maxUses: "",
  expiresAt: "",
  active: true,
}

export default function AdminCupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  async function fetchCoupons() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/cupons")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCoupons(data)
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar cupons" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  function startEdit(coupon: Coupon) {
    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent.toString(),
      maxUses: coupon.maxUses?.toString() || "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
      active: coupon.active,
    })
    setEditingId(coupon.id)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code || !form.discountPercent) {
      setFeedback({ type: "error", msg: "Preencha código e percentual de desconto" })
      return
    }

    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        code: form.code.trim().toUpperCase(),
        discountPercent: parseFloat(form.discountPercent),
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : 0,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        active: form.active,
      }

      if (editingId) {
        body.id = editingId
      }

      const res = await fetch("/api/admin/cupons", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Erro ao salvar cupom")
      }

      resetForm()
      setFeedback({ type: "success", msg: editingId ? "Cupom atualizado" : "Cupom criado com sucesso" })
      fetchCoupons()
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/cupons?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setFeedback({ type: "success", msg: "Cupom deletado" })
      setDeleteId(null)
      fetchCoupons()
    } catch {
      setFeedback({ type: "error", msg: "Erro ao deletar cupom" })
    }
  }

  async function toggleActive(coupon: Coupon) {
    try {
      const res = await fetch("/api/admin/cupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
      })
      if (!res.ok) throw new Error()
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c))
      )
    } catch {
      setFeedback({ type: "error", msg: "Erro ao atualizar cupom" })
    }
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("pt-BR")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Cupons</h1>
        <p className="text-sm text-[#666]">Gerencie os cupons de desconto</p>
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

      {/* Add form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1a1a1a]">
            {editingId ? "Editar Cupom" : "Novo Cupom"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">
              Cancelar edição
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5] uppercase"
              placeholder="PROMO10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">
              Desconto % <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.discountPercent}
              onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Usos máximos</label>
            <input
              type="number"
              min="1"
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              placeholder="100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Expira em</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
            />
          </div>

          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 cursor-pointer pb-2.5">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 rounded border-[#e0e0e0] text-[#d4a5a5] focus:ring-[#d4a5a5]/30"
              />
              <span className="text-sm font-medium text-[#1a1a1a]">Ativo</span>
            </label>
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
      </form>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-[#999] text-sm">Carregando...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-[#999]">
          <Ticket size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhum cupom cadastrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#f7f7f7]">
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Código
                </th>
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Desconto
                </th>
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Usos
                </th>
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Expira
                </th>
                <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Ativo
                </th>
                <th className="text-right text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0]">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#f7f7f7] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono font-semibold text-[#1a1a1a]">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[#d4a5a5]">
                    {coupon.discountPercent}%
                  </td>
                  <td className="px-5 py-4 text-sm text-[#666]">
                    {coupon.usedCount ?? 0}
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#666]">
                    {formatDate(coupon.expiresAt)}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(coupon)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        coupon.active ? "bg-green-400" : "bg-[#ccc]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          coupon.active ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(coupon)}
                        className="p-2 rounded-lg text-[#666] hover:bg-[#f0f0f0] transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(coupon.id)}
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
            <p className="text-sm text-[#666] mb-5">Tem certeza que deseja deletar este cupom?</p>
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
