import { Heart, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { CartBadge } from "./cart-badge"

interface NavbarIconsProps {
  onCartClick: () => void
}

export function NavbarIcons({ onCartClick }: NavbarIconsProps) {
  const { totalItems } = useCart()
  const { ids } = useWishlist()

  return (
    <div className="flex items-center gap-1">
      <a
        href="/favoritos"
        className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-all duration-200 hover:scale-105"
        aria-label={`Favoritos (${ids.length})`}
      >
        <Heart size={22} className="text-[#1a1a1a]" />
      </a>

      <button
        onClick={onCartClick}
        className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-all duration-200 hover:scale-105"
        aria-label="Carrinho"
      >
        <ShoppingBag size={22} className="text-[#1a1a1a]" />
        <CartBadge count={totalItems} />
      </button>
    </div>
  )
}
