<script lang="ts" setup>
  import { getContrastYIQ } from '#imports'
  import { useFilter } from 'reka-ui'
  import type { Tag } from '~/types/api/tags.types'

  type Option = {
    label?: string
    value: Tag
    [key: string]: unknown
  }

  const props = withDefaults(
    defineProps<{
      modelValue?: Option[]
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
    (e: 'update:modelValue', value: Option[]): void
  }>()

  const open = ref(false)
  const searchTerm = ref('')

  // Ref local pour v-model du Combobox (synchronisé avec la prop)
  const localValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  })

  const { contains } = useFilter({ sensitivity: 'base' })

  const getOptionValue = (option: string | Record<string, unknown>) =>
    (typeof option === 'object' && option?.value) ?? option

  const getOptionLabel = (option: string | Record<string, unknown>) => {
    if (typeof option === 'string') return option
    if (typeof option === 'object') {
      // Si on a une structure Option { value: Tag, label: string }
      if (option?.label) return option.label as string
      // Si on a directement un Tag { name: string }
      if (option?.value && (option.value as Tag)?.name) return (option.value as Tag).name
      // Fallback sur optionLabelKey
      if (props.optionLabelKey && option?.[props.optionLabelKey]) {
        return option[props.optionLabelKey] as string
      }
    }
    return String(option)
  }

  const isInModelValue = (option: Option) => {
    return props.modelValue.some((item) => getOptionLabel(item) === getOptionLabel(option))
  }

  const filteredOptions = computed(() =>
    props.options.filter(
      (option) =>
        !isInModelValue(option) &&
        (searchTerm.value ? contains((getOptionValue(option) as Tag).name, searchTerm.value) : true),
    ),
  )

  const handleSelect = (event: { detail: { value?: unknown } }) => {
    if (!event.detail.value) return
    emit('update:modelValue', [...props.modelValue, event.detail.value as Option])
    searchTerm.value = ''

    if (filteredOptions.value.length === 0) {
      open.value = false
    }
  }

  const handleEnterKey = (_event: KeyboardEvent) => {
    const search = searchTerm.value.trim()
    if (search) {
      if (filteredOptions.value.length > 0) {
        handleSelect({ detail: { value: filteredOptions.value[0] } })
      } else {
        const newOption: Option = {
          value: { name: search } as Tag,
          label: search,
        }
        if (!props.modelValue.find((item) => getOptionLabel(item) === search)) {
          emit('update:modelValue', [...props.modelValue, newOption])
          searchTerm.value = ''
        }
      }
    }
  }

  const delimiter = /[\t\n\r]+/
</script>

<template>
  <Combobox v-model="localValue" v-model:open="open" :ignore-filter="true">
    <ComboboxAnchor as-child>
      <TagsInput
        :model-value="modelValue"
        :delimiter="delimiter"
        :display-value="getOptionLabel"
        add-on-paste
        add-on-tab
        class="bg-input/30 flex h-9 w-full px-2 py-0"
        @update:model-value="(value) => $emit('update:modelValue', value as Option[])"
      >
        <div class="flex flex-wrap items-center gap-2">
          <TagsInputItem
            v-for="item in modelValue"
            :key="item.value.name"
            :value="item"
            :style="{
              ...(item.value?.color
                ? { backgroundColor: item.value.color, color: getContrastYIQ(item.value.color) }
                : {}),
            }"
          >
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
          :value="{ value: { name: searchTerm }, label: searchTerm }"
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
            :value="option"
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
