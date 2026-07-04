"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, ChevronDown, Phone, MapPin, Clock } from "lucide-react"
import { FooterLinks } from "./footer-links"
import { PaymentMethods } from "./payment-methods"
import { ShippingMethods } from "./shipping-methods"
import { SecurityBadges } from "./security-badges"
import { TrustBadges } from "./trust-badges"
import { Newsletter } from "./newsletter"

export function Footer({ simplified }: { simplified?: boolean }) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const year = new Date().getFullYear()

  return (
    <footer>
      {!simplified && <TrustBadges />}
      <Newsletter />

      {/* MAIN FOOTER — BLACK */}
      <div className="bg-[#111111] text-white">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-12 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* COL 1: SOBRE + SUPORTE */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div>
                <FooterLinks />
              </div>
              {/* Mobile: Central dentro do mesmo fluxo dos accordions */}
              <div className="lg:hidden">
                <RelacionamentoAccordion />
              </div>
            </div>
            {/* Desktop: Central na própria coluna */}
            <div className="hidden lg:block">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a5a5] mb-5">
                Central de Relacionamento
              </h4>
              {relacionamentoContent}
            </div>
            {/* COL 4: PAGAMENTOS + ENVIOS + SEGURANÇA */}
            <div>
              <PaymentMethods />
              <ShippingMethods />
              <SecurityBadges />
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#0c0c0c] border-t border-[#222]">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 pt-1 pb-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-xs text-[#666]">
                &copy; {year} Pulsa Moda Fitness. CNPJ: 66.916.596/0001-82
              </p>
            </div>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center text-[#999] hover:bg-[#d4a5a5] hover:text-white transition-all duration-300 cursor-pointer"
              aria-label="Voltar ao topo"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

const relacionamentoContent = (
  <ul className="space-y-4">
    <li className="flex items-start gap-3 text-sm text-[#bbb]">
      <MapPin size={16} className="text-[#d4a5a5] mt-0.5 shrink-0" />
      <div>
        <p>Praça Santo Antônio dos Prazeres, Santo Antonio do Prazeres</p>
        <p>Feira de Santana/BA CEP: 44071-280</p>
      </div>
    </li>
    <li className="flex items-start gap-3 text-sm text-[#bbb]">
      <Clock size={16} className="text-[#d4a5a5] mt-0.5 shrink-0" />
      <div>
        <p className="text-white font-medium">Atendimento</p>
        <p>Segunda a Sexta: 08:00 às 20:00</p>
        <p>Sábado: 09:00 às 16:00</p>
      </div>
    </li>
    <li>
      <a
        href="tel:+5575998558567"
        className="flex items-center gap-3 text-sm text-[#bbb] hover:text-white transition-colors no-underline"
      >
        <Phone size={16} className="text-[#d4a5a5]" />
        (75) 99855-8567
      </a>
    </li>
  </ul>
)

function RelacionamentoAccordion() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[#222]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a5a5]">
          Central de Relacionamento
        </span>
        <ChevronDown
          size={16}
          className={`text-[#666] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{relacionamentoContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
