<script lang="ts" setup>
import { AuthorExt, AuthorParamsExt } from "~~/types/supatypes"

const props = defineProps<{
  author?: AuthorExt
  onSubmit?: () => void
  onSubmitAndClose?: () => void
}>()

const emit = defineEmits<{
  (e: "cancel"): void
  (e: "submit", value: AuthorParamsExt): void
  (e: "submit-and-close", value: AuthorParamsExt): void
}>()

const { author } = toRefs(props)
const rules = useFieldRules()
const valid = ref(false)
const isEdit = computed(() => !!author.value)
const form = reactive({
  name: author.value?.name ?? "",
  user_id: author.value?.user_id ?? "",
})

const handleCancel = () => emit("cancel")

const handleSubmit = () => emit("submit", form)

const handleSubmitAndClose = () => emit("submit-and-close", form)
</script>

<template>
  <v-form v-model="valid" validate-on="blur">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="form.name" label="Nom" :rules="[rules.min2Char]" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <user-id-field v-model="form.user_id" label="Admin (userId)" />
        </v-col>
      </v-row>
    </v-container>
    <submit-buttons
      :edit="isEdit"
      v-bind="{
        ...(props?.onSubmit ? { onSubmit: handleSubmit } : {}),
        ...(props?.onSubmitAndClose ? { onSubmitAndClose: handleSubmitAndClose } : {}),
      }"
      @cancel="handleCancel"
    />
  </v-form>
</template>

<style scoped></style>
