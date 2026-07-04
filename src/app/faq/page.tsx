"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const faqs = [
  { q: "Quanto tempo leva para o pedido ser processado?", a: "O processamento leva de 1 a 2 dias úteis após a confirmação do pagamento." },
  { q: "Posso trocar um produto?", a: "Sim, você tem até 30 dias após o recebimento para solicitar troca. O produto deve estar sem uso e com etiquetas." },
  { q: "Como funciona o frete grátis?", a: "Compras acima de R$ 199,00 têm frete grátis para todo o Brasil." },
  { q: "Quais formas de pagamento são aceitas?", a: "Aceitamos cartão de crédito (até 6x sem juros), PIX e boleto bancário." },
  { q: "Como faço para acompanhar meu pedido?", a: "Você receberá o código de rastreamento por email assim que o pedido for postado." },
  { q: "Vocês vendem para todo o Brasil?", a: "Sim, enviamos para todos os estados brasileiros." },
  { q: "Posso cancelar meu pedido?", a: "Sim, o cancelamento pode ser solicitado em até 24 horas após a compra." },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / FAQ</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Perguntas Frequentes
          </h1>
          <div className="max-w-2xl space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex items-center justify-between w-full px-5 py-4 text-sm font-medium text-left hover:bg-muted/50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
