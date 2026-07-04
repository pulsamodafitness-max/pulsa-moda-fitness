import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function TermosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / Termos de Uso</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Termos de Uso
          </h1>
          <div className="max-w-3xl space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">1. Aceitação dos Termos</h2>
              <p>Ao acessar e utilizar este site, você declara estar de acordo com estes Termos de Uso.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">2. Uso do Site</h2>
              <p>Este site destina-se à compra de produtos fitness. É proibido utilizar o site para fins ilegais ou não autorizados.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">3. Propriedade Intelectual</h2>
              <p>Todo o conteúdo do site — imagens, textos, logotipos — é propriedade da Pulsa Moda Fitness.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">4. Preços e Pagamentos</h2>
              <p>Os preços estão sujeitos a alteração sem aviso prévio. O pagamento deve ser realizado no ato da compra.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">5. Alterações</h2>
              <p>Estes termos podem ser alterados a qualquer momento. Recomendamos revisá-los periodicamente.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
