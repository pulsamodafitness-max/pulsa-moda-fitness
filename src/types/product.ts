export interface ColorVariant {
  hex: string
  name: string
  thumb: string
  image?: string
}

export interface Product {
  id: string
  ref?: string
  name: string
  slug: string
  description: string
  details?: string
  care?: string
  price: number
  comparePrice?: number
  image: string
  images: string[]
  category: string
  tags: string[]
  isNew?: boolean
  rating: number
  colors: ColorVariant[]
  sizes: string[]
  weight: number
  width: number
  height: number
  length: number
}

export interface BannerData {
  id: string
  image: string
  title: string
  subtitle?: string
  cta?: string
  ctaLink?: string
  mobileImages?: string[]
}
