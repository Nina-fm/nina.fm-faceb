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

  async function fetchMixtapes() {
    try {
      isLoading.value = true;
      const data = await api.get(`/mixtapes`);
      mixtapes.value = data as Mixtape[];
    } catch (error: any) {
      console.log(error);
      ElMessage(error.error_description || error.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMixtapeById(mixtapeId: string | number) {
    let id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId);
    try {
      isLoading.value = true;
      const data = await api.get(`/mixtapes`, {
        query: {
          id,
        },
      });
      mixtapes.value = data as Mixtape[];
    } catch (error: any) {
      console.log(error);
      ElMessage(error.error_description || error.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function getById(mixtapeId: string | number) {
    let id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId);

    const mixtapeExists = mixtapes.value.find((m) => m.id === id);
    if (!mixtapeExists) {
      await loadMixtapeById(id);
    }

    if (!mixtapes.value.length) {
      await fetchMixtapes();
    }

    return mixtapes.value.find((m) => m.id === id);
  }

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
