"use client"

import { useRef, useState } from "react"
import { Upload, Loader2 } from "lucide-react"

interface ColorUploadProps {
  onUpload: (url: string) => void
}

export default function ColorUpload({ onUpload }: ColorUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "produtos")
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      if (!res.ok) return
      const data = await res.json()
      onUpload(data.url)
    } catch {
      // silent
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="p-2 border border-[#e0e0e0] rounded-xl text-[#666] hover:bg-white transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} className="hidden" />
    </>
  )
}