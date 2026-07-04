import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import type { BannerData } from "@/types/product"

interface VerticalBannersProps {
  banners: BannerData[]
}

export function VerticalBanners({ banners }: VerticalBannersProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={banner.ctaLink || "#"} className="group block relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {banner.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
