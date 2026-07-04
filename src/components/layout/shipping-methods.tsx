import Image from "next/image"

const carriers = [
  { name: "Correios", file: "logo-correios-footer.png" },
  { name: "Transportadora", file: "logo-transportadoras-footer.png" },
]

export function ShippingMethods() {
  return (
    <div className="mt-6">
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a5a5] mb-4">
        Forma de Entrega
      </h4>
      <div className="flex flex-wrap gap-2">
        {carriers.map((c) => (
          <Image
            key={c.name}
            src={`/images/shipping/${c.file}`}
            alt={c.name}
            width={48}
            height={30}
            className="h-7 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  )
}
