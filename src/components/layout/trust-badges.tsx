"use client"

import { Truck, RotateCcw, ShieldCheck, Zap } from "lucide-react"

const badges = [
  { icon: Truck, label: "Entrega para todo Brasil" },
  { icon: RotateCcw, label: "Troca fácil" },
  { icon: ShieldCheck, label: "Compra 100% segura" },
  { icon: Zap, label: "Pix com desconto" },
]

export function TrustBadges() {
  return (
    <section className="bg-[#f7f7f7] border-b border-[#eee]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {badges.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.label} className="flex flex-col items-center text-center gap-2">
                <Icon size={22} className="text-[#d4a5a5]" />
                <span className="text-xs sm:text-sm font-medium text-[#555]">
                  {b.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
