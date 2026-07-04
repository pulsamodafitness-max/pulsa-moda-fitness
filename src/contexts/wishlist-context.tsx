"use client"

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { WishlistState, WishlistAction, WishlistContextType } from "@/types/wishlist"

const STORAGE_KEY = "pulsa-wishlist"

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

function load(): string[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function save(ids: string[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {}
}

function reducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.ids.includes(action.payload.id)
      return {
        ids: exists
          ? state.ids.filter((id) => id !== action.payload.id)
          : [...state.ids, action.payload.id],
      }
    }
    case "CLEAR":
      return { ids: [] }
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { ids: [] })

  useEffect(() => {
    const saved = load()
    if (saved.length > 0) {
      for (const id of saved) {
        dispatch({ type: "TOGGLE", payload: { id } })
      }
    }
  }, [])

  useEffect(() => {
    save(state.ids)
  }, [state.ids])

  const toggle = useCallback((id: string) => {
    dispatch({ type: "TOGGLE", payload: { id } })
  }, [])

  const isInWishlist = useCallback(
    (id: string) => state.ids.includes(id),
    [state.ids]
  )

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), [])

  const count = useMemo(() => state.ids.length, [state.ids])

  return (
    <WishlistContext.Provider
      value={{ ids: state.ids, toggle, isInWishlist, clear, count }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within WishlistProvider")
  return context
}
