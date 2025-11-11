import queryString, { StringifiableRecord } from "query-string"

import { Obj } from "~~/types/supatypes"

export enum Methods {
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
}

export interface ApiOptions {
  query?: StringifiableRecord | undefined
  body?: Obj
}

// Declare global constants defined in vite.define
declare const __SUPABASE_KEY__: string
declare const __SUPABASE_FUNCTIONS_URL__: string

export const useApi = () => {
  const { token } = useAuthStoreRefs()
  const apikey = __SUPABASE_KEY__ || ""
  const baseURL = __SUPABASE_FUNCTIONS_URL__ || ""

  const call = async (path: string, method?: Methods, options?: ApiOptions) => {
    if (!token.value) {
      return navigateTo("/login")
    }

    return await $fetch(
      queryString.stringifyUrl({
        url: path,
        query: options?.query,
      }),
      {
        method: method ?? Methods.GET,
        baseURL,
        headers: {
          apikey,
          ...(!!token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
        body: options?.body ?? null,
      }
    )
  }

  const callGet = async (path: string, options?: ApiOptions) => await call(path, Methods.GET, options)

  const callPost = async (path: string, options?: ApiOptions) => await call(path, Methods.POST, options)

  const callPut = async (path: string, options?: ApiOptions) => await call(path, Methods.PUT, options)

  const callPatch = async (path: string, options?: ApiOptions) => await call(path, Methods.PATCH, options)

  const callDelete = async (path: string, options?: ApiOptions) => await call(path, Methods.DELETE, options)

  return {
    post: callPost,
    get: callGet,
    put: callPut,
    patch: callPatch,
    delete: callDelete,
  }
}
