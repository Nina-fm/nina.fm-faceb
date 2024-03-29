// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { getParam, queryResponse } from "../_shared/utils.ts"

import { AuthorsService } from "../_services/authors.ts"
import { Method } from "../_types/api.ts"
import { MixtapeParamsExt } from "../_types/mixtapes.ts"
import { MixtapesService } from "../_services/mixtapes.ts"
import { TracksService } from "../_services/tracks.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("▶︎ Mixtapes Functions")

export async function handler(req: Request) {
  // Define services
  const _mixtapes = new MixtapesService(req.headers)
  const _authors = new AuthorsService(req.headers)
  const _tracks = new TracksService(req.headers)

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === Method.OPTIONS) {
    return new Response("ok", { headers: corsHeaders })
  }

  // Get the request params (query string)
  const id = getParam<number>("id", req.url)

  return await queryResponse(async () => {
    switch (req.method) {
      case Method.POST: {
        /**
         * Create a new Mixtape
         */
        const { data: postData } = await req.json()
        console.log("[POST] /mixtapes", postData)

        const {
          authors = [],
          tags = [],
          tracks = [],
          cover_file,
          cover: _cover,
          cover_url: _cover_url,
          ...data
        } = _mixtapes.validateData(postData)

        const mixtape = await _mixtapes.create({
          ...data,
          cover: cover_file ? await _mixtapes.handleFile(cover_file, "covers") : null,
        })
        await _mixtapes.addAuthors(mixtape.id, authors)
        await _mixtapes.addTags(mixtape.id, tags)
        await _tracks.createForMixtape(mixtape.id, tracks)
        return await _mixtapes.find(mixtape.id)
      }
      case Method.PATCH: {
        if (id) {
          /**
           * Update a mixtape by ID
           */
          const { data: postData }: { data: MixtapeParamsExt } = await req.json()
          console.log(`[PATCH] /mixtapes?id=${id}`, postData)

          const {
            authors = [],
            tags = [],
            tracks = [],
            cover_file,
            cover: _cover,
            cover_url: _cover_url,
            ...data
          } = _mixtapes.validateData(postData)

          // Update the mixtape and upload cover if provided
          await _mixtapes.update(id, {
            ...data,
            cover: cover_file ? await _mixtapes.handleFile(cover_file, "covers") : null,
          })

          // Update mixtape authors
          await _mixtapes.updateAuthors(id, authors)
          // Update mixtape tags
          await _mixtapes.updateTags(id, tags)
          // Update mixtape tracks
          await _tracks.updateForMixtape(id, tracks)
          // Return the full mixtape
          return await _mixtapes.find(id)
        }
        break
      }
      case Method.DELETE: {
        if (id) {
          /**
           * Delete a mixtape by ID
           */
          console.log(`[DELETE] /mixtapes?id=${id}`)
          return await _mixtapes.delete(id)
        }
        break
      }
      default:
      case Method.GET: {
        if (id) {
          /**
           * Find a mixtape by ID
           */
          console.log(`[GET] /mixtapes?id=${id}`)
          return await _mixtapes.find(id)
        }
        /**
         * Find all mixtapes
         */
        console.log("[GET] /mixtapes")
        return await _mixtapes.findAll()
      }
    }
  })

  // return new Response("No route match", { headers: corsHeaders, status: 400 });
}
