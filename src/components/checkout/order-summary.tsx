"use client"

import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2 } from "lucide-react"

interface OrderSummaryProps {
  shipping?: number
}

export function OrderSummary({ shipping = 0 }: OrderSummaryProps) {
  const { state, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  const freeShipping = totalPrice >= 199
  const shippingCost = freeShipping ? 0 : shipping
  const finalTotal = totalPrice + shippingCost

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Resumo do Pedido</h2>

      <div className="space-y-4">
        {state.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 pb-4 border-b border-border last:border-0"
          >
            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted relative">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.size && `${item.size} / `}
                {item.color && (
                  <span
                    className="inline-block h-2 w-2 rounded-full align-middle"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </p>
              <p className="text-sm font-semibold mt-0.5">
                R$ {item.price.toFixed(2).replace(".", ",")}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-auto p-0.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Itens ({totalItems})
          </span>
          <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Frete</span>
          <span className={freeShipping ? "text-green-600 font-medium" : ""}>
            {freeShipping ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
          <span>Total</span>
          <span>R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>
    </div>
  )
}
