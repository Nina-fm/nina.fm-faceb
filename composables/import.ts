import {
  AuthorParams,
  CoverFile,
  MixtapeParamsExt,
  TagParams,
  TrackParams,
} from "~~/types/supatypes";

import uniqid from "uniqid";

interface PreviousTrack {
  position: number | null;
  artist: string | null;
  title: string | null;
  start_hours?: string;
  start_minutes?: string;
  start_seconds?: string;
}
interface PreviousMixtape {
  id: string | null;
  type?: string | null;
  artist: string | null;
  title: string | null;
  year?: string | null;
  tags?: string[];
  comments?: string | null;
  cover?: string | null;
  text_tracks?: string | null;
  tracks?: PreviousTrack[];
}

export const useImport = (params?: { init?: boolean }) => {
  const { loadingOn, loadingOff, setLoadingPercent } = useLoadingStore();
  const { fetchTags } = useTagsStore();
  const { fetchAuthors } = useAuthorsStore();
  const { createMixtape } = useMixtapesStore();

  const { data: tags } = storeToRefs(useTagsStore());
  const json = ref<Object[]>([]);
  const urlToImport = ref<string | null>(null);
  const keysImported = ref<string[]>([]);
  const keysNotImported = ref<string[]>([]);

  onMounted(() => {
    if (params?.init ?? true) {
      fetchAuthors();
      fetchTags();
    }
  });

  const parseAuthors = (value: string | null): AuthorParams[] => {
    if (!value) return [];
    const names = findAuthorNames(value ?? "");
    return names.map((name) => ({ name }));
  };

  const parseTags = (names: string[], toConcat?: TagParams[]): TagParams[] =>
    names
      .map((name) => {
        const tag = tags.value.find((t) => t.name === name);
        return tag ?? { name };
      })
      .concat(toConcat ?? []);

  const parseTracks = (values: PreviousTrack[]): TrackParams[] =>
    values.map(({ start_hours, start_minutes, start_seconds, ...rest }) => {
      let start_at = null;
      if (start_minutes && start_seconds) {
        start_at = `${start_hours?.padStart(2, "0")}:${start_minutes.padStart(
          2,
          "0"
        )}:${start_seconds.padStart(2, "0")}`;
      }
      return {
        ...rest,
        start_at,
      };
    });

  const parseTracksText = (text: string | null): TrackParams[] => {
    if (text) {
      const lines: string[] = text?.split(/\r?\n/) ?? [];
      const tracks: TrackParams[] = lines.map((line, i) => {
        const infos = /(\d+)\s(.*)\s:\s(.*)/g.exec(line);
        return {
          position: i,
          artist: infos?.[2],
          title: infos?.[3],
        };
      });
      return tracks;
    }
    return [];
  };

  const parseCover = async (
    value: string | null
  ): Promise<CoverFile | undefined> => {
    const url = `${urlToImport.value}/${value}`;
    if (await isValidImageUrl(url)) {
      const path = url.split("/");
      const data = await getDataFromUrl(url);
      const filename = data ? path[path.length - 1] : null;
      return { filename, data };
    }
    return { data: null, filename: null };
  };

  const createMixtapeModel = async (
    item: PreviousMixtape
  ): Promise<MixtapeParamsExt> => ({
    key: uniqid(),
    name: item.title ?? null,
    year: item.year ?? null,
    comment: item.comments ?? null,
    authors_text: item.artist ?? null,
    authors: parseAuthors(item.artist),
    tracks_text: item.text_tracks ?? null,
    tracks: item.tracks?.length
      ? parseTracks(item.tracks)
      : parseTracksText(item.text_tracks ?? null),
    tags: parseTags(item.tags ?? [], [
      ...(item.text_tracks ? [{ name: "use_text_tracks" }] : []),
      ...(!item.year ? [{ name: "has_no_year" }] : []),
    ]),
    cover: null,
    cover_url: null,
    cover_file: await parseCover(item.cover ?? null),
  });

  const fetchFromUrl = async (url: string) => {
    loadingOn(0);
    urlToImport.value = url.replace(/\/$/, "");
    const res = await $fetch(url, { headers: cspHeaders });
    const previous: PreviousMixtape[] = JSON.parse(res as string);
    const data = previous; //.slice(310, 321);
    json.value = data;
    const mixtapes: MixtapeParamsExt[] = await Promise.all(
      data.map(async (item, index) => {
        const createdMixtape = await createMixtapeModel(item);
        setLoadingPercent(getPercent(index, data.length));
        return createdMixtape;
      })
    );
    loadingOff();
    console.log({ mixtapes });
    return mixtapes;
  };

  const importData = async (data: MixtapeParamsExt[]) => {
    loadingOn(0);

    const response = await data.reduce(
      async (acc, { key, ...value }, index) => {
        const resultsObject = await acc;
        try {
          const { data: mixtapeData, error } = await createMixtape(value, {
            withMessages: false,
          });
          setLoadingPercent(getPercent(index, data.length));
          if (error) throw error;
          keysImported.value.push(key);
          return {
            ...resultsObject,
            results: [...resultsObject.results, mixtapeData],
          };
        } catch (error) {
          keysNotImported.value.push(key);
          return {
            ...resultsObject,
            errors: [...resultsObject.errors, error],
          };
        }
      },
      Promise.resolve({
        results: [],
        errors: [],
      })
    );
    console.log({ response });

    loadingOff();
    return response;
  };

  return {
    json,
    keysImported,
    keysNotImported,
    fetchFromUrl,
    parseTracksText,
    parseAuthors,
    importData,
  };
};
