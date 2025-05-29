export const parseDjs = (djsString: string): { name: string; createdAt: Date }[] => {
  if (!djsString) return []

  return djsString
    .split(/[,&]/g)
    .map((dj) => dj.trim())
    .filter((dj) => dj !== '')
    .map((dj) => ({
      name: dj,
      createdAt: new Date(), // Assuming current date for createdAt, adjust as needed
    }))
}
