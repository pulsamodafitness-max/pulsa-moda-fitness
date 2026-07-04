"use client"

import { useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/cart-context"

interface MiniCartProps {
  open: boolean
  onClose: () => void
}

export function MiniCart({ open, onClose }: MiniCartProps) {
  const { state, removeItem, updateQuantity, totalItems, totalPrice } = useCart()
  const freeShipping = totalPrice >= 199

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-[#f0f0f0] shrink-0">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                Carrinho
                {totalItems > 0 && (
                  <span className="text-[#999] font-normal ml-1">
                    ({totalItems})
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors"
                aria-label="Fechar carrinho"
              >
                <X size={20} />
              </button>
            </div>

            {/* ITEMS */}
            {state.items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <ShoppingBag size={40} className="text-[#ccc] mb-4" />
                <p className="text-sm text-[#999] mb-4">Seu carrinho está vazio</p>
                <button
                  onClick={onClose}
                  className="h-11 rounded-xl bg-[#1a1a1a] text-white px-6 text-sm font-medium hover:bg-[#333] transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 py-3 border-b border-[#f5f5f5] last:border-0"
                  >
                    <div className="w-16 h-20 rounded-md bg-muted relative shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#444] truncate">{item.name}</p>
                      <p className="text-xs text-[#999] mt-0.5">
                        {item.size}
                      </p>
                      <p className="text-sm font-semibold text-[#1a1a1a] mt-1">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-[#e0e0e0] flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-[#e0e0e0] flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto w-8 h-8 flex items-center justify-center text-[#ccc] hover:text-red-500 transition-colors"
                          aria-label="Remover item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FOOTER */}
            {state.items.length > 0 && (
              <div className="shrink-0 border-t border-[#f0f0f0] px-5 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#999]">Subtotal</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                {freeShipping ? (
                  <p className="text-xs text-green-600 font-medium">
                    Frete grátis concedido!
                  </p>
                ) : (
                  <p className="text-xs text-[#999]">
                    Frete calculado no checkout
                  </p>
                )}
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1a1a1a] text-sm font-medium text-white hover:bg-[#333] transition-colors no-underline"
                >
                  Finalizar Compra
                </Link>
                <Link
                  href="/carrinho"
                  onClick={onClose}
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-[#e0e0e0] text-sm font-medium text-[#666] hover:bg-[#f5f5f5] transition-colors no-underline"
                >
                  Ver Carrinho
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
