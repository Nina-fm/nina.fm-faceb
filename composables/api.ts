import queryString, { StringifiableRecord } from "query-string";

export enum Methods {
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
}

export interface ApiOptions {
  query?: StringifiableRecord | undefined;
  body?: Obj;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useSupabaseToken();
  const url = config.public.supabase.url;
  const apikey = config.public.supabase.key;

  const call = async (path: string, method?: Methods, options?: ApiOptions) =>
    await $fetch(
      queryString.stringifyUrl({
        url: path,
        query: options?.query,
      }),
      {
        method: method ?? Methods.GET,
        baseURL: `${url}/functions/v1`,
        headers: {
          apikey,
          Authorization: `Bearer ${token.value}`,
        },
        ...(options?.body ?? {}),
      }
    );

  const callGet = async (path: string, options?: ApiOptions) =>
    await call(path, Methods.GET, options);

  const callPost = async (path: string, options?: ApiOptions) =>
    await call(path, Methods.POST, options);

  const callPut = async (path: string, options?: ApiOptions) =>
    await call(path, Methods.PUT, options);

  const callPatch = async (path: string, options?: ApiOptions) =>
    await call(path, Methods.PATCH, options);

  const callDelete = async (path: string, options?: ApiOptions) =>
    await call(path, Methods.DELETE, options);

  return {
    post: callPost,
    get: callGet,
    put: callPut,
    patch: callPatch,
    delete: callDelete,
  };
};
