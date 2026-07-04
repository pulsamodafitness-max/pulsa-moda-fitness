import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email } = (await request.json()) as { name: string; email: string }

    if (!name || !email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const listId = process.env.BREVO_LIST_ID
    const listIdNum = listId ? Number(listId) : NaN

    if (!apiKey || isNaN(listIdNum)) {
      console.warn("Brevo not configured — skipping API call")
      return NextResponse.json({ ok: true, note: "not configured" })
    }

    const res = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attributes: { FIRSTNAME: name },
        listIds: [listIdNum],
        updateEnabled: true,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Brevo error:", res.status, text)
      return NextResponse.json({ error: "Erro ao cadastrar na newsletter" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Newsletter API error:", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
