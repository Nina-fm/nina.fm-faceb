// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (...params: any) => {
  const config = useRuntimeConfig()
  if (process.env.NODE_ENV === "development" && config.debug) {
    console.log(...params)
  }
}
