<script lang="ts" setup>
import { Form } from '~~/components/forms/MixtapeImportForm.vue';
import { AnyFn, MixtapeParamsExt } from '~~/types/supatypes';

definePageMeta({ middleware: ["auth"] })

const { snackSuccess, snackError } = useSnackbarStore();
const { fetchFromUrl, importData, keysImported, keysWithErrors } = useImport()
const { isLoading } = useLoadingStoreRefs()
const data = ref<MixtapeParamsExt[]>([]);
const url = ref<string | null>(null);
const importEnded = ref<boolean>(false);

const imported = (key: string) => keysImported.value.includes(key);
const withErrors = (key: string) => keysWithErrors.value.includes(key);

const handleFetch = async (form: Form) => {
  if (form.url) {
    url.value = form.url;
    data.value = await fetchFromUrl(form.url);
  } else {
    snackError("Une URL valide doit être renseignée.")
  }
};

const handleImport = async () => {
  if (data.value.length) {
    const result = await importData(data.value);
    importEnded.value = true
  }
}

const handleCancel = () => {
  url.value = null;
  data.value = [];
}
</script>

<template>
  <PageHeader title="Import de Mixtapes" @back="navigateTo('/mixtapes')" />
  <v-container>
    <v-row>
      <v-col cols="12">
        <MixtapeImportForm v-if="!importEnded" :data="data" @analyze="handleFetch" @import="handleImport"
          @cancel="handleCancel" />
      </v-col>
      <v-col cols="12">
        <template v-if="data.length">
          <v-row v-if="!keysImported.length">
            <v-col>
              <v-alert icon="mdi-database">
                <v-alert-title>{{ data.length }} mixtapes trouvées !</v-alert-title>
                Pour les importer maintenant, cliquez sur le bouton en pied de page.
              </v-alert>
            </v-col>
          </v-row>
          <v-row v-if="keysImported.length && !isLoading">
            <v-col>
              <v-alert icon="mdi-database" color="success" variant="tonal">
                <v-alert-title>{{ keysImported.length }} mixtapes Importées !</v-alert-title>
              </v-alert>
            </v-col>
            <v-col>
              <v-alert icon="mdi-database" color="error" variant="tonal">
                <v-alert-title>{{ keysWithErrors.length }} mixtapes n'ont pu être importées !</v-alert-title>
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="mixtape in data" cols="12" sm="6" lg="4">
              <v-card class="d-flex flex-row">
                <div class="ma-2">
                  <v-avatar rounded color="grey-darken-3" class="mr-2">
                    <v-img v-if="mixtape?.cover_file?.data" :src="mixtape?.cover_file?.data" cover />
                    <v-icon v-else icon="mdi-image-off" color="grey-darken-2" />
                  </v-avatar>
                </div>
                <div class="d-flex flex-column justify-start">
                  <v-card-title class="pa-0">{{ mixtape.name }}</v-card-title>
                  <v-card-subtitle class="pa-0">{{ mixtape.authors_text }}</v-card-subtitle>
                </div>
                <v-overlay :model-value="imported(mixtape.key) || withErrors(mixtape.key)" contained
                  :close-on-back="false" class="align-center justify-center" persistent>
                  <v-chip :prepend-icon="imported(mixtape.key) ? 'mdi-check' : 'mdi-close'" size="small"
                    :color="imported(mixtape.key) ? 'success' : 'error'" variant="text">
                    {{ imported(mixtape.key) ? 'Importée' : 'Importée avec erreurs' }}
                  </v-chip>
                </v-overlay>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
</v-container>
</template>

<style lang="scss" scoped></style>
