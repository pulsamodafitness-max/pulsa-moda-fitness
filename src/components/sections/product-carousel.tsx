"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/types/product"

interface ProductCarouselProps {
  products: Product[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / products.length))
    setCurrentIndex(Math.min(idx, products.length - 1))
  }, [products.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState, { passive: true })
    updateScrollState()
    const onResize = () => {
      if (el) {
        const w = el.clientWidth
        setItemsPerView(w < 480 ? 2 : w < 768 ? 3 : 4)
      }
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", onResize)
    }
  }, [updateScrollState])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardW = el.scrollWidth / products.length
    const target =
      dir === "left"
        ? el.scrollLeft - cardW * itemsPerView
        : el.scrollLeft + cardW * itemsPerView
    el.scrollTo({ left: target, behavior: "smooth" })
  }

  if (products.length === 0) return null

  const totalDots = Math.max(1, products.length - itemsPerView + 1)

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[calc(50%-10px)] sm:w-[calc(33.33%-13.33px)] lg:w-[calc(25%-15px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center                 opacity-60 md:opacity-0 md:group-hover/carousel:md:opacity-100 transition-opacity hover:bg-white z-10"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center                 opacity-60 md:opacity-0 md:group-hover/carousel:md:opacity-100 transition-opacity hover:bg-white z-10"
          aria-label="Próximo"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {totalDots > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: totalDots }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current
                if (!el) return
                const cardW = el.scrollWidth / products.length
                el.scrollTo({
                  left: cardW * i,
                  behavior: "smooth",
                })
              }}
              className={`h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "w-6 bg-foreground"
                  : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
