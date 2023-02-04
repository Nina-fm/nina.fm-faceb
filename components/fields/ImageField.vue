<script lang="ts" setup>
export interface Model {
  filename?: string;
  data?: string | ArrayBuffer | null;
}
const { modelValue, defaultValue, aspectRatio } = withDefaults(defineProps<{
  label: string,
  modelValue: Model,
  defaultValue?: string,
  aspectRatio?: string | number,
  emptyText?: string
}>(), {
  aspectRatio: 1,
  emptyText: "Aucune image"
})

const emit = defineEmits<{
  (e: "update:modelValue", value: Model): void
}>()

const preview = computed(() => (typeof modelValue?.data === 'string' && modelValue?.data) || defaultValue)
const ratio = computed(() => aspectRatio ?? 1)

const handleUpload = async (files: File[]) => {
  if (files.length) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      modelValue.data = e.target?.result
    };
    reader.readAsDataURL(files[0]);
    modelValue.filename = files[0].name
  } else {
    modelValue.data = null;
  }
  emit('update:modelValue', modelValue)
}
</script>

<template>
  <v-field :active="!!preview" class="image-field">
    <template #label>Cover</template>
    <v-sheet id="dropzone" class="w-100  pa-5">
      <v-sheet class="w-100 mb-3">
        <template v-if="preview">
          <v-img :src="preview" :aspect-ratio="ratio" contain />
        </template>
        <template v-else>
          <v-responsive :aspect-ratio="ratio" content-class="text-center d-flex flex-column
            justify-center align-center">
            <v-icon icon="mdi-camera-off" :size="40" color="grey-darken-3"></v-icon>
            <span class="text-grey-darken-2 ">{{ emptyText }}</span>
          </v-responsive>
        </template>
      </v-sheet>
      <v-file-input variant="outlined" dropzone hide-details="auto" show-size chips clearable accept="image/*"
        @update:model-value="handleUpload" append-inner-icon="mdi-upload">
      </v-file-input>
    </v-sheet>
  </v-field>
</template>

<style lang="scss" scoped>
.image-field {
  .v-file-input {
    :deep(.v-input__prepend) {
      display: none;
    }

    :deep(.v-field__outline .v-field-label--floating) {
      display: none;
    }

    :deep(.v-field__outline) {
      border-style: dashed;
      border-width: 3px;
      border-color: rgb(var(--v-theme-on-surface-variant));

      * {
        border: none;
      }
    }
  }
}
</style>
