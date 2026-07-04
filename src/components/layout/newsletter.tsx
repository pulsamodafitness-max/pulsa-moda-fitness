"use client"

import { useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

const socials = [
  { href: "https://www.tiktok.com/@pulsa.moda.fitnes", file: "tiktok.png", label: "TikTok" },
  { href: "https://www.instagram.com/pulsamodafitness/", file: "instagram.png", label: "Instagram" },
  { href: "https://www.facebook.com/profile.php?id=61589262036319&locale=pt_BR", file: "facebook.png", label: "Facebook" },
  { href: "https://www.youtube.com/@PulsaModaFitness", file: "youtube.png", label: "YouTube" },
]

export function Newsletter() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const COUPON_KEY = "pulsa-coupon"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
    } catch {
    }

    const existing = localStorage.getItem(COUPON_KEY)
    if (!existing) {
      const code = `BEMVINDO${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      localStorage.setItem(COUPON_KEY, code)
    }

    localStorage.setItem("pulsa-newsletter-name", name.trim())
    localStorage.setItem("pulsa-newsletter-email", email.trim())
    setSubmitted(true)
  }

  return (
    <section className="bg-[#f7f7f7] border-b border-[#eee]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <CheckCircle size={40} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-2">
                Cadastro realizado com sucesso!
              </h3>
              <p className="text-sm text-[#666] max-w-md mx-auto">
                Seu cupom <strong className="text-[#d4a5a5]">{localStorage.getItem("pulsa-coupon") || "BEMVINDO10"}</strong>{" "}
                foi gerado. Use na sua primeira compra e ganhe <strong>10% OFF</strong>.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a1a1a] tracking-tight mb-3">
                Receba Nossas Novidades
              </h2>
              <p className="text-sm text-[#666] mb-8 max-w-lg mx-auto leading-relaxed">
                Cadastre-se e ganhe <strong className="text-[#d4a5a5]">10% OFF</strong> na primeira compra.
                Receba lançamentos, promoções exclusivas e ofertas da Pulsa Fit.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 h-12 rounded-xl border border-[#ddd] bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#d4a5a5] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 rounded-xl border border-[#ddd] bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#d4a5a5] transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#111] px-8 text-sm font-medium text-white hover:bg-[#333] transition-colors whitespace-nowrap tracking-wide"
                >
                  Receber ofertas
                </button>
              </form>
              <div className="flex items-center justify-center gap-3 mt-4">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center hover:bg-[#d4a5a5] hover:scale-110 transition-all duration-300"
                    aria-label={s.label}
                  >
                    <Image
                      src={`/images/social/${s.file}`}
                      alt={s.label}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
