// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { getParam, queryResponse } from "../_shared/utils.ts";

import { AuthorsService } from "../_services/authors.ts";
import { Method } from "../_types/api.ts";
import { MixtapeParamsExt } from "../_types/mixtapes.ts";
import { MixtapesService } from "../_services/mixtapes.ts";
import { TracksService } from "../_services/tracks.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("=> Mixtapes Functions");

serve((req: Request) => {
  // Define services
  const _mixtapes = new MixtapesService(req.headers);
  const _authors = new AuthorsService(req.headers);
  const _tracks = new TracksService(req.headers);

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
         * Create a new Mixtape
         */
        const { data: postData } = await req.json();
        console.log("[POST] /mixtapes", postData);

        const {
          authors = [],
          tracks = [],
          cover_file,
          cover: _cover,
          cover_url: _cover_url,
          ...data
        } = _mixtapes.validateData(postData);

        // Create the mixtape and upload cover if provided
        const mixtape = await _mixtapes.create({
          ...data,
          cover: cover_file
            ? await _mixtapes.handleFile(cover_file, "covers")
            : null,
        });
        // List all authors and create new ones
        const allAuthors = await Promise.all(
          authors.map(async (author) =>
            typeof author === "string"
              ? await _authors.create({ name: author })
              : author
          )
        );
        // Reduce to authors IDs
        const authorsIds = allAuthors.map((a) => a.id);
        // Add authors to mixtape
        await _mixtapes.addAuthors(mixtape.id, authorsIds);
        // Create tracks and add to mixtape
        await _tracks.createForMixtape(mixtape.id, tracks);
        // Return the full mixtape
        return await _mixtapes.find(mixtape.id);
      }
      case Method.PATCH: {
        if (id) {
          /**
           * Update a mixtape by ID
           */
          const { data: postData }: { data: MixtapeParamsExt } =
            await req.json();
          console.log(`[PATCH] /mixtapes?id=${id}`, postData);

          const {
            authors = [],
            tracks = [],
            cover_file,
            cover: _cover,
            cover_url: _cover_url,
            ...data
          } = _mixtapes.validateData(postData);

          // Update the mixtape and upload cover if provided
          await _mixtapes.update(id, {
            ...data,
            cover: cover_file
              ? await _mixtapes.handleFile(cover_file, "covers")
              : null,
          });
          // List all authors and create new ones
          const allAuthors = await Promise.all(
            authors.map(async (author) =>
              typeof author === "string"
                ? await _authors.create({ name: author })
                : author
            )
          );
          // Reduce to authors ids
          const authorsIds = allAuthors.map((a) => a.id);
          // Update mixtape authors
          await _mixtapes.updateAuthors(id, authorsIds);
          // Update mixtape tracks
          await _tracks.updateForMixtape(id, tracks);
          // Return the full mixtape
          return await _mixtapes.find(id);
        }
        break;
      }
      case Method.DELETE: {
        if (id) {
          /**
           * Delete a mixtape by ID
           */
          console.log(`[DELETE] /mixtapes?id=${id}`);
          await _mixtapes.delete(id);
          return { deleted: id };
        }
        break;
      }
      default:
      case Method.GET: {
        if (id) {
          /**
           * Find a mixtape by ID
           */
          console.log(`[GET] /mixtapes?id=${id}`);
          return await _mixtapes.find(id);
        }
        /**
         * Find all mixtapes
         */
        console.log("[GET] /mixtapes");
        return await _mixtapes.findAll();
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
