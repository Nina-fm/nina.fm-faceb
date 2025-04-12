import { DParams, DType } from "./database.ts"

export type Author = DType<"authors">
export type AuthorParams = DParams<"authors">

export type AuthorExt = Author & {
  avatar_url: string | null
  position: number | null
}
export type AuthorParamsExt = AuthorParams & {
  avatar_url?: string | null
  position?: number | null
}
