import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/sections/product-card"
import { searchProducts } from "@/data/products"

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q || ""
  const results = query ? await searchProducts(query) : []

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] py-8 sm:py-12">
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground mb-2">
              Home / Busca{query && ` / "${query}"`}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase">
              {query ? `Resultados para "${query}"` : "Buscar Produtos"}
            </h1>
            {query && (
              <p className="text-sm text-muted-foreground mt-2">
                {results.length === 0
                  ? "Nenhum resultado encontrado."
                  : `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}.`}
              </p>
            )}
          </div>

          {!query ? (
            <div className="py-16 text-center px-4 sm:px-6 lg:px-8">
              <p className="text-muted-foreground">
                Digite um termo para buscar produtos.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center px-4 sm:px-6 lg:px-8">
              <p className="text-muted-foreground">
                Nenhum produto encontrado para &ldquo;{query}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
