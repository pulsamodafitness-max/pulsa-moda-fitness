export interface NavCategory {
  id: string
  name: string
  slug: string
  subcategories?: { name: string; slug: string }[]
}

export interface QuickLink {
  label: string
  href: string
}

export interface RecentSearch {
  term: string
  timestamp: number
}

export interface FeaturedProduct {
  id: string
  name: string
  price: number
  image: string
  slug: string
}
