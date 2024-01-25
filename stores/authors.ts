import { AuthorExt, AuthorParams, ObjectOf } from "~~/types/supatypes"

export const useAuthorsStore = defineStore("authors", () => {
  const api = useApi()
  const { process } = useProcess({ loadingKey: "authors" })
  const data = ref<AuthorExt[]>([])
  const index = ref<ObjectOf<AuthorExt>>()

  const fetchAuthors = async () =>
    await process(async () => {
      const result = await api.get(`/authors`)
      data.value = result as AuthorExt[]
      index.value = (result as AuthorExt[]).reduce((r, a) => ({ ...r, [a.id]: a }), {})
    })

  const loadAuthorById = async (authorId: string | number) =>
    await process(async () => {
      const id = typeof authorId === "number" ? authorId : Number(authorId)
      const result = await api.get(`/authors`, {
        query: {
          id,
        },
      })
      index.value = { ...index.value, [authorId]: result as AuthorExt }
    })

  const getById = async (authorId: string | number) => {
    const id = typeof authorId === "number" ? authorId : Number(authorId)
    if (!index.value?.[id]) {
      await loadAuthorById(id)
    }

    return index.value?.[id]
  }

  const createAuthor = async (authorData: AuthorParams) =>
    await process(
      async () => {
        const result = (await api.post(`/authors`, {
          body: { data: authorData },
        })) as AuthorExt
        data.value = [...data.value, result]
        index.value = { ...index.value, [result.id]: result }
        return data
      },
      { successMsg: `Merci d'avoir ajouté ${authorData.name} !` }
    )

  const updateAuthor = async (authorId: string | number, authorData: AuthorParams) =>
    await process(
      async () => {
        const result = (await api.patch(`/authors`, {
          query: { id: authorId },
          body: { data: authorData },
        })) as AuthorExt
        data.value = [...data.value.filter((a) => a.id !== authorId), result]
        index.value = { ...index.value, [authorId]: result }
        return data
      },
      { successMsg: `Merci d'avoir mis ${authorData.name} à jour !` }
    )

  const deleteAuthor = async (authorId: string | number) =>
    await process(
      async () => {
        const result = await api.delete(`/authors`, {
          query: { id: authorId },
        })
        return result
      },
      { successMsg: "Merci d'avoir fait du ménage !" }
    )

  return {
    data,
    index,
    fetchAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getById,
  }
})

export const useAuthorsStoreRefs = () => storeToRefs(useAuthorsStore())

if (import.meta.hot) {
  // @ts-expect-error it's ok
  import.meta.hot.accept(acceptHMRUpdate(useAuthorsStore, import.meta.hot))
}
