"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { WhatsApp } from "@/components/ui/icons"

export function WhatsAppButton() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pathname.startsWith("/admin")) return null

  return (
    <a
      href="https://wa.me/5575998558567"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="WhatsApp"
    >
      <WhatsApp size={24} />
    </a>
  )
}
