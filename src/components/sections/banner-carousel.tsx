"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { BannerData } from "@/types/product"

interface BannerCarouselProps {
  banners: BannerData[]
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / banners.length))
    setCurrentIndex(Math.min(idx, banners.length - 1))
  }, [banners.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [updateScrollState])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardW = el.scrollWidth / banners.length
    const target = dir === "left" ? el.scrollLeft - cardW : el.scrollLeft + cardW
    el.scrollTo({ left: target, behavior: "smooth" })
  }

  if (banners.length === 0) return null

  return (
    <div className="relative group/carousel w-full">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {banners.map((banner) => {
          const content = (
            <>
              <Image
                src={banner.image}
                alt={banner.title || ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover/banner:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {banner.title && (
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  {banner.title}
                </h3>
              </div>
              )}
            </>
          )

          if (banner.ctaLink) {
            return (
              <Link
                key={banner.id}
                href={banner.ctaLink}
                className="snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-muted group/banner"
              >
                {content}
              </Link>
            )
          }

          return (
            <div
              key={banner.id}
              className="snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-muted group/banner"
            >
              {content}
            </div>
          )
        })}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-60 md:opacity-0 md:group-hover/carousel:md:opacity-100 transition-opacity hover:bg-white z-10"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-60 md:opacity-0 md:group-hover/carousel:md:opacity-100 transition-opacity hover:bg-white z-10"
          aria-label="Próximo"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current
                if (!el) return
                const cardW = el.scrollWidth / banners.length
                el.scrollTo({ left: cardW * i, behavior: "smooth" })
              }}
              className={`h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "w-6 bg-foreground"
                  : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Ir para banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
