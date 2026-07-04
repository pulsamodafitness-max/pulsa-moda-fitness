"use client"

import { useState, useEffect } from "react"
import { Save, Settings } from "lucide-react"

interface SettingsData {
  store_name: string
  store_cep: string
  store_whatsapp: string
  store_email: string
  store_phone: string
  free_shipping_threshold: string
}

export default function AdminConfig() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [form, setForm] = useState<SettingsData>({
    store_name: "",
    store_cep: "",
    store_whatsapp: "",
    store_email: "",
    store_phone: "",
    free_shipping_threshold: "",
  })

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/settings")
      if (!res.ok) throw new Error()
      const data: { key: string; value: string }[] = await res.json()
      const obj: Record<string, string> = {}
      data.forEach((s) => { obj[s.key] = s.value })
      setForm({
        store_name: obj.store_name || "",
        store_cep: obj.store_cep || "",
        store_whatsapp: obj.store_whatsapp || "",
        store_email: obj.store_email || "",
        store_phone: obj.store_phone || "",
        free_shipping_threshold: obj.free_shipping_threshold || "",
      })
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar configurações" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    try {
      const settingsArray = Object.entries(form).map(([key, value]) => ({ key, value }))
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsArray),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Erro ao salvar configurações")
      }

      setFeedback({ type: "success", msg: "Configurações salvas com sucesso!" })
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  function updateField(field: keyof SettingsData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-[#999] text-sm">Carregando configurações...</div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Configurações</h1>
        <p className="text-sm text-[#666]">Configure as informações da loja</p>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-5">
        {/* Store Info */}
        <div>
          <h2 className="text-base font-semibold text-[#1a1a1a] mb-4">Informações da Loja</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Nome da Loja</label>
              <input
                type="text"
                value={form.store_name}
                onChange={(e) => updateField("store_name", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="Pulsa Moda Fitness"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">CEP da Loja</label>
              <input
                type="text"
                value={form.store_cep}
                onChange={(e) => updateField("store_cep", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="00000-000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">WhatsApp</label>
              <input
                type="text"
                value={form.store_whatsapp}
                onChange={(e) => updateField("store_whatsapp", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="5511999999999"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">E-mail</label>
              <input
                type="email"
                value={form.store_email}
                onChange={(e) => updateField("store_email", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="contato@pulsa.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Telefone</label>
              <input
                type="text"
                value={form.store_phone}
                onChange={(e) => updateField("store_phone", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Frete Grátis Acima de (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.free_shipping_threshold}
                onChange={(e) => updateField("free_shipping_threshold", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="199.00"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#e0e0e0]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d4a5a5] text-white rounded-xl text-sm font-medium hover:bg-[#c49494] disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </form>
    </div>
  )
}
