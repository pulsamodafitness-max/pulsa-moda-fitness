import { ShieldCheck, Lock } from "lucide-react"

const seals = [
  { icon: Lock, label: "SSL" },
  { icon: ShieldCheck, label: "Site Seguro" },
  { icon: ShieldCheck, label: "Google Safe" },
]

export function SecurityBadges() {
  return (
    <div className="mt-6">
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a5a5] mb-4">
        Segurança
      </h4>
      <div className="flex flex-wrap gap-2">
        {seals.map((s) => {
          const Icon = s.icon
          return (
            <span
              key={s.label}
              className="inline-flex items-center gap-1.5 h-7 rounded-md border border-[#333] bg-white px-3 text-[11px] font-medium text-[#1a1a1a]"
            >
              <Icon size={12} />
              {s.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
