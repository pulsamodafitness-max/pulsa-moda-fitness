import Image from "next/image"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/sections/product-card"
import { MobileCategoryContent } from "@/components/sections/mobile/mobile-category-content"
import { getCategoria, getProductsFromCategoria } from "@/data/categorias"

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const categoria = await getCategoria(slug)

  if (!categoria) {
    notFound()
  }

  const produtos = await getProductsFromCategoria(categoria)

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Banner */}
        <div className="relative w-full h-[200px] sm:h-[280px] overflow-hidden bg-[#f7f7f7]">
          {categoria.image ? (
            <Image
              src={categoria.image}
              alt={categoria.nome}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <Image
              src="/images/banner-categoria.jpg"
              alt={categoria.nome}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Mobile only (< lg) */}
        <div className="lg:hidden">
          <MobileCategoryContent nome={categoria.nome} produtos={produtos} />
        </div>

        {/* Desktop only (lg+) */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-[1920px] py-8 sm:py-12">
            <div className="mb-8 px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-muted-foreground mb-2">
                Home / {categoria.nome}
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {categoria.nome}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {categoria.descricao}
              </p>
            </div>

            {produtos.length === 0 ? (
              <div className="py-16 text-center px-4 sm:px-6 lg:px-8">
                <p className="text-muted-foreground">
                  Nenhum produto encontrado nesta categoria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {produtos.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
