"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const sections = [
  {
    title: "Sobre a Pulsa Moda Fitness",
    links: [
      { href: "/sobre", label: "Quem somos" },
      { href: "/termos", label: "Termo de uso" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { href: "/faq", label: "Central de ajuda" },
      { href: "/contato", label: "Entre em contato" },
      { href: "/trocas", label: "Troca e Devolução" },
      { href: "/privacidade", label: "Política de Privacidade" },
    ],
  },
]

export function FooterLinks() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a5a5] mb-5">
              {section.title}
            </h4>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#bbb] hover:text-white transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile Accordion */}
      <div className="sm:hidden space-y-0">
        {sections.map((section) => (
          <AccordionSection key={section.title} title={section.title} links={section.links} />
        ))}
      </div>
    </>
  )
}

function AccordionSection({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[#222]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a5a5]">
          {title}
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
            <ul className="space-y-3 pb-4">
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#bbb] hover:text-white transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
