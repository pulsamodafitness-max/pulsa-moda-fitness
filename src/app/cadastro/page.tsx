"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/contexts/toast-context"

export default function CadastroPage() {
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    router.push("/")
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const success = register(name, email, password)
    if (success) {
      showToast("Conta criada com sucesso!")
      router.push("/")
    } else {
      showToast("Este email já está cadastrado.")
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight uppercase">
              Criar Conta
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Junte-se à Pulsa Moda Fitness
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-sm" disabled={loading}>
              {loading ? "Criando..." : "Criar Conta"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-foreground font-medium underline underline-offset-4 hover:no-underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
