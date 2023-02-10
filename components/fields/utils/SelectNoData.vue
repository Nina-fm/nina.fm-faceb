<script lang="ts" setup>
const { dataType, feminine = false } = defineProps<{
  dataType?: string,
  feminine?: boolean
}>();

const shouldBeFeminine = !dataType || feminine;

const prefix = `Aucun${shouldBeFeminine ? 'e' : ''} ${dataType ?? "donnée"} trouvé${shouldBeFeminine ? 'e' : ''}`
const article = shouldBeFeminine ? 'la' : 'le'
</script>

<template>
  <v-list-item>
    <v-list-item-title class="text-primary">
      {{ prefix }}, pressez <kbd>ENTER</kbd> pour {{ article }} créer.
    </v-list-item-title>
  </v-list-item>
</template>

<style scoped>

</style>
