"use client"

import { useState, useEffect } from "react"
import { Package, ChevronDown, ChevronUp } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  size?: string
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendente" },
  { value: "paid", label: "Pago" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
]

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  paid: "bg-blue-50 text-blue-600",
  shipped: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [confirmStatus, setConfirmStatus] = useState<{ orderId: string; newStatus: string; oldStatus: string } | null>(null)

  async function fetchOrders() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/pedidos")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setOrders(data)
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar pedidos" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/pedidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      setFeedback({ type: "success", msg: "Status atualizado" })
    } catch {
      setFeedback({ type: "error", msg: "Erro ao atualizar status" })
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  function formatCurrency(val: number) {
    return `R$ ${val.toFixed(2).replace(".", ",")}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Pedidos</h1>
        <p className="text-sm text-[#666]">Gerencie os pedidos da loja</p>
      </div>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.msg}
          <button onClick={() => setFeedback(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#999] text-sm">Carregando...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-[#999]">
          <Package size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">{order.customerName}</p>
                      <p className="text-xs text-[#666]">{formatDate(order.createdAt)}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        STATUS_COLORS[order.status] || "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {STATUS_OPTIONS.find((s) => s.value === order.status)?.label || order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#666]">{order.items.length} item(ns)</span>
                    <span className="font-semibold text-[#1a1a1a]">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#666]">Status</label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        setConfirmStatus({ orderId: order.id, newStatus: e.target.value, oldStatus: order.status })
                      }
                      className="w-full px-3 py-2 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    className="flex items-center justify-center gap-1 w-full py-2 text-xs text-[#666] hover:text-[#1a1a1a] transition-colors"
                  >
                    {expandedId === order.id ? (
                      <>Ver menos <ChevronUp size={14} /></>
                    ) : (
                      <>Ver itens <ChevronDown size={14} /></>
                    )}
                  </button>

                  {expandedId === order.id && (
                    <div className="border-t border-[#f0f0f0] pt-3 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div>
                            <p className="text-[#1a1a1a]">{item.name}</p>
                            <p className="text-[10px] text-[#999]">
                              Qtd: {item.quantity} {item.size ? `| Tam: ${item.size}` : ""}
                            </p>
                          </div>
                          <span className="text-[#666]">{formatCurrency(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e0e0] bg-[#f7f7f7]">
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Data
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Itens
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Total
                  </th>
                  <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-3">
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f7f7f7] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#1a1a1a]">{order.customerName}</p>
                      <p className="text-xs text-[#666]">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#666]">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 text-sm text-[#666]">{order.items.length}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#1a1a1a]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          setConfirmStatus({ orderId: order.id, newStatus: e.target.value, oldStatus: order.status })
                        }
                        className={`text-[11px] px-2.5 py-1.5 rounded-lg border-0 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 ${
                          STATUS_COLORS[order.status] || "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === order.id ? null : order.id)
                        }
                        className="p-2 rounded-lg text-[#666] hover:bg-[#f0f0f0] transition-colors"
                      >
                        {expandedId === order.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded items (desktop) */}
          {expandedId && (
            <div className="hidden lg:block bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
              <div className="px-5 py-3 bg-[#f7f7f7] border-b border-[#e0e0e0]">
                <p className="text-sm font-medium text-[#1a1a1a]">
                  Itens do Pedido #{expandedId.slice(0, 8)}
                </p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e0e0]">
                    <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-2">
                      Produto
                    </th>
                    <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-2">
                      Tam
                    </th>
                    <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-2">
                      Qtd
                    </th>
                    <th className="text-right text-xs font-medium text-[#666] uppercase tracking-wider px-5 py-2">
                      Preço
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {orders
                    .find((o) => o.id === expandedId)
                    ?.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-2 text-sm text-[#1a1a1a]">{item.name}</td>
                        <td className="px-5 py-2 text-sm text-[#666]">{item.size || "—"}</td>
                        <td className="px-5 py-2 text-sm text-[#666]">{item.quantity}</td>
                        <td className="px-5 py-2 text-sm text-right text-[#1a1a1a]">
                          {formatCurrency(item.price)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {confirmStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">Alterar status</h3>
            <p className="text-sm text-[#666] mb-6">
              {STATUS_OPTIONS.find((s) => s.value === confirmStatus.oldStatus)?.label} →{" "}
              {STATUS_OPTIONS.find((s) => s.value === confirmStatus.newStatus)?.label}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmStatus(null)}
                className="flex-1 px-4 py-2.5 border border-[#e0e0e0] rounded-xl text-sm text-[#666] hover:bg-[#f7f7f7] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleStatusChange(confirmStatus.orderId, confirmStatus.newStatus)
                  setConfirmStatus(null)
                }}
                className="flex-1 px-4 py-2.5 bg-[#d4a5a5] text-white rounded-xl text-sm hover:bg-[#c49494] transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
