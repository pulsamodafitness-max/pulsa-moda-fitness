import { prisma } from "@/lib/prisma"
import { ShoppingBag, Package, Ticket, DollarSign } from "lucide-react"

async function getStats() {
  const [productCount, orderCount, couponCount, recentOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.coupon.count({ where: { active: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ])

  const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } })

  return {
    productCount,
    orderCount,
    couponCount,
    revenue: totalRevenue._sum.total || 0,
    recentOrders,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Produtos", value: stats.productCount, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Pedidos", value: stats.orderCount, icon: Package, color: "bg-green-50 text-green-600" },
    { label: "Cupons", value: stats.couponCount, icon: Ticket, color: "bg-purple-50 text-purple-600" },
    { label: "Receita", value: `R$ ${stats.revenue.toFixed(2).replace(".", ",")}`, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da loja</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-3">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1a1a1a]">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
        <h2 className="text-lg font-semibold mb-4">Últimos Pedidos</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum pedido ainda</p>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#f0f0f0] last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} item(ns) — {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    order.status === "pending" ? "bg-amber-50 text-amber-600" :
                    order.status === "paid" ? "bg-green-50 text-green-600" :
                    "bg-gray-50 text-gray-600"
                  }`}>
                    {order.status === "pending" ? "Pendente" : order.status === "paid" ? "Pago" : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
