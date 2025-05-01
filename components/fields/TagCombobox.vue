<script lang="ts" setup>
  import { useFilter } from 'reka-ui'

  const props = withDefaults(
    defineProps<{
      modelValue: string[]
      name: string
      placeholder?: string
      optionLabelKey?: string
      options:
        | string[]
        | {
            label?: string
            value: any
            [key: string]: any
          }[]
    }>(),
    {
      modelValue: () => [],
      placeholder: '',
      optionLabelKey: 'label',
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
  }>()

  const open = ref(false)
  const searchTerm = ref('')

  const { contains } = useFilter({ sensitivity: 'base' })

  const getOptionValue = (option: string | Record<string, any>) =>
    (typeof option === 'object' && option?.value) ?? option

  const getOptionLabel = (option: string | Record<string, any>) =>
    typeof option === 'object' && props.optionLabelKey ? option?.[props.optionLabelKey] : option

  const filteredOptions = computed(() => {
    const options = props.options.filter((option) => !props.modelValue.includes(getOptionLabel(option)))
    return searchTerm.value ? options.filter((option) => contains(getOptionLabel(option), searchTerm.value)) : options
  })

  const updateModelValue = (value: unknown) => {
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      emit('update:modelValue', value as string[])
    }
  }

  const handleFocus = () => {
    if (!open.value) {
      open.value = true
    }
  }

  const handleSelect = (event: any) => {
    if (typeof event.detail.value === 'string') {
      searchTerm.value = ''
      updateModelValue([...props.modelValue, event.detail.value])
    }

    if (filteredOptions.value.length === 0) {
      open.value = false
    }
  }
</script>

<template>
  <Combobox :modelValue="modelValue" v-model:open="open" :ignore-filter="true" @update:modelValue="updateModelValue">
    <ComboboxAnchor as-child class="p-0">
      <TagsInput :modelValue="modelValue" class="flex w-full gap-2 px-2" @update:modelValue="updateModelValue">
        <div class="flex flex-wrap items-center gap-2">
          <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>

        <ComboboxInput v-model="searchTerm" as-child disable-search-icon>
          <TagsInputInput
            :placeholder="placeholder"
            class="h-auto w-full min-w-[200px] border-none p-0 focus-visible:ring-0"
            @keydown.enter.prevent
            @focus="handleFocus"
          />
        </ComboboxInput>
      </TagsInput>

      <ComboboxList class="w-[--reka-popper-anchor-width]" position="popper" side="bottom">
        <ComboboxEmpty class="h-auto px-3 pt-2 pb-1">Aucun résultat</ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxItem
            v-for="option in filteredOptions"
            :key="getOptionValue(option)"
            :value="getOptionLabel(option)"
            @select.prevent="handleSelect"
          >
            {{ getOptionLabel(option) }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
