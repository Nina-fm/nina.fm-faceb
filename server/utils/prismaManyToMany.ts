export const manyToManySync = (key: string, siblings?: any[], existingSiblings?: any[]) => {
  const disconnectedSiblings = existingSiblings?.filter(
    (existingSibling) => !siblings?.some((sibling) => sibling.id === existingSibling.id),
  )

  return {
    [key]: {
      ...(siblings?.length
        ? {
            connectOrCreate: siblings.map((sibling) => ({
              where: { id: sibling?.id ?? '' },
              create: { ...sibling },
            })),
          }
        : {}),
      disconnect: disconnectedSiblings?.length
        ? disconnectedSiblings.map((sibling) => ({ id: sibling.id }))
        : undefined,
    },
  }
}
