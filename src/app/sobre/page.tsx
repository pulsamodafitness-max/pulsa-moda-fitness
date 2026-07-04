import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / Sobre Nós</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Sobre Nós
          </h1>
          <div className="max-w-3xl space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              A Pulsa Moda Fitness nasceu da paixão pelo esporte e pelo bem-estar.
              Somos uma marca fitness premium dedicada a criar roupas que unem
              performance, conforto e estilo.
            </p>
            <p>
              Cada peça é pensada nos mínimos detalhes — do caimento ao tecido — para
              que você se sinta incrível enquanto supera seus limites. Utilizamos
              poliamida de alta qualidade, costuras reforçadas e modelagens que
              valorizam o corpo.
            </p>
            <p>
              Acreditamos que o exercício vai além da estética: é sobre energia,
              disciplina e autoconfiança. Nossa missão é vestir cada passo dessa
              jornada.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
