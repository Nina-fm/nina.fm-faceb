<script lang="ts" setup>
  import { Trash2Icon, ZoomInIcon } from 'lucide-vue-next'
  import VueEasyLightbox from 'vue-easy-lightbox'

  type ImageFile = {
    filename: string
    file?: File
    url?: string
  }

  const props = defineProps<{
    modelValue: ImageFile | undefined
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: ImageFile | undefined): void
    (e: 'dragover'): void
    (e: 'dragleave'): void
    (e: 'drop'): void
    (e: 'click'): void
  }>()

  const { generateTmpImageUrl } = useImage()

  const { modelValue } = toRefs(props)

  const fileRef = ref<HTMLInputElement | null>(null)
  const isDragging = ref(false)
  const isZoomed = ref(false)
  const file = ref<File | null>(null)
  const fileSrc = ref<string | null>(modelValue.value?.url ?? null)

  const handleChange = () => {
    file.value = fileRef.value?.files?.[0] || null
    if (fileRef.value?.files?.[0]) {
      fileSrc.value = generateTmpImageUrl(fileRef.value.files[0])
      emit('update:modelValue', {
        filename: fileRef.value?.files?.[0]?.name,
        file: fileRef.value?.files?.[0],
      })
    } else {
      fileSrc.value = null
      emit('update:modelValue', undefined)
    }
  }

  const handleDragover = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = true
  }

  const handleDragleave = () => {
    isDragging.value = false
  }

  const handleDrop = (e: any) => {
    e.preventDefault()
    if (fileRef.value) {
      fileRef.value.files = e.dataTransfer.files
      handleChange()
      isDragging.value = false
    }
  }

  const handleDelete = () => {
    file.value = null
    fileSrc.value = null
    if (fileRef.value) {
      fileRef.value.value = ''
      handleChange()
    }
  }

  const handleZoomIn = () => {
    isZoomed.value = true
  }

  const handleZoomOut = () => {
    isZoomed.value = false
  }
</script>

<template>
  <div
    ref="dropzoneRef"
    :class="
      cn('border-border relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border')
    "
    @dragover="handleDragover"
    @dragleave="handleDragleave"
    @drop="handleDrop"
  >
    <div v-if="fileSrc" class="absolute top-0 right-0 bottom-0 left-0 z-0 flex items-center justify-center">
      <img :src="fileSrc" class="size-full object-contain" />
    </div>

    <div
      :class="
        cn(
          'text-muted-foreground bg-background/90 hover:bg-background/60 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center border-4 border-dashed border-transparent text-center text-xs transition-all duration-300 ease-in-out',
          {
            'border-primary/60': isDragging,
            'opacity-0 backdrop-blur-xs hover:opacity-100': fileSrc,
            'opacity-100': isDragging,
          },
        )
      "
    >
      <input
        ref="fileRef"
        type="file"
        name="file"
        class="absolute top-0 left-0 h-full w-full cursor-pointer overflow-hidden opacity-0"
        accept=".gif,.jpg,.jpeg,.png"
        @change="handleChange"
      />
      <div v-if="isDragging">Relâcher pour déposer votre fichier.</div>
      <div v-else class="pointer-events-none relative z-10 flex size-full flex-col items-center justify-center gap-5">
        <div>
          Désposer un fichier
          <br />
          ou
          <u>cliquer ici</u>
        </div>
        <div v-if="fileSrc" class="pointer-events-auto absolute bottom-2 left-2 z-10 size-fit">
          <Button size="icon" variant="secondary" @click.prevent="handleZoomIn"><ZoomInIcon /></Button>
        </div>
        <div v-if="fileSrc" class="pointer-events-auto absolute right-2 bottom-2 z-10 size-fit">
          <Button size="icon" variant="destructive" @click.prevent="handleDelete"><Trash2Icon /></Button>
        </div>
      </div>
    </div>
    <VueEasyLightbox v-if="fileSrc" :visible="isZoomed" :imgs="[fileSrc]" :index="0" @hide="handleZoomOut" />
  </div>
</template>

<style></style>
