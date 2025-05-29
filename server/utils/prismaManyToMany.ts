export const manyToManySync = (key: string, siblings?: any[], existingSiblings?: any[], matchingKey?: string) => {
  const disconnectedSiblings = existingSiblings?.filter(
    (existingSibling) => !siblings?.some((sibling) => sibling.id === existingSibling.id),
  )

  return {
    [key]: {
      ...(siblings?.length
        ? {
            connectOrCreate: siblings.map((sibling) => ({
              where: { [matchingKey ?? 'id']: sibling?.[matchingKey ?? 'id'] ?? '' },
              create: { ...sibling },
            })),
          }
        : {}),
      disconnect: disconnectedSiblings?.length
        ? disconnectedSiblings.map((sibling) => ({ [matchingKey ?? 'id']: sibling[matchingKey ?? 'id'] }))
        : undefined,
    },
  }
}
