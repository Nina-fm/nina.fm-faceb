<script lang="ts" setup>
  import { useFilter } from 'reka-ui'
  import type { Dj } from '~/types/api/djs.types'

  type Option = {
    label?: string
    value: Dj | { name: string }
    [key: string]: unknown
  }

  const props = withDefaults(
    defineProps<{
      modelValue?: string[]
      name: string
      placeholder?: string
      readonly?: boolean
      optionLabelKey?: string
      options: Option[]
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

  // Ref local pour v-model du Combobox (synchronisé avec la prop)
  const localValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  })

  const { contains } = useFilter({ sensitivity: 'base' })

  const getOptionValue = (option: string | Record<string, unknown>) => {
    if (typeof option === 'object' && option?.value) {
      const value = option.value as Dj | { name: string }
      return value.name
    }
    return option as string
  }

  const getOptionLabel = (option: string | Record<string, unknown>) => {
    if (typeof option === 'object' && props.optionLabelKey) {
      return (option?.[props.optionLabelKey] as string) ?? ''
    }
    return option as string
  }

  const isInModelValue = (optionName: string) => {
    return props.modelValue.includes(optionName)
  }

  const filteredOptions = computed(() =>
    props.options.filter(
      (option) =>
        !isInModelValue(getOptionValue(option)) &&
        (searchTerm.value ? contains(getOptionValue(option), searchTerm.value) : true),
    ),
  )

  const handleSelect = (event: unknown) => {
    const evt = event as Record<string, unknown>
    const detail = evt.detail as Record<string, unknown>
    const selectedValue = detail?.value
    if (!selectedValue || selectedValue === null) return
    const selectedName =
      typeof selectedValue === 'string' ? selectedValue : getOptionValue(selectedValue as Record<string, unknown>)
    if (!props.modelValue.includes(selectedName)) {
      emit('update:modelValue', [...props.modelValue, selectedName])
    }
    searchTerm.value = ''

    if (filteredOptions.value.length === 0) {
      open.value = false
    }
  }

  /**
   * Parse texte collé pour extraire plusieurs DJs
   * Format accepté: "A, B & C" ou "A and B" → ["A", "B", "C"]
   */
  const parseDjNames = (text: string): string[] => {
    return text
      .split(/[,&]|\s+and\s+/gi)
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
  }

  const handleEnterKey = () => {
    const search = searchTerm.value.trim()
    if (search) {
      if (filteredOptions.value.length > 0) {
        // Sélectionner la première option filtrée
        const firstOption = filteredOptions.value[0]
        if (firstOption) {
          handleSelect({ detail: { value: firstOption } })
        }
      } else {
        // Créer nouveau DJ (supporte paste parsing)
        const djNames = parseDjNames(search)
        const newDjs = djNames.filter((name) => !props.modelValue.includes(name))
        if (newDjs.length > 0) {
          emit('update:modelValue', [...props.modelValue, ...newDjs])
          searchTerm.value = ''
        }
      }
    }
  }

  const convertOptionValue = (value: unknown): string => {
    if (typeof value === 'string') {
      return value
    }
    if (typeof value === 'object' && value !== null) {
      return getOptionValue(value as Record<string, unknown>)
    }
    return String(value)
  }

  // Support paste parsing: "A, B & C" → ["A", "B", "C"]
  const delimiter = /[\t\n\r,&]|\s+and\s+/gi
</script>

<template>
  <Combobox v-model="localValue" v-model:open="open" :ignore-filter="true">
    <ComboboxAnchor as-child>
      <TagsInput
        :model-value="modelValue"
        :delimiter="delimiter"
        :convert-value="convertOptionValue"
        add-on-paste
        add-on-tab
        class="bg-input/30 flex h-9 w-full px-2 py-0"
        @update:model-value="(value) => $emit('update:modelValue', value as string[])"
      >
        <div class="flex flex-wrap items-center gap-2">
          <TagsInputItem v-for="djName in modelValue" :key="djName" :value="djName">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>

        <ComboboxInput v-model="searchTerm" as-child disable-search-icon>
          <TagsInputInput
            :placeholder="placeholder"
            class="flex-1 border-none p-0 focus-visible:ring-0"
            @keydown.enter.prevent="handleEnterKey"
          />
        </ComboboxInput>
      </TagsInput>

      <ComboboxList position="popper" side="bottom" align="start">
        <ComboboxItem
          v-if="searchTerm && !filteredOptions.length"
          :value="searchTerm"
          class="h-auto px-3 pt-2 pb-1"
          @select.prevent="
            // @ts-ignore - reka-ui type mismatch
            handleSelect
          "
        >
          Créer {{ searchTerm }}
        </ComboboxItem>
        <ComboboxGroup>
          <ComboboxItem
            v-for="(option, i) in filteredOptions"
            :key="`option-${i}`"
            :value="getOptionValue(option)"
            @select.prevent="
              // @ts-ignore - reka-ui type mismatch
              handleSelect
            "
          >
            {{ getOptionLabel(option) }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
