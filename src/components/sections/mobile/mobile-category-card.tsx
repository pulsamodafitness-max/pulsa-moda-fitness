"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/types/product"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"
import { CameraRotate } from "@/components/ui/icons"

interface Props {
  product: Product
}

export function MobileCategoryCard({ product }: Props) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [imgIndex, setImgIndex] = useState(0)
  const images = product.images.length > 0 ? product.images : [product.image]
  const totalImgs = images.length

  const advanceImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex((prev) => (prev + 1) % totalImgs)
  }, [totalImgs])

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const color = product.colors[0]
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[0],
      color: color.hex,
      quantity: 1,
    })
    showToast("Adicionado ao carrinho")
  }, [product, addItem, showToast])

  const pixPrice = product.price * 0.9
  const installment = product.price / 4

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Link href={`/produto/${product.slug}`} className="block w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={images[imgIndex]}
                alt={product.name}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </Link>

        <button
          onClick={advanceImage}
          className="absolute bottom-2 left-2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm z-10 active:scale-90 transition-transform"
          aria-label="Trocar imagem"
        >
          <CameraRotate size={16} className="text-[#555]" />
        </button>

        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-foreground flex items-center justify-center shadow-lg z-10 active:scale-90 transition-transform"
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingBag size={18} className="text-white" />
        </button>
      </div>

      <div className="mt-2 space-y-1 px-0.5">
        <h3 className="text-sm text-[#333] font-normal leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="space-y-0.5">
          <p className="text-base font-semibold text-[#1a1a1a] tracking-tight">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xs text-[#22c55e] font-medium">
            R$ {pixPrice.toFixed(2).replace(".", ",")} no Pix
          </p>
          <p className="text-xs text-[#666]">
            ou até 4x de R$ {installment.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>
    </div>
  )
}
