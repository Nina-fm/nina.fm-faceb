// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

/// <reference types="../_types/utils.d.ts" />

import * as queryString from "https://deno.land/x/querystring@v1.0.2/mod.js";

import type { DType, ResolveRelationQuery } from "../_types/database.ts";

import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabaseClient.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const authorRelation = `authors(*)`;
const mixtapeAuthorsRelation = `mixtapes_authors(*, authors(*))`;
const tracksRelation = `tracks(*)`;

type WithAuthor = ResolveRelationQuery<typeof authorRelation, "one">;
type WithMixtapeAuthors = ResolveRelationQuery<
  typeof mixtapeAuthorsRelation,
  "many"
>;
type WithTracks = ResolveRelationQuery<typeof tracksRelation, "many">;
type Mixtape = DType<"mixtapes">;
type Author = DType<"authors">;
type MixtapeExt = Mixtape &
  WithMixtapeAuthors &
  WithTracks & {
    cover_url?: string | null;
  };
type AuthorExt = Author &
  WithAuthor & {
    avatar_url?: string | null;
    position?: number | null;
  };

console.log("=> Mixtapes Functions");

const getParams = (url: string) => {
  const paramBlock = `?${url.split("?")?.[1] ?? ""}`;
  return queryString.parse(paramBlock);
};

serve((req: Request) => {
  const supabaseClient = createSupabaseClient(req);

  const formatAuthor = (author: Partial<AuthorExt>) => {
    return {
      ...author,
      avatar_url: author.avatar
        ? supabaseClient.storage.from("avatars").getPublicUrl(author.avatar)
            .data.publicUrl
        : null,
    };
  };

  const formatMixtape = (mixtape: MixtapeExt) => {
    const { mixtapes_authors, cover, ...rest } = mixtape;
    return {
      ...rest,
      cover_url: cover
        ? supabaseClient.storage.from("covers").getPublicUrl(cover).data
            .publicUrl
        : null,
      authors: mixtapes_authors
        ? mixtapes_authors.map(({ authors: author, position }) => {
            return formatAuthor({
              position,
              ...author,
            });
          })
        : [],
      tracks: mixtape.tracks
        ? mixtape.tracks.map(({ id, created_at, mixtape_id, ...track }) => ({
            ...track,
          }))
        : [],
    };
  };

  const queryResponse = async (callback: AnyFn) => {
    try {
      const result = await callback();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
  };

  /**
   * PROCESS
   */

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const params = getParams(req.url);
  const id = params?.id ? Number(params.id) : undefined;

  /**
   * GET mixtape
   * @param id
   */
  if (id) {
    return queryResponse(async () => {
      console.log("Get mixtape", id);
      const { data: mixtape, error } = await supabaseClient
        .from("mixtapes")
        .select(`*, ${mixtapeAuthorsRelation}, ${tracksRelation}`)
        .eq("id", id)
        .single();

      if (error) throw error;

      return formatMixtape(mixtape as MixtapeExt);
    });
  }

  /**
   * GET mixtapes
   */
  return queryResponse(async () => {
    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient
      .from("mixtapes")
      .select(`*, ${mixtapeAuthorsRelation}, ${tracksRelation}`);

    if (error) throw error;

    // console.log({ data });
    return data.map((mixtape) => {
      return formatMixtape(mixtape as MixtapeExt);
    });
  });

  // return new Response("No route match", { headers: corsHeaders, status: 400 });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
