"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Facebook, TikTok, YouTube } from "@/components/ui/icons"

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
}

const accountLinks = [
  { label: "Minha conta", href: "/login" },
  { label: "Meus pedidos", href: "/carrinho" },
  { label: "Atendimento", href: "/contato" },
]

const socials = [
  { href: "https://www.instagram.com/pulsamodafitness/", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/profile.php?id=61589262036319&locale=pt_BR", icon: Facebook, label: "Facebook" },
  { href: "https://www.tiktok.com/@pulsa.moda.fitnes", icon: TikTok, label: "TikTok" },
  { href: "https://www.youtube.com/@PulsaModaFitness", icon: YouTube, label: "YouTube" },
]

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [categorias, setCategorias] = useState<{ label: string; href: string }[]>([])

  useEffect(() => {
    if (!open) return
    fetch("/api/categorias")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategorias(
            data.map((c: { slug: string; name: string }) => ({
              label: c.name,
              href: `/categoria/${c.slug}`,
            }))
          )
        }
      })
      .catch(() => {})
  }, [open])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      drawerRef.current?.focus()
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, handleKeyDown])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            tabIndex={-1}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-[#f0f0f0] shrink-0">
              <span className="text-sm font-semibold tracking-[0.1em] text-[#1a1a1a]">MENU</span>
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* PRODUTOS */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-1">
                {categorias.length > 0 ? categorias.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="block py-3 text-sm font-medium text-[#1a1a1a] hover:text-[#d4a5a5] transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                )) : (
                  <p className="py-3 text-sm text-[#999]">Carregando...</p>
                )}
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-[#f0f0f0] my-4" />

              {/* CONTA */}
              <div className="space-y-1">
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="block py-3 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* SOCIAL */}
            <div className="shrink-0 px-5 py-5 border-t border-[#f0f0f0]">
              <div className="flex items-center gap-4 justify-center">
                {socials.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#666] hover:bg-[#d4a5a5] hover:text-white transition-all duration-300 hover:scale-110"
                      aria-label={s.label}
                    >
                      <Icon size={16} />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
