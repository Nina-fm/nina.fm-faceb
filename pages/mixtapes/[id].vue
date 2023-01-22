<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const { params } = useRoute();
const { getById } = useMixtapesStore();
const { data } = await useAsyncData("mixtape", () => getById(params.id as string));


const mixtape = computed(() => data.value)
const authors = computed(() => data.value.authors.reduce((r: any, a: { name: any; }) => ([...r, a.name]), []));


const handleBack = () => {
  navigateTo("/mixtapes")
}
</script>

<template>
  <el-page-header @back="handleBack">
    <template #content>
      <el-tag type="info">Mixtape</el-tag>
      <span class="text-large font-600 mx-3"> {{ mixtape.name }} </span>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button type="primary" class="ml-2" disabled>Modifier</el-button>
      </div>
    </template>
  </el-page-header>
  <el-container>
    <el-main>
      <el-descriptions direction="vertical" :column="5" border>
        <el-descriptions-item label="ID">{{ mixtape.id }}</el-descriptions-item>
        <el-descriptions-item label="Nom">{{ mixtape.name }}</el-descriptions-item>
        <el-descriptions-item :label="authors.length > 1 ? 'Auteurs' : 'Auteur'">
          {{ authors.join(", ") }}
        </el-descriptions-item>
        <el-descriptions-item label="Année">
          {{ mixtape.year }}
        </el-descriptions-item>
        <el-descriptions-item label="Tags">
          <el-tag size="small">Style</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Cover" v-if="mixtape.cover_url" :span="5">
          <img :src="mixtape.cover_url" :alt="mixtape.name" />
        </el-descriptions-item>
        <el-descriptions-item v-if="mixtape.comments" label="Comments" :span="5">
          {{ mixtape.comments }}
        </el-descriptions-item>
        <el-descriptions-item label="Pistes" :span="5">
          <el-table :data="mixtape.tracks" table-layout="auto">
            <el-table-column prop="position" label="" width="40" />
            <el-table-column prop="title" label="Titre" />
            <el-table-column prop="artist" label="Artiste(s)" />
            <el-table-column prop="duration" label="Durée" width="100" />
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-main>
  </el-container>

</template>

<style scoped>
.track-item {}
</style>
