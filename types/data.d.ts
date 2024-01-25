import { VDataTableRow } from "vuetify/lib/components/index.mjs"

declare global {
  type VDataTableRow = InstanceType<typeof VDataTableRow>
}

export {}
