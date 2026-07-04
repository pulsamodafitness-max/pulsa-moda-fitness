import { BannerData } from "@/types/product"

export const heroBanner: BannerData = {
  id: "hero",
  image: "/images/1.jpg",
  title: "NOVA COLEÇÃO",
  subtitle: "Performance que move você",
  cta: "Comprar Agora",
  ctaLink: "/categoria/lancamentos",
  mobileImages: ["/images/hero-mobile-1.png", "/images/hero-mobile-2.png"],
}

export const promotionalBanners: BannerData[] = [
  {
    id: "promo-1",
    image: "/images/2.jpg",
    title: "FREE SHIPPING",
    subtitle: "Nas compras acima de R$ 199",
    cta: "Ver Produtos",
    ctaLink: "/categoria/leggings",
    mobileImages: ["/images/promo-mobile-1.png"],
  },
  {
    id: "promo-2",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1920&q=80",
    title: "ATÉ 40% OFF",
    subtitle: "Seleção especial de final de temporada",
    cta: "Aproveitar",
    ctaLink: "/categoria/conjuntos",
    mobileImages: ["/images/promo-mobile-2.png"],
  },
]

export const collectionBanners: BannerData[] = [
  { id: "col-1", image: "/images/col-1.jpg", title: "" },
  { id: "col-2", image: "/images/col-2.jpg", title: "" },
  { id: "col-3", image: "/images/col-3.jpg", title: "" },
]
