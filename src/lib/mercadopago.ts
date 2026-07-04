import { MercadoPagoConfig, Preference } from "mercadopago"
import type { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export const preferenceClient = new Preference(client)

export type { PreferenceCreateData }
