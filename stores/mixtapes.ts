import { MixtapeExt, MixtapeParamsExt, ObjectOf } from "~~/types/supatypes";

export const useMixtapesStore = defineStore("mixtapes", () => {
  const api = useApi();
  const isLoading = ref<boolean>(false);
  const { process } = useProcess({ isLoading });
  const data = ref<MixtapeExt[]>([]);
  const index = ref<ObjectOf<MixtapeExt>>();

  const fetchMixtapes = async () =>
    await process(async () => {
      const result = await api.get(`/mixtapes`);
      data.value = result as MixtapeExt[];
      index.value = (result as MixtapeExt[]).reduce(
        (r, m) => ({ ...r, [m.id]: m }),
        {}
      );
    });

  const loadMixtapeById = async (mixtapeId: string | number) =>
    await process(async () => {
      let id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId);
      const result = await api.get(`/mixtapes`, {
        query: {
          id,
        },
      });
      index.value = { ...index.value, [mixtapeId]: result as MixtapeExt };
    });

  const getById = async (mixtapeId: string | number) => {
    let id = typeof mixtapeId === "number" ? mixtapeId : Number(mixtapeId);
    if (!index.value?.[id]) {
      await loadMixtapeById(id);
    }

    return index.value?.[id];
  };

  const createMixtape = async (
    mixtapeData: MixtapeParamsExt,
    options?: {
      withMessages?: boolean;
    }
  ) =>
    await process(
      async () => {
        const result: MixtapeExt = await api.post(`/mixtapes`, {
          body: { data: mixtapeData },
        });
        data.value = [...data.value, result];
        index.value = { ...index.value, [result.id]: result };
        return data;
      },
      {
        successMsg: `Merci d'avoir ajouté ${mixtapeData.name} !`,
        withMessages: options?.withMessages ?? true,
      }
    );

  const updateMixtape = async (
    mixtapeId: string | number,
    { cover_url, created_by, ...mixtapeData }: MixtapeParamsExt
  ) =>
    await process(
      async () => {
        const result: MixtapeExt = await api.patch(`/mixtapes`, {
          query: { id: mixtapeId },
          body: {
            data: mixtapeData,
          },
        });
        data.value = [...data.value.filter((a) => a.id !== mixtapeId), result];
        index.value = { ...index.value, [mixtapeId]: result };
        return data;
      },
      { successMsg: `Merci d'avoir mis ${mixtapeData.name} à jour !` }
    );

  const deleteMixtape = async (mixtapeId: string | number) =>
    await process(
      async () => {
        const result = await api.delete(`/mixtapes`, {
          query: { id: mixtapeId },
        });
        return result;
      },
      { successMsg: "Merci d'avoir fait du ménage !" }
    );

  return {
    isLoading,
    data,
    index,
    fetchMixtapes,
    createMixtape,
    updateMixtape,
    deleteMixtape,
    getById,
  };
});

export const useMixtapesStoreRefs = () => storeToRefs(useMixtapesStore());

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMixtapesStore, import.meta.hot));
}
