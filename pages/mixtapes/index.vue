<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { AuthorExt, MixtapeExt } from '~~/stores/mixtapes';

definePageMeta({ middleware: ["auth"] })

const { fetchMixtapes } = useMixtapesStore()
const { mixtapes } = storeToRefs(useMixtapesStore());

const handleRowClick = (payload: any) => {
  navigateTo(`/mixtapes/${payload.id}`)
}

const handleBack = () => {
  navigateTo("/")
}

const formatAuthors = (row: MixtapeExt) =>
  row.authors.reduce((r: string[], a: AuthorExt) => [...r, a.name], [] as string[]).join(", ");

onMounted(() => fetchMixtapes())
</script>

<template>
  <el-page-header @back="handleBack">
    <template #content>
      <span class="text-large font-600 mr-3"> Mixtapes </span>
    </template>
  </el-page-header>
  <el-container>
    <el-main>
      <client-only>
        <el-table class="clickable" :data="mixtapes" style="width: 100%" @row-click="handleRowClick">
          <el-table-column prop="id" label="ID" width="40" />
          <el-table-column prop="name" label="Mixtape" />
          <el-table-column label="Par" :formatter="formatAuthors" />
          <el-table-column prop="year" label="Année" />
        </el-table>
      </client-only>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
