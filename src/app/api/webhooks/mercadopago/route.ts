import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { MercadoPagoConfig, Payment } from "mercadopago"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const paymentId = body.data?.id

    if (!paymentId) {
      return NextResponse.json({ error: "missing payment id" }, { status: 400 })
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
    })

    const paymentClient = new Payment(client)
    const payment = await paymentClient.get({ id: paymentId })

    if (!payment || !payment.external_reference) {
      return NextResponse.json({ status: "ignored" })
    }

    const statusMap: Record<string, string> = {
      approved: "paid",
      pending: "pending",
      in_process: "pending",
      rejected: "cancelled",
      refunded: "refunded",
      cancelled: "cancelled",
    }

    const newStatus = statusMap[payment.status as string] || "pending"

    await prisma.order.updateMany({
      where: { preferenceId: payment.external_reference },
      data: {
        status: newStatus,
        paymentId: String(paymentId),
      },
    })

    return NextResponse.json({ status: "ok" })
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}
