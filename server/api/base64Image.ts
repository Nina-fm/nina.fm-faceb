import { encode } from "base64-arraybuffer"
import mime from "mime-types"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = String(query?.url)

  return new Promise((resolve) => {
    const mimeType = mime.lookup(url) || ""

    $fetch(url, {
      mode: "no-cors",
      responseType: "arrayBuffer",
      headers: {
        Accept: mimeType,
      },
    })
      .then((result) => {
        const base64 = `data:${mimeType};base64,${encode(result as ArrayBuffer)}`
        resolve(base64)
      })
      .catch(() => {
        resolve(null)
      })
  })
})
