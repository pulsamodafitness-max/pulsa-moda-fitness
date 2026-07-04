import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function PrivacidadePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / Privacidade</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Política de Privacidade
          </h1>
          <div className="max-w-3xl space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">1. Informações Coletadas</h2>
              <p>Coletamos informações fornecidas por você no momento do cadastro e da compra, como nome, email, telefone e endereço.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">2. Uso das Informações</h2>
              <p>Utilizamos seus dados para processar pedidos, enviar comunicações sobre sua compra e melhorar sua experiência.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">3. Compartilhamento</h2>
              <p>Não compartilhamos seus dados com terceiros, exceto quando necessário para o processamento do pagamento e entrega.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">4. Segurança</h2>
              <p>Adotamos medidas de segurança para proteger suas informações contra acesso não autorizado.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-foreground mb-2">5. Contato</h2>
              <p>Para dúvidas sobre esta política, entre em contato pelo email pulsafitt@gmail.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
