"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm, type CustomerData } from "@/components/checkout/checkout-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { PaymentBrick } from "@/components/checkout/payment-brick"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { Truck, Loader2, AlertCircle } from "lucide-react"

interface ShippingOption {
  id: number
  carrier: string
  service: string
  price: number
  delivery: number
  companyPicture?: string
}

const defaultCustomer: CustomerData = {
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  complemento: "",
}

type CheckoutStep = "form" | "loading" | "payment" | "error"

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const [customer, setCustomer] = useState<CustomerData>(defaultCustomer)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [step, setStep] = useState<CheckoutStep>("form")
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const handleCepChange = useCallback(async (cep: string) => {
    const digits = cep.replace(/\D/g, "")
    if (digits.length !== 8 || state.items.length === 0) {
      setShippingOptions([])
      setSelectedShipping(null)
      return
    }

    setShippingLoading(true)
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: digits,
          items: state.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (data.options?.length > 0) {
        setShippingOptions(data.options)
        setSelectedShipping(data.options[0])
      } else {
        setShippingOptions([])
        setSelectedShipping(null)
      }
    } catch {
      setShippingOptions([])
      setSelectedShipping(null)
    } finally {
      setShippingLoading(false)
    }
  }, [state.items])

  async function handleSubmit() {
    if (!customer.nome || !customer.email) {
      setErrorMsg("Preencha nome e email")
      setStep("error")
      return
    }

    setStep("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          customer,
          shipping: selectedShipping
            ? {
                carrier: selectedShipping.carrier,
                price: selectedShipping.price,
                delivery: selectedShipping.delivery,
              }
            : null,
          discount: 0,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao processar pagamento")
        setStep("error")
        return
      }

      setPreferenceId(data.preferenceId)
      setStep("payment")
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.")
      setStep("error")
    }
  }

  if (state.items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 px-4">
          <p className="text-lg font-medium mb-2">Seu carrinho está vazio</p>
          <p className="text-sm text-muted-foreground mb-6">
            Adicione produtos antes de finalizar o pedido
          </p>
          <Button onClick={() => router.push("/")}>
            Continuar Comprando
          </Button>
        </main>
        <Footer />
      </>
    )
  }

  if (step === "payment" && preferenceId) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Home / Carrinho / Checkout / <span className="text-foreground">Pagamento</span>
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <h1 className="text-xl font-bold mb-6">Finalize seu pagamento</h1>
              <PaymentBrick preferenceId={preferenceId} />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Home / Carrinho / <span className="text-foreground">Checkout</span>
            </p>
          </div>

          {step === "error" && errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
              <CheckoutForm data={customer} onChange={setCustomer} onCepChange={handleCepChange} />

              {customer.cep.replace(/\D/g, "").length === 8 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Truck size={18} />
                    Opções de Frete
                  </h3>
                  {shippingLoading && (
                    <p className="text-sm text-muted-foreground">Calculando frete...</p>
                  )}
                  {!shippingLoading && shippingOptions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma opção de frete disponível para este CEP
                    </p>
                  )}
                  {shippingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedShipping?.id === opt.id
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping?.id === opt.id}
                          onChange={() => setSelectedShipping(opt)}
                          className="accent-foreground"
                        />
                        <div>
                          <p className="text-sm font-medium">{opt.carrier}</p>
                          <p className="text-xs text-muted-foreground">
                            {opt.service} — {opt.delivery} dias úteis
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">
                        R$ {opt.price.toFixed(2).replace(".", ",")}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-muted/30 rounded-lg p-6 border border-border">
                <OrderSummary shipping={selectedShipping?.price ?? 0} />
                <Button
                  onClick={handleSubmit}
                  disabled={step === "loading"}
                  className="w-full h-12 text-sm mt-6"
                >
                  {step === "loading" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    "Finalizar Pagamento"
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center mt-3">
                  Pagamento processado com segurança via Mercado Pago
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
