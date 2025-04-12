// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { getParam, queryResponse } from "../_shared/utils.ts"

import { Method } from "../_types/api.ts"
import { ProfilesService } from "../_services/profiles.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("▶︎ Profile Functions")

export async function handler(req: Request) {
  // Define services
  const _profile = new ProfilesService(req.headers)

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === Method.OPTIONS) {
    return new Response("ok", { headers: corsHeaders })
  }

  // Get the request params (query string)
  const id = getParam<string>("id", req.url)
  console.log("handler id", id)

  return await queryResponse(async () => {
    switch (req.method) {
      default:
        break
      case Method.GET: {
        if (id) {
          /**
           * Find a profile by userID
           */
          console.log(`[GET] /profile?id=${id}`)
          return await _profile.findById(id)
        }
        break
      }
    }
  })

  // return new Response("No route match", { headers: corsHeaders, status: 400 });
}
