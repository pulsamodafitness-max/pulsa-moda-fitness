"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface PaymentBrickProps {
  preferenceId: string
}

declare global {
  interface Window {
    MercadoPago: new (key: string) => {
      bricks: () => {
        create: (type: string, container: string, config: Record<string, unknown>) => Promise<void>
      }
    }
  }
}

export function PaymentBrick({ preferenceId }: PaymentBrickProps) {
  const router = useRouter()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const script = document.createElement("script")
    script.src = "https://sdk.mercadopago.com/js/v2"
    script.async = true

    script.onload = async () => {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!)
      const bricks = mp.bricks()

      await bricks.create("payment", "payment-brick-container", {
        initialization: {
          preferenceId,
        },
        customization: {
          visual: {
            style: {
              theme: "default",
            },
          },
        },
        callbacks: {
          onReady: () => {},
          onSubmit: () => {
            return new Promise<void>((resolve) => {
              resolve()
            })
          },
          onError: (error: unknown) => {
            console.error("Payment brick error:", error)
          },
        },
      })
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [preferenceId, router])

  return (
    <div className="w-full">
      <div id="payment-brick-container" />
    </div>
  )
}
