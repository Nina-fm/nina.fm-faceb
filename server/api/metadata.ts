import { log } from "~~/utils/console"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const authors = String(query?.authors)
  const name = String(query?.name)
  const queryParams = {
    authors,
    name,
  }
  const metadataUrl = `${config.public.supabase.functionsUrl}/metadata`

  return new Promise(async (resolve, reject) => {
    try {
      log("METADATA API CALL", queryParams)
      const result = await $fetch(metadataUrl, {
        query: queryParams,
        mode: "no-cors",
        headers: {
          Authorization: `Bearer ${config.public.supabase.key}`,
        },
      })
      log({ result })
      resolve(result)
    } catch (error) {
      log({ error })
      reject(error)
    }
  })
})
