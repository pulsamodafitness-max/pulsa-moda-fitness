import Image from "next/image"

const methods = [
  { name: "Pix", file: "logo-pix-footer.png" },
  { name: "Visa", file: "logo-visa-footer.png" },
  { name: "Mastercard", file: "logo-mastercard-footer.png" },
  { name: "Elo", file: "logo-elo-footer.png" },
  { name: "American Express", file: "logo-american-express-footer.png" },
  { name: "Hipercard", file: "logo-hipercard-footer.png" },
  { name: "Diners Club", file: "logo-dc-footer.png" },
]

export function PaymentMethods() {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a5a5] mb-4">
        Formas de pagamento
      </h4>
      <div className="flex flex-nowrap justify-between gap-1 w-full">
        {methods.map((m) => (
          <Image
            key={m.name}
            src={`/images/payment/${m.file}`}
            alt={m.name}
            width={48}
            height={30}
            className="h-7 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  )
}
