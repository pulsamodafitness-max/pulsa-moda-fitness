"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { NavCategory } from "@/types/navbar"

interface DrawerCategoryProps {
  category: NavCategory
  onClose: () => void
}

export function DrawerCategory({ category, onClose }: DrawerCategoryProps) {
  const [open, setOpen] = useState(false)
  const hasSub = category.subcategories && category.subcategories.length > 0

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-left"
        aria-expanded={open}
      >
        {hasSub ? (
          <span className="text-sm font-medium text-[#1a1a1a]">{category.name}</span>
        ) : (
          <Link
            href={`/categoria/${category.slug}`}
            onClick={onClose}
            className="text-sm font-medium text-[#1a1a1a] hover:text-[#d4a5a5] transition-colors no-underline flex-1"
          >
            {category.name}
          </Link>
        )}
        {hasSub && (
          <ChevronDown
            size={16}
            className={`text-[#999] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && hasSub && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-3 space-y-2 border-l-2 border-[#f0f0f0] ml-1">
              {category.subcategories!.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/categoria/${sub.slug}`}
                  onClick={onClose}
                  className="block text-sm text-[#666] hover:text-[#d4a5a5] transition-colors no-underline py-1"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
