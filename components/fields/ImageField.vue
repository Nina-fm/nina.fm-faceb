<script lang="ts" setup>
// https://github.com/Yaxian/vue3-dropzone
import { FileRejectReason, useDropzone } from 'vue3-dropzone';
import { FileModel } from '~~/types/supatypes';

const { modelValue, aspectRatio } = withDefaults(defineProps<{
  label: string,
  modelValue: FileModel,
  aspectRatio?: string | number,
  emptyText?: string
}>(), {
  aspectRatio: 1,
  emptyText: "Aucune image"
})

const emit = defineEmits<{
  (e: "update:modelValue", value: FileModel): void
}>()

const lightboxOpen = ref(false)
const preview = computed(() => (typeof modelValue?.data === 'string' && modelValue?.data))
const ratio = computed(() => aspectRatio ?? 1)
const isFieldActive = computed(() => !!preview.value || isDragActive.value || isFocused.value)
const isLoading = ref(false);

const handleDelete = () => {
  isLoading.value = true
  modelValue.data = null;
  modelValue.filename = null;
  emit('update:modelValue', modelValue)
  isLoading.value = false
}

const handleOpenLightBox = () => {
  lightboxOpen.value = true
}

const handleCloseLightBox = () => {
  lightboxOpen.value = false
}

const handleUpload = (acceptedFiles: any[], rejectReasons: FileRejectReason[]) => {
  isLoading.value = true
  if (acceptedFiles.length) {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      modelValue.data = e.target?.result
    };
    reader.readAsDataURL(file);
    modelValue.filename = file.name
  } else {
    modelValue.data = null;
  }
  emit('update:modelValue', modelValue)
  isLoading.value = false
}

const { getRootProps, getInputProps, isDragActive, isFocused, open } = useDropzone({ onDrop: handleUpload });
</script>

<template>
  <v-field :active="isFieldActive" :loading="isLoading" class="image-field">
    <template #label>Cover</template>
    <v-sheet class="w-100  pa-4" v-bind="getRootProps()">
      <template v-if="preview && !isDragActive">
        <v-hover v-slot="{ isHovering, props }">
          <v-card :elevation="0" v-bind="props" @click.stop="handleOpenLightBox">
            <v-img :src="preview || ''" :aspect-ratio="ratio" contain>
              <div class="image-overlay d-flex flex-column flex-grow-1 align-center justify-space-between"
                :class="{ hover: isHovering }">
                <div class="d-flex h-30 align-start">&nbsp;</div>
                <div class="d-flex h-30 align-center">
                  <v-chip>{{ modelValue?.filename }}</v-chip>
                </div>
                <div class="d-flex h-30 align-end">
                  <v-btn variant="text" icon="mdi-upload" @click.stop="open" />
                  <v-btn variant="text" icon="mdi-close-circle" @click.stop="handleDelete" />
                </div>
              </div>
            </v-img>
          </v-card>
        </v-hover>
      </template>
      <template v-else>
        <v-responsive :aspect-ratio="ratio" content-class="d-flex">
          <v-sheet class="dropzone mt-5 h-auto" :class="{ active: isDragActive }" rounded="xl">
            <v-icon v-if="isDragActive" icon="mdi-tray-arrow-down" :size="40" />
            <p v-else class="w-75">Déposer un fichier ici ou cliquez pour le sélectionner</p>
          </v-sheet>
        </v-responsive>
      </template>
    </v-sheet>
    <input v-bind="getInputProps()" />
  </v-field>
  <vue-easy-lightbox :visible="lightboxOpen" :imgs="preview || ''" :index="0" @hide="handleCloseLightBox">
    <!-- <template v-slot:toolbar="{ toolbarMethods }"></template> -->
  </vue-easy-lightbox>
</template>

<style lang="scss" scoped>
.h-30 {
  height: 33.33%;
}

.image-field {
  .v-img {
    :deep(.v-responsive__content) {
      display: flex;
    }
  }

  .image-overlay {
    background-color: rgba(var(--v-theme-surface), 0.75);
    transition: opacity 0.1s ease-in-out;
    cursor: zoom-in;

    &:not(.hover) {
      opacity: 0;
    }

    :deep(.v-chip) {
      cursor: zoom-in;
    }
  }

  .dropzone {
    cursor: pointer;
    border: 5px dashed rgba(var(--v-theme-on-surface-variant), 0.5);
    position: relative;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: rgb(var(--v-theme-on-surface-variant));
    transition: all 0.2s ease-in-out;

    &.active {
      color: rgb(var(--v-theme-on-surface));
      border-color: rgb(var(--v-theme-on-surface));
    }

    &:hover {
      color: rgba(var(--v-theme-on-surface), 0.5);
      border-color: rgba(var(--v-theme-on-surface), 0.5);
    }
  }
}
</style>
