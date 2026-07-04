"use client"

import { useState, useRef } from "react"
import { Upload, Trash2, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  accept?: string
}

export default function ImageUpload({
  value,
  onChange,
  folder = "produtos",
  label = "Imagem",
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMsg(null)
    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    setUploading(true)
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Erro ao fazer upload")
      }
      const data = await res.json()
      onChange(data.url)
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao fazer upload")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleClear() {
    onChange("")
    setPreview(null)
  }

  const displayUrl = preview || value

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-[#1a1a1a]">{label}</label>}
      <div className="flex items-start gap-3">
        <div className="w-20 h-20 rounded-xl border border-[#e0e0e0] bg-[#f7f7f7] flex-shrink-0 overflow-hidden">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#ccc]">
              <ImageIcon size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 px-4 py-2 border border-[#e0e0e0] rounded-xl text-sm text-[#666] hover:bg-[#f7f7f7] cursor-pointer transition-colors">
              <Upload size={16} />
              {uploading ? "Enviando..." : "Selecionar arquivo"}
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {value && (
              <button type="button" onClick={handleClear} className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => { onChange(e.target.value); setPreview(null); setErrorMsg(null) }}
            placeholder="ou digite a URL manualmente..."
            className="w-full px-3 py-2 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
          />
          {errorMsg && (
            <p className="text-xs text-red-500">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  )
}
