// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { getParam, queryResponse } from "../_shared/utils.ts";

import { AuthorsService } from "../_services/authors.ts";
import { Method } from "../_types/api.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("=> Authors Functions");

serve((req: Request) => {
  // Define services
  const _authors = new AuthorsService(req.headers);

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === Method.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  // Get the request params (query string)
  const id = getParam<number>("id", req.url);

  return queryResponse(async () => {
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
        /**
         * Find all authors
         */
        console.log("[GET] /authors");
        return await _authors.findAll();
      }
    }
  });

  // return new Response("No route match", { headers: corsHeaders, status: 400 });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
