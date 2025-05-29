type ValuesOfArray<T extends ReadonlyArray<any>> = T[number]

type ToObj<K extends string> = {
  [P in K]: P
}

export const toPseudoEnum = <T extends readonly any[], K extends ValuesOfArray<T>>(arr: T): Readonly<ToObj<K>> => {
  return arr.reduce((acc, elem) => {
    return {
      ...acc,
      [elem]: elem,
    }
  }, {})
}
