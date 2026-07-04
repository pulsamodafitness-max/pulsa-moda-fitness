import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface ShippingItem {
  productId: string
  quantity: number
}

export async function POST(request: Request) {
  try {
    const { cep, items } = (await request.json()) as { cep: string; items: ShippingItem[] }

    const digits = cep.replace(/\D/g, "")
    if (digits.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Nenhum produto informado" }, { status: 400 })
    }

    const token = process.env.MELHOR_ENVIO_TOKEN
    const originCep = process.env.STORE_CEP || "44071280"

    if (!token) {
      return NextResponse.json({ error: "Frete indisponível no momento" }, { status: 503 })
    }

    const ids = items.map((i) => i.productId)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: ids }, active: true },
    })

    const dbMap = new Map(dbProducts.map((p) => [p.id, p]))

    const productList = items.map((item) => {
      const product = dbMap.get(item.productId)
      if (!product) return null
      return {
        id: product.id,
        width: product.width,
        height: product.height,
        length: product.length,
        weight: product.weight,
        insurance_value: product.price,
        quantity: item.quantity,
      }
    }).filter(Boolean)

    if (productList.length === 0) {
      return NextResponse.json({ error: "Produtos não encontrados" }, { status: 404 })
    }

    const res = await fetch("https://melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Pulsa Moda Fitness (pulsafitt@gmail.com)",
      },
      body: JSON.stringify({
        from: { postal_code: originCep },
        to: { postal_code: digits },
        products: productList,
        options: { receipt: false, own_hand: false },
        services: "1,2,3,4,17,18",
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Melhor Envio error:", res.status, errText)
      return NextResponse.json({ error: "Erro ao consultar frete" }, { status: 502 })
    }

    const data = await res.json()

    const options = data.map((o: any) => ({
      id: o.id,
      carrier: o.company?.name || o.name,
      service: o.name,
      price: o.custom_price ?? o.price,
      originalPrice: o.price,
      delivery: o.custom_delivery_time ?? o.delivery_time,
      minDate: o.min_date,
      maxDate: o.max_date,
      companyPicture: o.company?.picture,
    }))

    return NextResponse.json({ options })
  } catch (err) {
    console.error("Shipping API error:", err)
    return NextResponse.json({ error: "Erro interno ao calcular frete" }, { status: 500 })
  }
}
