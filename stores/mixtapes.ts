import { MixtapeExt, MixtapeParamsExt, ObjectOf, Tag } from "~~/types/supatypes"

export const useMixtapesStore = defineStore("mixtapes", () => {
  const api = useApi()
  const { process } = useProcess({ loadingKey: "mixtapes" })
  const data = ref<MixtapeExt[]>([])
  const index = ref<ObjectOf<MixtapeExt>>()

  // List query params
  const search = ref(null)
  const tagFilters = ref<number[]>([])
  const itemsPerPage = ref(25)
  const page = ref(1)

  watch(tagFilters, (value, prevValue) => {
    page.value = 1
  })

  const resetSearch = () => (search.value = null)
  const resetTagFilters = () => tagFilters.value.splice(0, tagFilters.value.length)

  const toggleTagFilter = (tag: Tag) => {
    const index = tagFilters.value.findIndex((id) => id === tag.id)
    if (index >= 0) {
      tagFilters.value.splice(index, 1)
    } else {
      tagFilters.value.push(tag.id)
    }
  }

  const fetchMixtapes = async () =>
    await process(async () => {
      const result = await api.get(`/mixtapes`)
      data.value = result as MixtapeExt[]
      index.value = (result as MixtapeExt[]).reduce((r, m) => ({ ...r, [m.id]: m }), {})
    })

  const loadMixtapeById = async (mixtapeId: string | number) =>
    await process(async () => {
      const id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId)
      const result = await api.get(`/mixtapes`, {
        query: {
          id,
        },
      })
      index.value = { ...index.value, [mixtapeId]: result as MixtapeExt }
    })

  const getById = async (mixtapeId: string | number) => {
    const id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId)
    if (!index.value?.[id]) {
      await loadMixtapeById(id)
    }

    return index.value?.[id]
  }

  const createMixtape = async (
    mixtapeData: MixtapeParamsExt,
    options?: {
      withMessages?: boolean
    }
  ) =>
    await process(
      async () => {
        const result = (await api.post(`/mixtapes`, {
          body: { data: mixtapeData },
        })) as MixtapeExt
        data.value = [...data.value, result]
        index.value = { ...index.value, [result.id]: result }
        return result
      },
      {
        successMsg: `Merci d'avoir ajouté ${mixtapeData.name} !`,
        withMessages: options?.withMessages ?? true,
      }
    )

  const updateMixtape = async (
    mixtapeId: string | number,
    { cover_url, authors_text, ...mixtapeData }: MixtapeParamsExt
  ) =>
    await process(
      async () => {
        const result = (await api.patch(`/mixtapes`, {
          query: { id: mixtapeId },
          body: {
            data: mixtapeData,
          },
        })) as MixtapeExt
        data.value = [...data.value.filter((a) => a.id !== mixtapeId), result]
        index.value = { ...index.value, [mixtapeId]: result }
        return result
      },
      { successMsg: `Merci d'avoir mis ${mixtapeData.name} à jour !` }
    )

  const deleteMixtape = async (mixtapeId: string | number) =>
    await process(
      async () => {
        const result = await api.delete(`/mixtapes`, {
          query: { id: mixtapeId },
        })
        return result
      },
      { successMsg: "Merci d'avoir fait du ménage !" }
    )

  const filteredData = computed(() =>
    data.value.filter((m: MixtapeExt) => {
      if (tagFilters.value.length) {
        return tagFilters.value.reduce((acc: boolean, id: number) => {
          const isMatching = m.tags.reduce(
            (match: boolean, mixtapeTag: Tag) => (mixtapeTag.id === id ? true : match),
            false
          )
          return !isMatching ? false : acc
        }, true)
      }
      return true
    })
  )

  return {
    data,
    filteredData,
    index,
    fetchMixtapes,
    createMixtape,
    updateMixtape,
    deleteMixtape,
    getById,
    search,
    tagFilters,
    itemsPerPage,
    page,
    resetSearch,
    resetTagFilters,
    toggleTagFilter,
  }
})

export const useMixtapesStoreRefs = () => storeToRefs(useMixtapesStore())

if (import.meta.hot) {
  // @ts-expect-error it's ok
  import.meta.hot.accept(acceptHMRUpdate(useMixtapesStore, import.meta.hot))
}
