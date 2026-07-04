"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Tags, Image, Package, Ticket, Settings, LogOut, Menu, X, ChevronDown } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: ShoppingBag },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/pedidos", label: "Pedidos", icon: Package },
  { href: "/admin/cupons", label: "Cupons", icon: Ticket },
  { href: "/admin/config", label: "Configurações", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 bg-white border-r border-[#e0e0e0] fixed h-screen z-40">
        <div className="h-16 flex items-center px-5 border-b border-[#e0e0e0]">
          <Link href="/admin" className="font-serif text-lg font-semibold tracking-tight text-[#1a1a1a]">
            PULSA <span className="text-[#d4a5a5]">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-[#d4a5a5]/10 text-[#1a1a1a] font-medium"
                    : "text-[#666] hover:bg-muted/50"
                }`}
              >
                <item.icon size={18} className={active ? "text-[#d4a5a5]" : ""} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-[#e0e0e0]">
          <button
            onClick={() => setLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#666] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#999] hover:bg-muted/50 mt-1"
          >
            ← Ver site
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-[#e0e0e0]">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-serif text-base font-semibold text-[#1a1a1a]">
            PULSA <span className="text-[#d4a5a5]">ADMIN</span>
          </span>
          <button onClick={() => setLogoutConfirm(true)} className="p-2 -mr-2 text-[#666]">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e0e0e0] safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-2">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                  active ? "text-[#d4a5a5]" : "text-[#999]"
                }`}
              >
                <item.icon size={18} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-14 bottom-14 w-64 bg-white shadow-lg">
            <nav className="py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      active
                        ? "bg-[#d4a5a5]/10 text-[#1a1a1a] font-medium"
                        : "text-[#666] hover:bg-muted/50"
                    }`}
                  >
                    <item.icon size={18} className={active ? "text-[#d4a5a5]" : ""} />
                    {item.label}
                  </Link>
                )
              })}
              <hr className="my-3 border-[#e0e0e0]" />
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#999]"
              >
                ← Ver site
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 pb-16 lg:pb-0">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {logoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">Sair do admin</h3>
            <p className="text-sm text-[#666] mb-6">Tem certeza que deseja sair?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm text-[#666] hover:bg-[#f7f7f7] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
