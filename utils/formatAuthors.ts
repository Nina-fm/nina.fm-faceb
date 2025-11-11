export interface AuthorLike {
  name?: string | null
  [key: string]: unknown
}

/**
 * Format a list of authors into a readable string
 * Example: ["John", "Jane", "Bob"] => "John, Jane & Bob"
 */
export const formatAuthorNames = (authors: (AuthorLike | string)[]): string => {
  if (!Array.isArray(authors)) {
    return ""
  }

  return authors.reduce<string>((result, author, index) => {
    const name = typeof author === "string" ? author : author.name

    if (index === 0) {
      return `${name}`
    } else if (index >= authors.length - 1) {
      return `${result} & ${name}`
    } else {
      return `${result}, ${name}`
    }
  }, "")
}
