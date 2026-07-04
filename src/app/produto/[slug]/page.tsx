import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductGallery } from "@/components/sections/product-gallery"
import { ProductInfo } from "@/components/sections/product-info"
import { ProductTabs } from "@/components/sections/product-tabs"
import { MobileProductInfo } from "@/components/sections/mobile/mobile-product-info"
import { ProductCard } from "@/components/sections/product-card"
import { SectionWrapper } from "@/components/sections/section-wrapper"
import { getProductBySlug, getRelatedProducts } from "@/data/products"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = await getRelatedProducts(product)

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="-mx-4 sm:-mx-6 lg:mx-0">
            <ProductGallery images={product.images} name={product.name} />
          </div>
            <div className="lg:pt-4">
              <div className="lg:hidden">
                <MobileProductInfo product={product} />
              </div>
              <div className="hidden lg:block">
                <ProductInfo product={product} />
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <ProductTabs product={product} />
          </div>
        </div>

        {related.length > 0 && (
          <SectionWrapper title="Você também pode gostar">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </SectionWrapper>
        )}
      </main>
      <Footer />
    </>
  )
}
