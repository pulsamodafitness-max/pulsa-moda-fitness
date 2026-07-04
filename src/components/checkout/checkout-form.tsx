"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface CustomerData {
  nome: string
  email: string
  telefone: string
  cep: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  complemento: string
}

interface CheckoutFormProps {
  data: CustomerData
  onChange: (data: CustomerData) => void
  onCepChange?: (cep: string) => void
}

export function CheckoutForm({ data, onChange, onCepChange }: CheckoutFormProps) {
  const [loadingCep, setLoadingCep] = useState(false)

  function update(field: keyof CustomerData, value: string) {
    onChange({ ...data, [field]: value })
  }

  async function handleCep(value: string) {
    const cep = value.replace(/\D/g, "")
    update("cep", cep)
    onCepChange?.(cep)
    if (cep.length !== 8) return

    setLoadingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const endereco = await res.json()
      if (!endereco.erro) {
        onChange({
          ...data,
          cep,
          endereco: endereco.logradouro || data.endereco,
          bairro: endereco.bairro || data.bairro,
          cidade: endereco.localidade || data.cidade,
          estado: endereco.uf || data.estado,
        })
      }
    } catch {
    } finally {
      setLoadingCep(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Dados do Cliente</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input
            id="nome"
            value={data.nome}
            onChange={(e) => update("nome", e.target.value)}
            placeholder="Seu nome"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            value={data.telefone}
            onChange={(e) => update("telefone", e.target.value)}
            placeholder="(75) 99855-8567"
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold pt-2">Endereço de Entrega</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 space-y-2">
          <Label htmlFor="cep">CEP *</Label>
          <Input
            id="cep"
            value={data.cep}
            onChange={(e) => handleCep(e.target.value)}
            placeholder="00000-000"
            maxLength={8}
          />
          {loadingCep && (
            <p className="text-xs text-muted-foreground">Buscando endereço...</p>
          )}
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="endereco">Endereço *</Label>
          <Input
            id="endereco"
            value={data.endereco}
            onChange={(e) => update("endereco", e.target.value)}
            placeholder="Rua, Avenida..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero">Número *</Label>
          <Input
            id="numero"
            value={data.numero}
            onChange={(e) => update("numero", e.target.value)}
            placeholder="123"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro *</Label>
          <Input
            id="bairro"
            value={data.bairro}
            onChange={(e) => update("bairro", e.target.value)}
            placeholder="Seu bairro"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade *</Label>
          <Input
            id="cidade"
            value={data.cidade}
            onChange={(e) => update("cidade", e.target.value)}
            placeholder="Sua cidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Input
            id="estado"
            value={data.estado}
            onChange={(e) => update("estado", e.target.value)}
            placeholder="BA"
            maxLength={2}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="complemento">Complemento</Label>
        <Input
          id="complemento"
          value={data.complemento}
          onChange={(e) => update("complemento", e.target.value)}
          placeholder="Apto, Bloco, etc. (opcional)"
        />
      </div>
    </div>
  )
}
