"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export default function CarrinhoPage() {
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart()

  const freeShipping = totalPrice >= 199

  if (state.items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <p className="text-sm text-muted-foreground mb-2">Home / Carrinho</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
              Carrinho
            </h1>
            <div className="py-16 text-center">
              <ShoppingBag size={40} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground text-background px-6 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Home / Carrinho</p>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase">
                Carrinho
                <span className="text-muted-foreground font-normal text-lg ml-2">
                  ({totalItems} {totalItems === 1 ? "item" : "itens"})
                </span>
              </h1>
              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpar carrinho
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-border last:border-0"
                >
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.size}
                        </p>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap ml-4">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 border border-border rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-6 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")} cada
                    </p>
                  </div>
                </div>
              ))}

              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
              >
                <ArrowLeft size={14} />
                Continuar Comprando
              </Link>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-muted/30 rounded-lg p-6 border border-border space-y-4">
                <h2 className="text-lg font-semibold">Resumo</h2>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span
                    className={
                      freeShipping
                        ? "text-green-600 font-medium text-xs"
                        : "text-muted-foreground text-xs"
                    }
                  >
                    {freeShipping ? "Grátis" : "Calculado no checkout"}
                  </span>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-foreground text-sm font-medium text-background hover:opacity-90 transition-opacity"
                >
                  Finalizar Pedido
                </Link>

                <Link
                  href="/"
                  className="flex h-12 w-full items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
