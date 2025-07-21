import type { Prisma } from '@prisma/client'

type JsonValue = Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue

export const jsonArraySync = (newValue?: JsonValue, existingValue?: JsonValue | null) => {
  console.log('jsonArraySync called with:', { newValue, existingValue })
  if (!newValue) {
    if (Array.isArray(existingValue) && !!existingValue?.length) {
      return []
    }
  } else {
    return newValue
  }
}
