<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const { fetchMixtapes } = useMixtapesStore()
const { mixtapes } = storeToRefs(useMixtapesStore());

const columns = [{
  key: "id",
  dataKey: "id",
  title: "ID",
  width: 30,
},
{
  key: "name",
  dataKey: "name",
  title: "Name",
  width: 300
}];

const handleRowClick = (payload: any) => {
  navigateTo(`/mixtapes/${payload.id}`)
}

const handleBack = () => {
  navigateTo("/")
}

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
          <el-table-column prop="name" label="Name" />
        </el-table>
      </client-only>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
