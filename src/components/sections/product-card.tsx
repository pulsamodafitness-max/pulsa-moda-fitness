"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"
import dynamic from "next/dynamic"

const ProductDrawer = dynamic(
  () => import("./product-drawer").then((m) => m.ProductDrawer),
  { ssr: false }
)

interface ProductCardProps {
  product: Product
  priority?: boolean
}

const containerVariants = {
  hidden: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggle, isInWishlist } = useWishlist()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const favorited = isInWishlist(product.id)

  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0])

  const color = product.colors[selectedColor]
  const currentImage = color.image ?? product.image
  const multiColor = product.colors.length > 1

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
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
    },
    [product, selectedSize, color, addItem, showToast]
  )

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) {
        e.preventDefault()
        setDrawerOpen(true)
      }
    },
    [isMobile]
  )

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggle(product.id)
    },
    [product.id, toggle]
  )

  return (
    <div
      className="group/card"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      <Link
        href={`/produto/${product.slug}`}
        onClick={handleCardClick}
        className="block"
      >
        <div className="relative aspect-[9/16] overflow-hidden bg-muted rounded-lg">
          <motion.div
            className="relative w-full h-full"
            animate={hovered ? { y: -10, scale: 1.03 } : { y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  priority={priority}
                />
              </motion.div>
            </AnimatePresence>

            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
              />
            )}
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {product.isNew && (
            <Badge className="absolute top-3 left-3 bg-white text-foreground border-0 text-[11px] font-medium px-2.5 py-1">
              NOVO
            </Badge>
          )}

          {product.comparePrice && (
            <Badge className="absolute top-3 right-12 bg-foreground text-background border-0 text-[11px] font-medium px-2.5 py-1">
              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
            </Badge>
          )}

          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-3 z-10"
            aria-label={favorited ? "Remover dos favoritos" : "Favoritar"}
          >
            <Heart
              size={18}
              className={
                favorited
                  ? "text-red-500 fill-red-500 drop-shadow-sm"
                  : "text-white drop-shadow-sm"
              }
            />
          </button>

          <motion.div
            className="absolute bottom-0 inset-x-0 bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
            initial={{ y: "100%" }}
            animate={{ y: hovered ? 0 : "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="p-3 space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate={hovered ? "show" : "hidden"}
            >
              {multiColor && (
                <motion.div variants={itemVariants} className="flex gap-2 justify-center">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.hex}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedColor(i)
                      }}
                      className={`w-[52px] h-[52px] rounded-full overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                        i === selectedColor
                          ? "border-foreground scale-105 shadow-md"
                          : "border-transparent hover:scale-105"
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
                  <div className="text-[11px] text-muted-foreground self-center ml-1 leading-tight">
                    {color.name}
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5 justify-center">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedSize(size)
                    }}
                    className={`min-w-[44px] h-11 px-3 rounded-full text-xs font-medium border transition-all duration-200 ${
                      size === selectedSize
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={handleAddToCart}
                  className="w-full h-12 rounded-full bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.97]"
                >
                  <ShoppingBag size={16} />
                  Adicionar ao Carrinho
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Link>

      <div className="mt-3 space-y-1.5 px-0.5">
        <p className="text-[11px] text-[#999] tracking-[0.08em]">
          REF: V{product.id.padStart(4, "0")} em {color.name}
        </p>
        <h3 className="text-sm text-[#444] font-normal leading-relaxed">
          {product.name}
        </h3>
        <div className="mt-2 space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-[#1a1a1a] tracking-tight">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-[#999] line-through">
                R$ {product.comparePrice.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
          <p className="text-xs text-[#999]">via pix</p>
          <p className="text-xs text-[#444]">
            ou até 4x de R$ {(product.price / 4).toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>

      <ProductDrawer
        product={product}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
