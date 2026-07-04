"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push("/admin")
      } else {
        setError("Senha inválida")
      }
    } catch {
      setError("Erro ao conectar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#e0e0e0] p-8 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#d4a5a5]/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-[#d4a5a5]" />
          </div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Admin Pulsa</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse o painel administrativo</p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg py-2">{error}</p>
        )}

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-[#1a1a1a]">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
            autoFocus
            className="w-full h-11 rounded-xl border border-[#ddd] bg-white px-4 text-sm focus:outline-none focus:border-[#d4a5a5] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full h-11 rounded-xl bg-[#1a1a1a] text-white text-sm font-medium disabled:opacity-50 hover:bg-[#333] transition-colors"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
