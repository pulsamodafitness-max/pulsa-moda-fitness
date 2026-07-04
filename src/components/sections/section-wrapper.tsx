import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  title: string
  href?: string
  children: React.ReactNode
  className?: string
}

export function SectionWrapper({
  title,
  href,
  children,
  className,
}: SectionWrapperProps) {
  return (
    <section className={cn("pt-1 pb-8 sm:py-20", className)}>
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-3xl font-semibold tracking-[0.05em] uppercase text-[#666] lg:text-[#1a1a1a]">
            {title}
          </h2>
          {href && (
            <Link
              href={href}
              className="group inline-flex items-center gap-1 mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium underline-offset-4 decoration-transparent hover:decoration-foreground"
            >
              Ver mais
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
