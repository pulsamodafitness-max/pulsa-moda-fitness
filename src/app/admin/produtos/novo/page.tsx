"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import ImageUpload from "@/components/admin/ImageUpload"
import MultiImageUpload from "@/components/admin/MultiImageUpload"
import ColorUpload from "@/components/admin/ColorUpload"

interface Category {
  id: string
  name: string
}

interface ColorEntry {
  hex: string
  name: string
  thumb: string
  image: string
}

const SIZE_OPTIONS = ["PP", "P", "M", "G", "GG", "XGG", "Único"]

export default function NovoProduto() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [ref, setRef] = useState("")
  const [description, setDescription] = useState("")
  const [details, setDetails] = useState("")
  const [care, setCare] = useState("")
  const [price, setPrice] = useState("")
  const [comparePrice, setComparePrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState("")
  const [active, setActive] = useState(true)
  const [isNew, setIsNew] = useState(false)
  const [rating, setRating] = useState("")
  const [weight, setWeight] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [length, setLength] = useState("")
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<ColorEntry[]>([])
  const [primaryImage, setPrimaryImage] = useState("")
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/admin/categorias")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  function handleNameChange(val: string) {
    setName(val)
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    }
  }

  function toggleSize(size: string) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  function addColor() {
    setColors([...colors, { hex: "#d4a5a5", name: "", thumb: "", image: "" }])
  }

  function updateColor(index: number, field: keyof ColorEntry, value: string) {
    const updated = [...colors]
    updated[index] = { ...updated[index], [field]: value }
    setColors(updated)
  }

  function removeColor(index: number) {
    setColors(colors.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name || !price || !categoryId) {
      setError("Preencha os campos obrigatórios: Nome, Preço e Categoria")
      return
    }

    setSaving(true)
    try {
      const body = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        ref,
        description,
        details,
        care,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        active,
        categoryId,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isNew,
        rating: rating ? parseFloat(rating) : 0,
        weight: weight ? parseFloat(weight) : 0.5,
        width: width ? parseInt(width, 10) : 20,
        height: height ? parseInt(height, 10) : 15,
        length: length ? parseInt(length, 10) : 20,
        sizes,
        colors: colors.filter((c) => c.name).map(({ hex, name, thumb, image }) => ({ hex, name, thumb, image })),
        image: primaryImage || images[0] || "",
        images,
      }

      const res = await fetch("/api/admin/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Erro ao criar produto")
      }

      router.push("/admin/produtos")
    } catch (err: any) {
      setError(err.message || "Erro ao salvar produto")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produtos"
          className="p-2 rounded-lg text-[#666] hover:bg-[#f0f0f0] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Novo Produto</h1>
          <p className="text-sm text-[#666]">Adicione um novo produto ao catálogo</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm bg-red-50 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-4">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Informações Básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="Nome do produto"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="nome-do-produto"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Ref</label>
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="REF-001"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
              >
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">
                Preço <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="99.90"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Preço Comparativo</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="129.90"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5] resize-none"
              placeholder="Descrição curta do produto"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Detalhes</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5] resize-none"
              placeholder="Detalhes do produto (pode usar markdown)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1a1a1a]">Cuidados</label>
            <textarea
              value={care}
              onChange={(e) => setCare(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5] resize-none"
              placeholder="Instruções de cuidado"
            />
          </div>
        </section>

        {/* Sizes */}
        <section className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-3">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Tamanhos</h2>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <label
                key={size}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${
                  sizes.includes(size)
                    ? "bg-[#d4a5a5]/10 border-[#d4a5a5] text-[#d4a5a5]"
                    : "border-[#e0e0e0] text-[#666] hover:border-[#bbb]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="sr-only"
                />
                {size}
              </label>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1a1a1a]">Cores</h2>
            <button
              type="button"
              onClick={addColor}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#d4a5a5] hover:bg-[#d4a5a5]/10 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Adicionar cor
            </button>
          </div>
          {colors.map((color, i) => (
            <div key={i} className="flex flex-wrap items-end gap-3 p-3 bg-[#f7f7f7] rounded-xl">
              <div className="space-y-1">
                <label className="text-xs text-[#666]">Cor</label>
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColor(i, "hex", e.target.value)}
                  className="w-10 h-10 p-0.5 border border-[#e0e0e0] rounded-lg cursor-pointer"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-[100px]">
                <label className="text-xs text-[#666]">Nome</label>
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => updateColor(i, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30"
                  placeholder="Rosa"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-[140px]">
                <label className="text-xs text-[#666]">Thumb (bolinha)</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={color.thumb}
                    onChange={(e) => updateColor(i, "thumb", e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30"
                    placeholder="URL ou upload"
                  />
                  <ColorUpload
                    onUpload={(url) => updateColor(i, "thumb", url)}
                  />
                </div>
              </div>
              <div className="space-y-1 flex-1 min-w-[140px]">
                <label className="text-xs text-[#666]">Image (foto da cor)</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={color.image}
                    onChange={(e) => updateColor(i, "image", e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30"
                    placeholder="URL ou upload"
                  />
                  <ColorUpload
                    onUpload={(url) => updateColor(i, "image", url)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeColor(i)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-3">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Imagens</h2>
          <ImageUpload
            value={primaryImage}
            onChange={setPrimaryImage}
            folder="produtos"
            label="Imagem Principal"
          />
          <MultiImageUpload
            value={images}
            onChange={setImages}
            folder="produtos"
            label="Imagens Extras"
          />
        </section>

        {/* Extra Fields */}
        <section className="bg-white rounded-xl border border-[#e0e0e0] p-5 space-y-4">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Informações Extras</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="novo, verão, promoção"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Avaliação (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="4.5"
              />
            </div>

            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e0e0e0] text-[#d4a5a5] focus:ring-[#d4a5a5]/30"
                />
                <span className="text-sm font-medium text-[#1a1a1a]">Ativo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e0e0e0] text-[#d4a5a5] focus:ring-[#d4a5a5]/30"
                />
                <span className="text-sm font-medium text-[#1a1a1a]">Produto Novo</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="0.5"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Largura (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Altura (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1a1a1a]">Comprimento (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e0e0e0] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a5a5]/30 focus:border-[#d4a5a5]"
                placeholder="40"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/produtos"
            className="px-5 py-2.5 text-sm border border-[#e0e0e0] rounded-xl text-[#666] hover:bg-[#f7f7f7] transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4a5a5] text-white rounded-xl text-sm font-medium hover:bg-[#c49494] disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {saving ? "Salvando..." : "Salvar Produto"}
          </button>
        </div>
      </form>
    </div>
  )
}
