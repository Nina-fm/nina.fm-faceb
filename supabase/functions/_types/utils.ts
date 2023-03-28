export type Primitive = string | number | symbol

export type Obj = Record<Primitive, unknown>
export type ObjectOf<T extends unknown> = Record<Primitive, T>

export type ObjectType = Obj | Record<never, never>

// deno-lint-ignore no-explicit-any
export type AnyFn = (...args: any) => any

export type Entry<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T]

export type Join<L extends Primitive | undefined, R extends Primitive | undefined> = L extends string | number
  ? R extends string | number
    ? `${L}.${R}`
    : L
  : R extends string | number
  ? R
  : undefined

export type Union<L extends unknown | undefined, R extends unknown | undefined> = L extends undefined
  ? R extends undefined
    ? undefined
    : R
  : R extends undefined
  ? L
  : L | R

export type Rename<T, U> = {
  [K in keyof U as K extends keyof T ? (T[K] extends string ? T[K] : never) : K]: K extends keyof U ? U[K] : never
}

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedPaths<
  T extends Obj,
  Prev extends Primitive | undefined = undefined,
  Path extends Primitive | undefined = undefined
> = {
  [K in keyof T]: T[K] extends Obj
    ? NestedPaths<T[K], Union<Prev, Path>, Join<Path, K>>
    : Union<Union<Prev, Path>, Join<Path, K>>
}[keyof T]

/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
export type TypeFromPath<
  T extends Obj,
  Path extends string // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends Obj
      ? TypeFromPath<T[P], S>
      : never
    : never
}[Path]

export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S

export type SnakeToCamelCaseObjKeys<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: T[K]
    }
  : T

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S

export type CamelToSnakeCaseObjKeys<T> = T extends object
  ? {
      [K in keyof T as CamelToSnakeCase<K & string>]: T[K]
    }
  : T

export type AsConstEnum<T> = {
  [K in keyof T]: K
}
