import { AuthorParams, CoverFile, MixtapeParamsExt, Obj, TagParams, TrackParams } from "~~/types/supatypes"

interface PreviousTrack {
  position: number | null
  artist: string | null
  title: string | null
  start_hours?: string
  start_minutes?: string
  start_seconds?: string
}
interface PreviousMixtape {
  id: string | null
  type?: string | null
  artist: string | null
  title: string | null
  year?: string | null
  tags?: string[]
  comments?: string | null
  cover?: string | null
  text_tracks?: string | null
  tracks?: PreviousTrack[]
}

export const useImport = (params?: { init?: boolean }) => {
  const { loadingOn, loadingOff, incrementLoadingPercent } = useLoadingStore()
  const { fetchTags } = useTagsStore()
  const { fetchAuthors } = useAuthorsStore()
  const { createMixtape } = useMixtapesStore()

  const { data: tags } = useTagsStoreRefs()
  const json = ref<unknown[]>([])
  const urlToImport = ref<string | null>(null)
  const keysImported = ref<string[]>([])
  const keysWithErrors = ref<string[]>([])

  onMounted(() => {
    if (params?.init ?? true) {
      fetchAuthors()
      fetchTags()
    }
  })

  const parseAuthors = (value: string | null): AuthorParams[] => {
    if (!value) return []
    const names = findAuthorNames(value ?? "")
    return names.map((name) => ({ name }))
  }

  const parseTags = (names: string[], toConcat?: string[]): TagParams[] =>
    [...names, ...(toConcat ?? [])].map((name) => {
      const tag = tags.value.find((t) => t.name === name)
      return tag ?? { name }
    })

  const parseTracks = (values: PreviousTrack[]): TrackParams[] =>
    values.map(({ start_hours, start_minutes, start_seconds, ...rest }) => {
      let start_at = null
      if (start_minutes && start_seconds) {
        start_at = `${start_hours?.padStart(2, "0")}:${start_minutes.padStart(2, "0")}:${start_seconds.padStart(
          2,
          "0"
        )}`
      }
      return {
        ...rest,
        start_at,
      }
    })

  const parseTracksText = (text: string | null): TrackParams[] => {
    if (text) {
      const lines: string[] = text?.split(/\r?\n/) ?? []
      /**
       * https://regex101.com/r/48Pf9u/1
       * [<position>]<artist> <separator: [:•-]> <title>[ (<start_at: 00:00:00>)]
       */
      const defaultFormat =
        /(?<position>\d+\s)?(?<artist>.+?)\s+[\:\-\•]\s+(?<title>.*?)(?=$|\s\((?<start_at>\d{2}\:\d{2}:\d{2})\))/

      const items = lines.reduce((res, line, i) => {
        if (defaultFormat.test(line)) {
          const infos = defaultFormat.exec(line)
          return [
            ...res,
            {
              position: i,
              artist: infos?.groups?.artist,
              title: infos?.groups?.title,
              start_at: infos?.groups?.start_at,
            } as TrackParams,
          ]
        }
        return res
      }, [] as TrackParams[])
      return items
    }
    return []
  }

  const parseCover = async (value: string | null): Promise<CoverFile | undefined> => {
    const url = `${urlToImport.value}/${value}`
    if (isValidImageUrl(url)) {
      const path = url.split("/")
      const data = await getDataFromUrl(url)
      const filename = data ? path[path.length - 1] : null
      return { filename, data }
    }
    return { data: null, filename: null }
  }

  const createMixtapeModel = async (item: PreviousMixtape): Promise<MixtapeParamsExt> => ({
    key: uniqid(),
    name: item.title ?? null,
    year: item.year ?? null,
    comment: item.comments ?? null,
    authors_text: item.artist ?? null,
    authors: parseAuthors(item.artist),
    tracks_text: item.text_tracks ?? null,
    tracks: item.tracks?.length ? parseTracks(item.tracks) : parseTracksText(item.text_tracks ?? null),
    tags: parseTags(item.tags ?? [], [
      ...(item.text_tracks && !item.tags?.includes("use_text_tracks") ? ["use_text_tracks"] : []),
      ...(!item.year ? ["has_no_year"] : []),
    ]),
    cover: null,
    cover_url: null,
    cover_file: await parseCover(item.cover ?? null),
  })

  const fetchFromUrl = async (url: string) => {
    loadingOn()
    urlToImport.value = url.replace(/\/$/, "")
    const res = await $fetch(`/api/oldMetadata?url=${url}`)
    const previous = res as PreviousMixtape[]
    const data = previous //.slice(310, 321);
    loadingOn(data.length)
    json.value = data
    const mixtapes: MixtapeParamsExt[] = await Promise.all(
      data.map(async (item) => {
        const createdMixtape = await createMixtapeModel(item)
        incrementLoadingPercent()
        return createdMixtape
      })
    )
    loadingOff()
    return mixtapes
  }

  const importData = async (data: MixtapeParamsExt[]) => {
    loadingOn(data.length)

    const response = await data.reduce(
      async (acc, { key, ...value }) => {
        const resultsObject = await acc
        try {
          const { data: mixtapeData, error } = await createMixtape(value, {
            withMessages: false,
          })
          incrementLoadingPercent()
          if (error) throw error
          keysImported.value.push(key)
          return {
            ...resultsObject,
            results: [...resultsObject.results, mixtapeData],
          }
        } catch (error) {
          keysWithErrors.value.push(key)
          return {
            ...resultsObject,
            errors: [...resultsObject.errors, error],
          }
        }
      },
      Promise.resolve({
        results: [],
        errors: [],
      })
    )

    loadingOff()
    return response
  }

  return {
    json,
    keysImported,
    keysWithErrors,
    fetchFromUrl,
    parseTracksText,
    parseAuthors,
    importData,
  }
}
