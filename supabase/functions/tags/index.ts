// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { getParam, queryResponse } from "../_shared/utils.ts";

import { Method } from "../_types/api.ts";
import { TagsService } from "../_services/tags.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("=> Tags Functions");

serve((req: Request) => {
  // Define services
  const _tags = new TagsService(req.headers);

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === Method.OPTIONS) {
    return new Response("ok", { headers: corsHeaders });
  }

  // Get the request params (query string)
  const id = getParam<number>("id", req.url);
  const name = getParam<string>("name", req.url);

  return queryResponse(async () => {
    switch (req.method) {
      case Method.POST: {
        /**
         * Create new tag
         */
        const { data: postData } = await req.json();
        console.log("[POST] /tags", postData);
        const data = _tags.validateData(postData);
        return await _tags.create(data);
      }
      case Method.PATCH: {
        if (id) {
          /**
           * Update an tag by ID
           */
          const { data: postData } = await req.json();
          console.log(`[PATCH] /tags?id=${id}`, postData);
          const data = _tags.validateData(postData);
          return _tags.update(id, data);
        }
        break;
      }
      case Method.DELETE: {
        if (id) {
          /**
           * Delete an tag by ID
           */
          console.log(`[DELETE] /tags?id=${id}`);
          return await _tags.delete(id);
        }
        break;
      }
      default:
      case Method.GET: {
        if (id) {
          /**
           * Find an tag by ID
           */
          console.log(`[GET] /tags?id=${id}`);
          return await _tags.findByID(id);
        }
        if (name) {
          /**
           * Find an tag by name
           */
          console.log(`[GET] /tags?name=${name}`);
          return await _tags.findByName(name);
        }
        /**
         * Find all tags
         */
        console.log("[GET] /tags");
        return await _tags.findAll();
      }
    }
  });

  // return new Response("No route match", { headers: corsHeaders, status: 400 });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Tagization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
