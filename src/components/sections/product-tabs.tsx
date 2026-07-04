"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface ProductTabsProps {
  product: Product
}

const tabs = ["Descrição", "Detalhes", "Cuidados"]

export function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState(0)

  const content = [product.description, product.details || "", product.care || ""]

  return (
    <div className="border-t border-border pt-8 mt-8">
      <div className="flex gap-6 border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              active === i
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {active === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>
      <div className="py-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content[active]}
        </p>
      </div>
    </div>
  )
}
