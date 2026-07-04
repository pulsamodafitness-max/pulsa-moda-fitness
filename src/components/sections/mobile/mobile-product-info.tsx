"use client"

import { useState } from "react"
import { ShoppingBag, Minus, Plus, Ruler, User, ChevronDown, FileText, AlignLeft, Info, Truck } from "lucide-react"
import { motion } from "framer-motion"
import type { Product } from "@/types/product"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"

interface MobileProductInfoProps {
  product: Product
}

export function MobileProductInfo({ product }: MobileProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cep, setCep] = useState("")
  const [shippingResult, setShippingResult] = useState<{ carrier: string; service: string; delivery: string; price: number }[] | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const { addItem } = useCart()
  const { showToast } = useToast()

  const pixPrice = product.price * 0.9
  const installment = (product.price / 6).toFixed(2).replace(".", ",")

  function handleAddToCart() {
    if (!selectedSize) {
      showToast("Selecione um tamanho")
      return
    }
    const color = product.colors[selectedColor]
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: color.hex,
      quantity,
    })
    showToast(`${product.name} adicionado ao carrinho!`)
  }

  async function handleCalculateShipping() {
    const digits = cep.replace(/\D/g, "")
    if (digits.length !== 8) return

    setShippingLoading(true)
    setShippingResult(null)

    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: digits,
          items: [{ productId: product.id, quantity }],
        }),
      })
      const data = await res.json()
      if (data.error) return
      setShippingResult(data.options)
    } catch {
    } finally {
      setShippingLoading(false)
    }
  }

  function formatCep(value: string) {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 5) return digits
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
  }

  const accordionItems = [
    { id: "composition", icon: FileText, title: "Composição", content: product.details },
    { id: "description", icon: AlignLeft, title: "Descrição", content: product.description },
    { id: "additional", icon: Info, title: "Informações adicionais", content: product.care },
  ]

  return (
    <div className="px-4 pb-8 space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
        {product.ref && (
          <p className="text-xs text-[#999] mt-0.5">Ref: {product.ref}</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.comparePrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        <p className="text-sm text-[#22c55e] font-medium">
          R$ {pixPrice.toFixed(2).replace(".", ",")} no Pix
        </p>
        <p className="text-xs text-[#666]">
          em até 6x de R$ {installment} sem juros
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Cor: {product.colors[selectedColor].name}</p>
        <div className="flex gap-3">
          {product.colors.map((c, i) => (
            <button
              key={c.hex}
              onClick={() => setSelectedColor(i)}
              className={`relative w-[52px] h-[52px] rounded-full overflow-hidden border-2 transition-all ${
                i === selectedColor
                  ? "border-foreground scale-110 shadow-md"
                  : "border-border hover:border-muted-foreground"
              }`}
              aria-label={c.name}
            >
              <img src={c.thumb} alt={c.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Tamanho</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-11 min-w-[56px] rounded-lg border text-sm font-medium transition-all ${
                selectedSize === size
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-muted-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-xs text-[#999]">Escolha um tamanho acima</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Quantidade</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-11 w-11 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-medium w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="h-11 w-11 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full h-14 rounded-full bg-foreground text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.97] transition-transform"
      >
        <ShoppingBag size={18} />
        Adicionar ao Carrinho
      </button>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center gap-2 h-12 rounded-xl border border-[#e0e0e0] text-sm font-medium justify-center active:bg-muted transition-colors">
          <Ruler size={16} className="text-muted-foreground" />
          Guia de Medidas
        </button>
        <button className="flex-1 flex items-center gap-2 h-12 rounded-xl border border-[#e0e0e0] text-sm font-medium justify-center active:bg-muted transition-colors">
          <User size={16} className="text-muted-foreground" />
          Medidas da Modelo
        </button>
      </div>

      <div className="rounded-xl border border-[#e0e0e0] p-4 space-y-3">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Truck size={16} />
          Entrega
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
            maxLength={9}
            className="flex-1 h-11 rounded-lg border border-border px-3 text-sm outline-none focus:border-foreground transition-colors"
          />
          <button
            onClick={handleCalculateShipping}
            className="h-11 px-5 rounded-lg bg-foreground text-background text-sm font-medium shrink-0"
          >
            Calcular
          </button>
        </div>
        {shippingLoading && (
          <p className="text-sm text-muted-foreground text-center py-2">Calculando...</p>
        )}
        {shippingResult && !shippingLoading && (
          <div className="space-y-1">
            {shippingResult.map((opt, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-t border-[#f0f0f0] text-sm">
                <div>
                  <p className="font-medium">{opt.carrier}</p>
                  <p className="text-xs text-muted-foreground">{opt.delivery} dias úteis</p>
                </div>
                <span className="font-semibold">
                  R$ {opt.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => window.open("https://buscacepinter.correios.com.br", "_blank")}
          className="text-xs text-[#d4a5a5] hover:underline"
        >
          Não sei meu CEP
        </button>
      </div>

      <div className="space-y-2">
        {accordionItems.map((item) => item.content && (
          <div key={item.id} className="rounded-xl border border-[#e0e0e0] overflow-hidden">
            <button
              onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <item.icon size={16} className="text-muted-foreground" />
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: openAccordion === item.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-muted-foreground" />
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{
                height: openAccordion === item.id ? "auto" : 0,
                opacity: openAccordion === item.id ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                {item.content}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
