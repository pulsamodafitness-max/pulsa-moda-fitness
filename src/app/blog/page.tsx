import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

const posts = [
  { titulo: "Como escolher o look fitness ideal para cada treino", data: "15 Jun 2026", slug: "#" },
  { titulo: "Tecidos fitness: guia completo para acertar na escolha", data: "08 Jun 2026", slug: "#" },
  { titulo: "5 dicas para montar seu guarda-roupa fitness", data: "01 Jun 2026", slug: "#" },
  { titulo: "A importancia do vestuario certo no desempenho esportivo", data: "25 Mai 2026", slug: "#" },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <p className="text-sm text-muted-foreground mb-2">Home / Blog</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight uppercase mb-8">
            Blog
          </h1>
          <div className="max-w-3xl space-y-6">
            {posts.map((post) => (
              <Link
                key={post.titulo}
                href={post.slug}
                className="block border-b border-border pb-6 group"
              >
                <p className="text-xs text-muted-foreground mb-1">{post.data}</p>
                <h2 className="text-base font-medium group-hover:underline underline-offset-4">
                  {post.titulo}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
