"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Instagram } from "@/components/ui/icons"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/contexts/toast-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    router.push("/")
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const success = login(email, password)
    if (success) {
      showToast("Login realizado com sucesso!")
      router.push("/")
    } else {
      showToast("Email ou senha inválidos.")
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex">
        {/* FORM SIDE */}
        <div className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 bg-[#fafafa]">
          <div className="w-full max-w-sm">
            {/* LOGO */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block no-underline">
                <span
                  style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px", lineHeight: 1, display: "block" }}
                >
                  PULSA
                </span>
                <span
                  style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", color: "#999", display: "block", marginTop: 2 }}
                >
                  MODA FITNESS
                </span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#f0f0f0] p-6 sm:p-8">
              <h1 className="text-lg font-semibold text-[#1a1a1a] mb-1">Entrar</h1>
              <p className="text-sm text-[#999] mb-6">Acesse sua conta Pulsa</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-[#666]">Email</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 rounded-xl border-[#e0e0e0] text-sm focus:border-[#d4a5a5] focus:ring-[#d4a5a5]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-[#666]">Senha</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-11 rounded-xl border-[#e0e0e0] text-sm focus:border-[#d4a5a5] focus:ring-[#d4a5a5]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#666] transition-colors"
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e0e0e0] text-[#d4a5a5] focus:ring-[#d4a5a5]/20 accent-[#d4a5a5]"
                    />
                    <span className="text-[#999]">Lembrar-me</span>
                  </label>
                  <button
                    type="button"
                    className="text-[#d4a5a5] hover:text-[#c49494] transition-colors font-medium"
                  >
                    Esqueci a senha
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#d4a5a5] hover:bg-[#c49494] text-white text-sm font-medium border-0 shadow-none"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              {/* DIVIDER */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#f0f0f0]" />
                <span className="text-xs text-[#bbb] uppercase tracking-[0.1em]">ou</span>
                <div className="flex-1 h-px bg-[#f0f0f0]" />
              </div>

              {/* SOCIAL */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 rounded-xl border border-[#e0e0e0] text-sm text-[#666] hover:bg-[#fafafa] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 rounded-xl border border-[#e0e0e0] text-sm text-[#666] hover:bg-[#fafafa] transition-colors"
                >
                  <Instagram size={18} />
                  Instagram
                </button>
              </div>
            </div>

            <p className="text-sm text-center text-[#999] mt-6">
              Não tem conta?{" "}
              <Link href="/cadastro" className="text-[#d4a5a5] hover:text-[#c49494] font-medium transition-colors no-underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* IMAGE SIDE - DESKTOP ONLY */}
        <div className="hidden lg:block flex-1 relative bg-[#1a1a1a]">
          <Image
            src="/images/1.jpg"
            alt="Pulsa Moda Fitness"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <p className="text-sm font-medium tracking-[0.2em] text-white/80 mb-2 uppercase">
              Performance que move você
            </p>
            <h2 className="text-3xl font-bold text-white leading-tight max-w-md">
              Sua jornada começa aqui
            </h2>
          </div>
        </div>
      </main>
      <Footer simplified />
    </>
  )
}
