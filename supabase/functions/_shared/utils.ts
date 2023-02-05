import * as queryString from "https://deno.land/x/querystring@v1.0.2/mod.js";

import { AnyFn } from "../_types/utils.ts";
import { AuthorParamsExt } from "../_types/authors.ts";
import { corsHeaders } from "./cors.ts";

export const getParams = (url: string) => {
  const paramBlock = `?${url.split("?")?.[1] ?? ""}`;
  return queryString.parse(paramBlock);
};

export const getParam = <T>(param: string, url: string): T | undefined => {
  const params = getParams(url);
  return params?.[param] ? (params[param] as T) : undefined;
};

export const queryResponse = async (callback: AnyFn) => {
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

export const handleLocalFileUrl = (url: string) =>
  url.replace(/supabase_kong_ninafm-api:8000/i, "localhost:54321");

export const formatAuthorNames = (authors: AuthorParamsExt[]) =>
  authors.reduce(
    (r, a, i) =>
      r.concat(
        !i
          ? `${a.name}`
          : i >= authors.length - 1
          ? ` & ${a.name}`
          : `, ${a.name}`
      ),
    ""
  );

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
