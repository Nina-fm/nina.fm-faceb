<script lang="ts" setup>
const props = defineProps<{
  dataType?: string
  feminine?: boolean
}>()

const { dataType, feminine } = toRefs(props)
const shouldBeFeminine = !dataType?.value || (feminine.value ?? false)

const prefix = `Aucun${shouldBeFeminine ? "e" : ""} ${dataType?.value ?? "donnée"} trouvé${shouldBeFeminine ? "e" : ""}`
const article = shouldBeFeminine ? "la" : "le"
</script>

<template>
  <v-list-item>
    <v-list-item-title class="text-primary">
      {{ prefix }}, pressez <kbd>ENTER</kbd> pour {{ article }} créer.
    </v-list-item-title>
  </v-list-item>
</template>

<style scoped></style>
