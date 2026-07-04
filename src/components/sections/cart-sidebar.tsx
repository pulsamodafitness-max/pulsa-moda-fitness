"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export function CartSidebar() {
  const {
    state,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart()

  const freeShipping = totalPrice >= 199

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Carrinho
            {totalItems > 0 && (
              <span className="text-muted-foreground font-normal">
                {" "}
                ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingBag size={40} className="text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio</p>
            <Link
              href="/"
              onClick={closeCart}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors mt-4"
            >
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-4 border-b border-border last:border-0"
              >
                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.size} /{" "}
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full align-middle"
                      style={{ backgroundColor: item.color }}
                    />
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm min-w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {state.items.length > 0 && (
          <SheetFooter className="border-t border-border px-4 py-4">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
              {freeShipping ? (
                <p className="text-xs text-green-600 font-medium">
                  Frete grátis concedido!
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Frete calculado no checkout
                </p>
              )}
              <Link
                href="/carrinho"
                onClick={closeCart}
                className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver carrinho completo
              </Link>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-foreground text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                Finalizar Pedido
              </Link>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 text-sm"
                  onClick={closeCart}
                >
                  Continuar Comprando
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 px-3 text-sm text-muted-foreground"
                  onClick={clearCart}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
