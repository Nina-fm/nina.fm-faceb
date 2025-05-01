export const formattedResponse = (data: any) => {
  return {
    ...data,
    toJSON: () => data,
  }
}
