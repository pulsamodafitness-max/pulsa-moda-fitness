"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/contexts/toast-context"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(0)
  const { addItem } = useCart()
  const { toggle, isInWishlist } = useWishlist()
  const { showToast } = useToast()
  const favorited = isInWishlist(product.id)
  const color = product.colors[selectedColor]

  function handleToggleFavorite() {
    toggle(product.id)
    showToast(favorited ? "Removido dos favoritos" : "Adicionado aos favoritos!")
  }

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
      quantity,
    })
    showToast(`${product.name} adicionado ao carrinho!`)
  }

  const installmentPrice = (product.price / 6).toFixed(2).replace(".", ",")

  return (
    <div className="space-y-6">
      {product.isNew && (
        <span className="inline-block text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Novo
        </span>
      )}

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        {product.name}
      </h1>

      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.comparePrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            em até 6x de R$ {installmentPrice} sem juros
          </span>
        </div>
      </div>

      <hr className="border-[#f0f0f0]" />

      <div className="space-y-3">
        <p className="text-sm font-medium">Cor: {color.name}</p>
        <div className="flex gap-3">
          {product.colors.map((c, i) => (
            <button
              key={c.hex}
              onClick={() => setSelectedColor(i)}
              className={`relative w-[52px] h-[52px] rounded-full overflow-hidden border-2 transition-all ${
                i === selectedColor
                  ? "border-foreground scale-110 shadow-md"
                  : "border-border hover:border-muted-foreground"
              }`}
              aria-label={c.name}
            >
              <img
                src={c.thumb}
                alt={c.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <hr className="border-[#f0f0f0]" />

      <div className="space-y-3">
        <p className="text-sm font-medium">Tamanho</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-11 min-w-[56px] rounded-lg border text-sm font-medium transition-all ${
                selectedSize === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-muted-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>  
      </div>

      <hr className="border-[#f0f0f0]" />

      <div className="space-y-3">
        <p className="text-sm font-medium">Quantidade</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-11 w-11 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-medium min-w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="h-11 w-11 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={handleAddToCart}
          className="flex-1 h-12 text-sm gap-2"
        >
          <ShoppingBag size={18} />
          Adicionar ao carrinho
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={handleToggleFavorite}
        >
          <motion.span
            key={favorited ? "filled" : "empty"}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Heart size={18} className={favorited ? "fill-red-500 text-red-500" : ""} />
          </motion.span>
        </Button>
      </div>

      <hr className="border-[#f0f0f0]" />

      <p className="text-sm text-muted-foreground leading-relaxed">
        {product.description}
      </p>
    </div>
  )
}
