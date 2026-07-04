"use client"

import { Instagram, Facebook, TikTok, YouTube } from "@/components/ui/icons"

const socials = [
  { href: "https://www.instagram.com/pulsamodafitness/", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/profile.php?id=61589262036319&locale=pt_BR", icon: Facebook, label: "Facebook" },
  { href: "https://www.tiktok.com/@pulsa.moda.fitnes", icon: TikTok, label: "TikTok" },
  { href: "https://www.youtube.com/@PulsaModaFitness", icon: YouTube, label: "YouTube" },
]

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-4">
      {socials.map((s) => {
        const Icon = s.icon
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-[#eee] flex items-center justify-center text-[#1a1a1a] hover:bg-[#d4a5a5] hover:text-white hover:scale-110 transition-all duration-300 no-underline"
            aria-label={s.label}
          >
            <Icon size={18} />
          </a>
        )
      })}
    </div>
  )
}
