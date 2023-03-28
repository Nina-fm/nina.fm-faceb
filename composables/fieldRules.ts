export const useFieldRules = () => {
  return {
    min2Char: (v: string) => v?.length >= 2 || "Doit comporter au moins 2 caractères",
    eq4Chars: (v: string) => v?.length === 4 || "Doit comporter 4 caractères",
  }
}
