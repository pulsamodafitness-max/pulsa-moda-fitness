"use client"

import { useState } from "react"
import { Menu, Search } from "lucide-react"
import { NavbarLogo } from "./navbar-logo"
import { NavbarIcons } from "./navbar-icons"
import { MenuDrawer } from "./menu-drawer"
import { SearchOverlay } from "./search-overlay"
import { MiniCart } from "./mini-cart"

export function MobileNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between h-full px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors -ml-2"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-all duration-200 hover:scale-105"
            aria-label="Pesquisar"
          >
            <Search size={22} className="text-[#1a1a1a]" />
          </button>
        </div>

        <NavbarLogo />

        <NavbarIcons onCartClick={() => setCartOpen(true)} />
      </div>

      <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
