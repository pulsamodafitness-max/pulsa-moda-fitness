"use client"

import { useState, useRef } from "react"
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react"

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  folder?: string
  label?: string
  accept?: string
}

export default function MultiImageUpload({
  value,
  onChange,
  folder = "produtos",
  label = "Imagens",
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [manualUrl, setManualUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setErrorMsg(null)
    setUploading(true)

    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || `Erro ao enviar ${file.name}`)
        }
        const data = await res.json()
        uploaded.push(data.url)
      } catch (err: any) {
        setErrorMsg(err.message || "Erro ao enviar imagem")
        setUploading(false)
        return
      }
    }

    onChange([...value, ...uploaded])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function handleAddManual() {
    const url = manualUrl.trim()
    if (!url) return
    onChange([...value, url])
    setManualUrl("")
    setErrorMsg(null)
  }

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-[#1a1a1a]">{label}</label>}

      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {value.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e0e0e0] bg-[#f7f7f7] group">
              <img
                src={url}
                alt={`Imagem ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ""
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex items-center gap-2"
      >
        <label className="flex items-center gap-1.5 px-4 py-2 border border-[#e0e0e0] rounded-xl text-sm text-[#666] hover:bg-[#f7f7f7] cursor-pointer transition-colors">
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload size={16} />
              Selecionar arquivos
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <div className="flex-1 flex gap-1">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddManual() } }}
            placeholder="ou cole uma URL externa..."
            className="flex-1 px-3 py-2 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
          />
          <button
            type="button"
            onClick={handleAddManual}
            disabled={!manualUrl.trim()}
            className="px-3 py-2 text-sm border border-[#e0e0e0] rounded-xl text-[#666] hover:bg-[#f7f7f7] disabled:opacity-40 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  )
}