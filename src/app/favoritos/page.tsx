"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/sections/product-card"
import { useWishlist } from "@/contexts/wishlist-context"
import Link from "next/link"
import type { Product } from "@/types/product"

export default function FavoritosPage() {
  const { ids, clear } = useWishlist()
  const [favoritedProducts, setFavoritedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setFavoritedProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/produtos?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setFavoritedProducts(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [ids])

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] py-8 sm:py-12">
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground mb-2">
              Home / Favoritos
            </p>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase">
                Favoritos
              </h1>
              {favoritedProducts.length > 0 && (
                <button
                  onClick={clear}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpar tudo
                </button>
              )}
            </div>
            {favoritedProducts.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {favoritedProducts.length}{" "}
                {favoritedProducts.length === 1
                  ? "produto salvo"
                  : "produtos salvos"}
                .
              </p>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center px-4 sm:px-6 lg:px-8">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : favoritedProducts.length === 0 ? (
            <div className="py-16 text-center px-4 sm:px-6 lg:px-8">
              <p className="text-muted-foreground mb-4">
                Você ainda não tem produtos favoritos.
              </p>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground text-background px-6 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Explorar produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {favoritedProducts.map((product) => (
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
