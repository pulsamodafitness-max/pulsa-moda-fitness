"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, ShoppingBag, Phone, Mail } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { WhatsApp, Instagram, Facebook, TikTok, Threads } from "@/components/ui/icons"
import "./navbar.css"

const staticLinks = [
  { href: "/nossa-essencia", label: "NOSSA ESSÊNCIA" },
]

export function DesktopNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categorias, setCategorias] = useState<{ href: string; label: string }[]>([])
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { openCart, totalItems } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategorias(
            data.map((c: { slug: string; name: string }) => ({
              href: `/categoria/${c.slug}`,
              label: c.name.toUpperCase(),
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (q) router.push(`/busca?q=${encodeURIComponent(q)}`)
    },
    [searchQuery, router]
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div className="pulsa-top-bar">
        <div className="pulsa-top-bar-content">
          <div className="pulsa-top-bar-left">
            <a
              href="https://wa.me/5575998558567"
              className="pulsa-top-bar-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp size={14} /> WhatsApp
            </a>
            <a href="tel:+5575998558567" className="pulsa-top-bar-item">
              <Phone size={14} /> (75) 99855-8567
            </a>
            <a href="mailto:pulsafitt@gmail.com" className="pulsa-top-bar-item">
              <Mail size={14} /> pulsafitt@gmail.com
            </a>
          </div>
          <div className="pulsa-top-bar-right">
            <a
              href="https://instagram.com/pulsamodafitness"
              target="_blank"
              title="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61589262036319&locale=pt_BR" target="_blank" title="Facebook">
              <Facebook size={16} />
            </a>
            <a
              href="https://tiktok.com/@pulsamodafitness"
              target="_blank"
              title="TikTok"
            >
              <TikTok size={16} />
            </a>
            <a
              href="https://threads.net/@pulsamodafitness"
              target="_blank"
              title="Threads"
            >
              <Threads size={16} />
            </a>
          </div>
        </div>
      </div>

      <nav className={`pulsa-navbar${scrolled ? " scrolled" : ""}`}>
        <div className="pulsa-navbar-content">
          <Link href="/" className="pulsa-logo">
            PULSA
            <span>MODA FITNESS</span>
          </Link>

          <div className="pulsa-nav-menu">
            {categorias.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            {staticLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pulsa-nav-right">
            <form className="pulsa-search-box" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Buscar">
                <Search size={14} />
              </button>
            </form>
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <button
                  className="pulsa-icon-btn"
                  title="Minha Conta"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User size={16} />
                </button>
              ) : (
                <Link href="/login" className="pulsa-icon-btn" title="Entrar">
                  <User size={16} />
                </Link>
              )}
              {isAuthenticated && userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-background shadow-lg z-50 py-2">
                  <p className="px-4 py-1.5 text-sm font-medium truncate">
                    {user?.name}
                  </p>
                  <hr className="border-border my-1" />
                  <Link
                    href="/favoritos"
                    className="block px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Favoritos
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                      router.push("/")
                    }}
                    className="block w-full text-left px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
            <button
              className="pulsa-icon-btn"
              title="Carrinho"
              onClick={openCart}
            >
              <ShoppingBag size={16} />
              {totalItems > 0 && (
                <span className="pulsa-cart-badge">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
