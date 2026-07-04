export interface WishlistState {
  ids: string[]
}

export type WishlistAction =
  | { type: "TOGGLE"; payload: { id: string } }
  | { type: "CLEAR" }

export interface WishlistContextType {
  ids: string[]
  toggle: (id: string) => void
  isInWishlist: (id: string) => boolean
  clear: () => void
  count: number
}
