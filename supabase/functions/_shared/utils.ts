import * as queryString from 'https://deno.land/x/querystring@v1.0.2/mod.js'

import { AuthorParamsExt } from '../_types/authors.ts'
import { AnyFn } from '../_types/utils.ts'
import { corsHeaders } from './cors.ts'

export const getParams = (url: string) => {
  const paramBlock = `?${url.split('?')?.[1] ?? ''}`
  return queryString.parse(paramBlock)
}

export const getParam = <T>(param: string, url: string): T | undefined => {
  const params = getParams(url)
  return params?.[param] ? (params[param] as T) : undefined
}

export const respond = (body?: BodyInit | null, status?: number, statusText?: string) => {
  return new Response(body, {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    ...(status ? { status } : {}),
    ...(statusText ? { statusText } : {}),
  })
}

export const queryResponse = async (callback: AnyFn) => {
  try {
    const result = await callback()
    console.log('Response:', 200)
    return respond(JSON.stringify(result), 200)
  } catch (error) {
    if (error.code === 'PGRST116') {
      console.log('Response:', 204)
      return respond(null, 204, 'No content')
    }
    console.log('Response:', 400)
    return respond(JSON.stringify({ error: error.message }), 400)
  }
}

export const handleLocalFileUrl = (url: string) => {
  const regex = /kong:8000/i
  return regex.test(url) ? url.replace(regex, 'localhost:54321') : url
}

export const formatAuthorNames = (authors: AuthorParamsExt[]) =>
  authors.reduce((r, a, i) => {
    const n = typeof a === 'string' ? a : a.name
    return r.concat(!i ? `${n}` : i >= authors.length - 1 ? ` & ${n}` : `, ${n}`)
  }, '')

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}
