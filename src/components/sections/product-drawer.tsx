"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Heart } from "lucide-react"
import { Drawer } from "vaul"
import type { Product } from "@/types/product"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/contexts/toast-context"

interface ProductDrawerProps {
  product: Product
  open: boolean
  onClose: () => void
}

export function ProductDrawer({ product, open, onClose }: ProductDrawerProps) {
  const { addItem } = useCart()
  const { toggle, isInWishlist } = useWishlist()
  const { showToast } = useToast()
  const favorited = isInWishlist(product.id)

  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])

  const color = product.colors[selectedColor]
  const currentImage = color.image ?? product.image
  const multiColor = product.colors.length > 1

  function handleAddToCart() {
    if (!selectedSize) {
      showToast("Selecione um tamanho")
      return
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: color.hex,
      quantity: 1,
    })
    showToast("Produto adicionado ao carrinho")
    onClose()
  }

  function handleToggleWishlist() {
    toggle(product.id)
  }

  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Drawer.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      <Drawer.Content className="fixed bottom-0 inset-x-0 z-50 outline-none">
        <div className="bg-white rounded-t-[28px] flex flex-col max-h-[85vh] overflow-y-auto">
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-muted-foreground/20" />
          </div>

          <div className="px-5 pb-8 space-y-5">
            <div className="relative aspect-square overflow-hidden bg-muted rounded-xl -mx-5">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <button
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm"
                aria-label={favorited ? "Remover dos favoritos" : "Favoritar"}
              >
                <Heart
                  size={18}
                  className={
                    favorited
                      ? "text-red-500 fill-red-500"
                      : "text-foreground"
                  }
                />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    R$ {product.comparePrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
            </div>

            {multiColor && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Cor: {color.name}
                </p>
                <div className="flex gap-3 justify-center">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.hex}
                      onClick={() => setSelectedColor(i)}
                      className={`w-[52px] h-[52px] rounded-full overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                        i === selectedColor
                          ? "border-foreground scale-105 shadow-md"
                          : "border-transparent"
                      }`}
                      aria-label={c.name}
                    >
                      <Image
                        src={c.thumb}
                        alt={c.name}
                        width={52}
                        height={52}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Tamanho
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-10 px-4 rounded-full text-sm font-medium border transition-all duration-200 ${
                      size === selectedSize
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white text-muted-foreground border-border hover:border-foreground/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full h-12 rounded-full bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97]"
            >
              <ShoppingBag size={16} />
              Adicionar ao Carrinho
            </button>

            <Link
              href={`/produto/${product.slug}`}
              onClick={onClose}
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Ver detalhes completos
            </Link>
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  )
}
