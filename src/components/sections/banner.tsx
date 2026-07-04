"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { BannerData } from "@/types/product"

interface BannerProps {
  data: BannerData
  size?: "hero" | "promo" | "default"
}

export function Banner({ data, size = "default" }: BannerProps) {
  const isHero = size === "hero"
  const hasCarousel = isHero && data.mobileImages && data.mobileImages.length >= 2
  const [mobileIndex, setMobileIndex] = useState(0)

  const nextSlide = useCallback(() => {
    if (!data.mobileImages) return
    setMobileIndex((prev) => (prev + 1) % data.mobileImages!.length)
  }, [data.mobileImages])

  useEffect(() => {
    if (!hasCarousel) return
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [hasCarousel, nextSlide])

  return (
    <section className="relative overflow-hidden">
      <div
        className={cn(
          "relative w-full mx-auto max-w-[1920px]",
          isHero
            ? "h-[70vh] min-h-[350px] sm:min-h-[500px] max-h-[800px]"
            : size === "promo"
              ? "h-[65vh] min-h-[300px] sm:min-h-[450px] max-h-[750px]"
              : "h-[40vh] min-h-[250px] sm:min-h-[300px] max-h-[500px]"
        )}
      >
        {/* DESKTOP IMAGE */}
        <Image
          src={data.image}
          alt={data.title}
          fill
          sizes="100vw"
          className="object-cover hidden lg:block"
          priority={isHero}
        />

        {/* MOBILE IMAGES */}
        {data.mobileImages && data.mobileImages.length > 0 && (
          <Link href={data.ctaLink || "#"} className="block lg:hidden w-full h-full relative">
            {data.mobileImages.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={data.title}
                fill
                sizes="100vw"
                className={cn(
                  "object-contain transition-opacity duration-500",
                  i === mobileIndex ? "opacity-100" : "opacity-0"
                )}
                priority={isHero && i === 0}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-16">
              {data.subtitle && (
                <p className="text-white/80 text-[10px] font-medium tracking-[0.15em] mb-1 uppercase">
                  {data.subtitle}
                </p>
              )}
              {data.title && (
                <h2 className="text-white font-bold text-xl leading-tight mb-3">
                  {data.title}
                </h2>
              )}
              {data.cta && (
                <span className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-6 text-sm font-medium text-black">
                  {data.cta}
                </span>
              )}
            </div>
          </Link>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent hidden lg:block" />

        {/* CAROUSEL DOTS (mobile hero only) */}
        {hasCarousel && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 lg:hidden">
            {data.mobileImages!.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === mobileIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "absolute inset-0 flex-col justify-center hidden lg:flex",
            isHero ? "px-6 sm:px-12 lg:px-16" : "px-6 sm:px-12"
          )}
        >
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-white/80 mb-2 uppercase">
            {data.subtitle}
          </p>
          <h2
            className={cn(
              "font-bold text-white leading-tight",
              isHero
                ? "text-4xl sm:text-5xl lg:text-7xl max-w-2xl"
                : "text-3xl sm:text-4xl lg:text-5xl max-w-xl"
            )}
          >
            {data.title}
          </h2>
          {data.cta && (
            <div className="mt-6">
              <Link
                href={data.ctaLink || "#"}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-black hover:bg-white/90 transition-colors"
              >
                {data.cta}
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
