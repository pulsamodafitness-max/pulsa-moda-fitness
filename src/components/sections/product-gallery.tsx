"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      <div className="hidden lg:flex lg:flex-col gap-2 overflow-y-auto lg:max-h-[600px]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative flex-shrink-0 w-20 h-24 rounded-md overflow-hidden border-[1.5px] transition-colors ${
              i === selected ? "border-foreground" : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`${name} - ângulo ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 aspect-[3/4] relative overflow-hidden rounded-none lg:rounded-lg bg-muted">
        <button
          onClick={() => setSelected(prev => (prev === 0 ? images.length - 1 : prev - 1))}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-[#555] shadow-sm lg:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setSelected(prev => (prev === images.length - 1 ? 0 : prev + 1))}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 text-[#555] shadow-sm lg:hidden"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={images[selected]}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === selected ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
