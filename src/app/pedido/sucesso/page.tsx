import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PedidoSucessoPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-32 px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="mx-auto mb-6 text-green-600" />
          <h1 className="text-2xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-muted-foreground mb-8">
            Seu pagamento foi aprovado. Você receberá um e-mail com os detalhes do pedido.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Continuar Comprando
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
