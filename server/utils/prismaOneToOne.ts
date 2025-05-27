export const oneToOneCreate = (key: string, sibling: any) => {
  return {
    [key]: sibling ? { create: { ...sibling } } : undefined,
  }
}

export const oneToOneSync = (key: string, sibling: any, existingId?: string | number) => {
  return {
    [key]: sibling
      ? {
          upsert: {
            where: { id: existingId },
            create: { ...sibling },
            update: { ...sibling },
          },
        }
      : existingId && !sibling
        ? {
            delete: { id: existingId },
          }
        : undefined,
  }
}
