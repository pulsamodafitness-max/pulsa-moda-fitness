import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    let folder = (formData.get("folder") as string) || "produtos"
    folder = folder.replace(/[^a-zA-Z0-9_-]/g, "")

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Formato não permitido. Use JPG, PNG, WebP ou GIF" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande. Máximo 5MB" }, { status: 400 })
    }

    const url = await uploadToCloudinary(file, folder)
    return NextResponse.json({ url })
  } catch (err) {
    console.error("Erro no upload:", err)
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
  }
}
