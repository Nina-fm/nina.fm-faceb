type ValuesOfArray<T extends ReadonlyArray<unknown>> = T[number]

type ToObj<K extends string> = {
  [P in K]: P
}

export const toPseudoEnum = <T extends readonly string[], K extends ValuesOfArray<T>>(arr: T): Readonly<ToObj<K>> => {
  return arr.reduce((acc, elem) => {
    return {
      ...acc,
      [elem]: elem,
    }
  }, {} as ToObj<K>)
}
