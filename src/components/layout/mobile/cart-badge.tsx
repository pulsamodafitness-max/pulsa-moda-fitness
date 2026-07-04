interface CartBadgeProps {
  count: number
}

export function CartBadge({ count }: CartBadgeProps) {
  if (count === 0) return null

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
      {count > 9 ? "9+" : count}
    </span>
  )
}
