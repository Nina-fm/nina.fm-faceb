import {
  DType,
  ResolveRelationQuery,
} from "~~/supabase/functions/_types/database";

import { ElMessage } from "element-plus";

const mixtapeAuthorsRelation = "mixtapes_authors(*)";

export type MixtapeAuthors = ResolveRelationQuery<
  typeof mixtapeAuthorsRelation,
  "many"
>;
export type Mixtape = DType<"mixtapes">;
export type MixtapeExt = Mixtape & MixtapeAuthors;
export type Author = DType<"authors">;
export type AuthorExt = Author & {
  avatar_url?: string | null;
  mixtape_count?: number | null;
};

export const useMixtapesStore = defineStore("mixtapes", () => {
  const api = useApi();
  const isLoading = ref<boolean>(false);
  const mixtapes = ref<MixtapeExt[]>([]);

  const errorHandler = async (fn: AnyFn) => {
    try {
      isLoading.value = true;
      return await fn();
    } catch (error: any) {
      console.log(error);
      ElMessage.error({ message: error.error_description || error.message });
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMixtapes = async () =>
    await errorHandler(async () => {
      const data = await api.get(`/mixtapes`);
      mixtapes.value = data as Mixtape[];
    });

  const loadMixtapeById = async (mixtapeId: string | number) =>
    await errorHandler(async () => {
      let id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId);
      const data = await api.get(`/mixtapes`, {
        query: {
          id,
        },
      });
      mixtapes.value = data as Mixtape[];
    });

  const getById = async (mixtapeId: string | number) => {
    let id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId);

    const mixtapeExists = mixtapes.value.find((m) => m.id === id);
    if (!mixtapeExists) {
      await loadMixtapeById(id);
    }

    if (!mixtapes.value.length) {
      await fetchMixtapes();
    }

    return mixtapes.value.find((m) => m.id === id);
  };

  return {
    isLoading,
    mixtapes,
    fetchMixtapes,
    getById,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMixtapesStore, import.meta.hot));
}
