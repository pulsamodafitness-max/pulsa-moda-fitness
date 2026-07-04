import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCarousel } from "@/components/sections/product-carousel"
import { Banner } from "@/components/sections/banner"
import { SectionWrapper } from "@/components/sections/section-wrapper"
import { BannerCarousel } from "@/components/sections/banner-carousel"
import { prisma } from "@/lib/prisma"
import type { BannerData } from "@/types/product"
import {
  heroBanner as fallbackHero,
  promotionalBanners as fallbackPromo,
  collectionBanners as fallbackCollection,
} from "@/data/banners"
import {
  getFeaturedProducts,
  getNewProducts,
  getRunningProducts,
} from "@/data/products"

function pick<T>(arr: T[], offset: number, count: number): T[] {
  return arr.slice(offset, offset + count)
}

export default async function Home() {
  const [featured, newProducts, runningProducts, dbBanners] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getRunningProducts(),
    prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ])

  const staticBanners = dbBanners.length === 0

  const banners: BannerData[] = staticBanners
    ? [fallbackHero, ...fallbackPromo, ...fallbackCollection]
    : dbBanners.map((b) => ({
        id: b.id,
        image: b.image,
        title: b.title,
        subtitle: b.subtitle || undefined,
        cta: b.cta || undefined,
        ctaLink: b.ctaLink || undefined,
        mobileImages: b.mobileImages,
      }))

  const heroBanner = banners[0] ?? fallbackHero
  const promoBanners = pick(banners, 1, 2)
  const collectionBanners = banners.length > 3 ? pick(banners, 3, banners.length - 3) : fallbackCollection

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Banner data={heroBanner} size="hero" />

        <SectionWrapper title="Escolhidos para você">
          <ProductCarousel products={featured} />
        </SectionWrapper>

        <SectionWrapper title="Lançamentos" href="/categoria/lancamentos">
          <ProductCarousel products={newProducts} />
        </SectionWrapper>

        {promoBanners[0] && <Banner data={promoBanners[0]} size="promo" />}

        <SectionWrapper title="Looks para corrida" href="/categoria/corrida">
          <ProductCarousel products={runningProducts} />
        </SectionWrapper>

        {promoBanners[1] && <Banner data={promoBanners[1]} size="promo" />}

        <section className="pt-1 pb-8 sm:py-20">
          <div className="text-center mb-4 sm:mb-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-3xl font-semibold tracking-[0.05em] uppercase text-[#666] lg:text-[#1a1a1a]">
              Favoritos da Coleção
            </h2>
          </div>
          <BannerCarousel banners={collectionBanners} />
        </section>
      </main>
      <Footer />
    </>
  )
}
