// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Method } from "../_types/api.ts"
import { MixtapesService } from "../_services/mixtapes.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { getParam } from "../_shared/utils.ts"
import { queryResponse } from "../_shared/utils.ts"

console.log("▶︎ Metadata Functions")

export async function handler(req: Request) {
  const _mixtapes = new MixtapesService(req.headers)

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === Method.OPTIONS) {
    return new Response("ok", { headers: corsHeaders })
  }

  // Get the request params (query string)
  const authors = getParam<string>("authors", req.url)
  const name = getParam<string>("name", req.url)

  return await queryResponse(async () => {
    switch (req.method) {
      case Method.GET: {
        if (authors && name) {
          /**
           * Find a mixtape by author and
           */
          console.log(`[GET] /metadata?authors=${authors}&name=${name}`)
          return await _mixtapes.findByInfos({ authors, name })
        }
        break
      }
      default: {
        throw new Error("No route match")
      }
    }
  })
}
