import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function TrocasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / Trocas e Devoluções</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Trocas e Devoluções
          </h1>
          <div className="max-w-3xl space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">Prazo para Troca</h2>
              <p>Você tem até 30 dias após o recebimento para solicitar troca ou devolução.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">Condições</h2>
              <p>O produto deve estar sem uso, com etiquetas e na embalagem original.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">Como Solicitar</h2>
              <p>Envie um email para pulsafitt@gmail.com com seu número de pedido e motivo da troca.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">Reembolso</h2>
              <p>O reembolso será processado em até 10 dias úteis após o recebimento do produto.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
