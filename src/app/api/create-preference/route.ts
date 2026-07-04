import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { preferenceClient } from "@/lib/mercadopago"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customer, shipping, discount } = body

    if (!items?.length || !customer?.nome || !customer?.email) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const mpItems = items.map((item: { id: string; name: string; price: number; quantity: number }) => ({
      id: item.id,
      title: item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "BRL",
    }))

    if (shipping?.price > 0) {
      mpItems.push({
        id: "shipping",
        title: "Frete",
        quantity: 1,
        unit_price: Number(shipping.price),
        currency_id: "BRL",
      })
    }

    const total = mpItems.reduce((sum: number, item: { unit_price: number; quantity: number }) => sum + item.unit_price * item.quantity, 0)

    const preference = await preferenceClient.create({
      body: {
        items: mpItems,
        payer: {
          name: customer.nome,
          email: customer.email,
          phone: { number: customer.telefone },
        },
        shipments: {
          cost: shipping?.price || 0,
          mode: "not_specified",
        },
        back_urls: {
          success: `${request.nextUrl.origin}/pedido/sucesso`,
          failure: `${request.nextUrl.origin}/checkout`,
          pending: `${request.nextUrl.origin}/checkout`,
        },
        auto_return: "approved",
        notification_url: `${request.nextUrl.origin}/api/webhooks/mercadopago`,
        statement_descriptor: "PULSA MODA FITNESS",
      },
    })

    if (!preference.id) {
      return NextResponse.json({ error: "Erro ao criar preferência" }, { status: 500 })
    }

    const order = await prisma.order.create({
      data: {
        customerName: customer.nome,
        customerEmail: customer.email,
        customerPhone: customer.telefone || "",
        cep: customer.cep || "",
        endereco: customer.endereco || "",
        numero: customer.numero || "",
        bairro: customer.bairro || "",
        cidade: customer.cidade || "",
        estado: customer.estado || "",
        complemento: customer.complemento || "",
        shippingCarrier: shipping?.carrier || null,
        shippingPrice: shipping?.price || 0,
        shippingDelivery: shipping?.delivery || null,
        discount: discount || 0,
        total,
        preferenceId: preference.id,
        status: "pending",
        items: {
          create: items.map((item: { id: string; name: string; price: number; image: string; size?: string; color?: string; quantity: number }) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image || "",
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity,
          })),
        },
      },
    })

    return NextResponse.json({ preferenceId: preference.id, orderId: order.id, initPoint: preference.init_point })
  } catch (err) {
    console.error("Erro ao criar preferência:", err)
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 })
  }
}
