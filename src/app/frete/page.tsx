import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function FretePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / Frete e Prazo</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Frete e Prazo
          </h1>
          <div className="max-w-3xl space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">Frete Grátis</h2>
              <p>Compras acima de R$ 199,00 têm frete grátis para todo o Brasil.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">Prazo de Entrega</h2>
              <p>O prazo varia de 7 a 15 dias úteis, dependendo da região de entrega.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">Rastreamento</h2>
              <p>Após a postagem, você receberá o código de rastreamento por email.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
