// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { getParam, queryResponse } from "../_shared/utils.ts";

import { AuthorsService } from "../_services/authors.ts";
import { Method } from "../_types/api.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("▶︎ Authors Functions");

export async function handler(req: Request) {
  // Define services
  const _authors = new AuthorsService(req.headers);

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === Method.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  // Get the request params (query string)
  const id = getParam<number>("id", req.url);
  const name = getParam<string>("name", req.url);

  return await queryResponse(async () => {
    switch (req.method) {
      case Method.POST: {
        /**
         * Create new author
         */
        const { data: postData } = await req.json();
        console.log("[POST] /authors", postData);
        const {
          avatar_url: _avatar_url,
          position: _position,
          ...data
        } = _authors.validateData(postData);
        return await _authors.create(data);
      }
      case Method.PATCH: {
        if (id) {
          /**
           * Update an author by ID
           */
          const { data: postData } = await req.json();
          console.log(`[PATCH] /authors?id=${id}`, postData);
          const {
            avatar_url: _avatar_url,
            position: _position,
            ...data
          } = _authors.validateData(postData);
          return _authors.update(id, data);
        }
        break;
      }
      case Method.DELETE: {
        if (id) {
          /**
           * Delete an author by ID
           */
          console.log(`[DELETE] /authors?id=${id}`);
          return await _authors.delete(id);
        }
        break;
      }
      default:
      case Method.GET: {
        if (id) {
          /**
           * Find an author by ID
           */
          console.log(`[GET] /authors?id=${id}`);
          return await _authors.findByID(id);
        }
        if (name) {
          /**
           * Find an tag by name
           */
          console.log(`[GET] /authors?name=${name}`);
          return await _authors.findByName(name);
        }
        /**
         * Find all authors
         */
        console.log("[GET] /authors");
        return await _authors.findAll();
      }
    }
  });

  // return new Response("No route match", { headers: corsHeaders, status: 400 });
}
