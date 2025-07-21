<script lang="ts" setup>
  import { ImportIcon } from 'lucide-vue-next'

  const props = defineProps<{
    name: string
    label: string
    title?: string
    description?: string
    placeholder?: string
    importable?: boolean | (() => boolean)
  }>()

  const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save'): void
    (e: 'import'): void
  }>()

  const { value: field, setValue } = useField<string>(() => props.name)

  const open = ref(false)
  // const tempValue = ref<string>(value.value as string)
  const empty = computed(() => !field.value || field.value.trim().length === 0)

  const handleCancel = () => {
    open.value = false
    // tempValue.value = value.value as string
    emit('cancel')
  }

  const handleSave = () => {
    // setValue(tempValue.value)
    open.value = false
    emit('save')
  }

  const handleImport = () => {
    // setValue(tempValue.value)
    open.value = false
    emit('import')
  }
</script>

<template>
  <Dialog :open="open" @update:open="(value) => (open = value)">
    <DialogTrigger as-child>
      <Button type="button" variant="ghost" size="icon-sm" @click.prevent.stop><ImportIcon /></Button>
    </DialogTrigger>
    <DialogContent
      class="xl: max-h-[90dvh] max-w-xs grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-lg md:max-w-lg lg:max-w-xl xl:max-w-2xl"
    >
      <DialogHeader class="space-y-4">
        <DialogTitle>{{ title ?? 'Import' }}</DialogTitle>
        <DialogDescription class="space-y-4">
          <slot>{{ description }}</slot>
        </DialogDescription>
      </DialogHeader>
      <Label>{{ label ?? 'Text à importer' }}</Label>
      <Textarea
        :model-value="field"
        class="h-full w-full resize-none"
        :placeholder="placeholder"
        @update:model-value="(value) => setValue(value as string)"
      />
      <DialogFooter>
        <Button variant="ghost" @click="handleCancel">Annuler</Button>
        <Button v-if="!importable && !empty" @click="handleSave">Enregistrer au format texte</Button>
        <Button v-else :disabled="empty" @click="handleImport">Importer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
