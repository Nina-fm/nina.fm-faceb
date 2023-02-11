import {
  ConnInfo,
  Handler,
  serve,
} from "https://deno.land/std@0.131.0/http/server.ts";

// Local
import { corsHeaders } from "../_shared/cors.ts";

console.log("Setting up localdev function...");

const handlers = {
  authors: await import("../authors/handler.ts").then((it) => it.handler),
  mixtapes: await import("../mixtapes/handler.ts").then((it) => it.handler),
  tags: await import("../tags/handler.ts").then((it) => it.handler),
  metadata: await import("../metadata/handler.ts").then((it) => it.handler),
} as Record<string, Handler>;

function localdevHandler(req: Request, connInfo: ConnInfo) {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders });
  }
  // console.log(`${req.method} ${req.url}`);
  const url = new URL(req.url);
  const urlParts = url.pathname.split("/");
  const handlerName = urlParts[urlParts.length - 1];
  const handler = handlers[handlerName];
  try {
    return handler(req, connInfo);
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
}

serve(localdevHandler);

console.log("Listening on http://localhost:8000/");
