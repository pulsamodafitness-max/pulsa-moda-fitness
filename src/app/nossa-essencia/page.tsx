import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function NossaEssenciaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-sm text-muted-foreground mb-2">
            Home / Nossa Essência
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
            Nossa Essência
          </h1>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Na Pulsa Fit, acreditamos que o movimento transforma. Cada peça
              é pensada para acompanhar você em cada repetição, cada passo,
              cada superação.
            </p>
            <p>
              Nascemos da vontade de criar roupas fitness que unem performance
              e estilo. Tecidos de alta qualidade, modelagens que valorizam o
              corpo e designs que traduzem sua energia.
            </p>
            <p>
              Somos para quem não para. Para quem busca mais. Para quem sente
              que o melhor está sempre por vir.
            </p>
            <p className="font-medium text-foreground pt-4">
              Pulsa Fit. Vista seu movimento.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
