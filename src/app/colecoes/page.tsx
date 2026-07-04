import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

const colecoes = [
  { nome: "Nova Coleção", href: "/categoria/lancamentos", descricao: "Performance que move você" },
  { nome: "Corrida", href: "/categoria/corrida", descricao: "Alta performance para running" },
  { nome: "Macaquinhos", href: "/categoria/macaquinhos", descricao: "Movimento e fluidez" },
  { nome: "Conjuntos", href: "/categoria/conjuntos", descricao: "O básico que nunca sai de moda" },
]

export default function ColecoesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / Coleções</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Coleções
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {colecoes.map((col) => (
              <Link
                key={col.href}
                href={col.href}
                className="group block relative aspect-[4/5] overflow-hidden rounded-lg bg-muted"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-lg font-semibold text-white">{col.nome}</h2>
                  <p className="text-sm text-white/70 mt-1">{col.descricao}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
