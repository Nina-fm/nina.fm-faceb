<script lang="ts" setup>
  import { getContrastYIQ } from '#imports'
  import { useFilter } from 'reka-ui'
  import type { Tag } from '~/types/db'

  type Option = {
    label?: string
    value: Tag
    [key: string]: any
  }

  const props = withDefaults(
    defineProps<{
      modelValue: Option[]
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

  const { contains } = useFilter({ sensitivity: 'base' })

  const getOptionValue = (option: string | Record<string, any>) =>
    (typeof option === 'object' && option?.value) ?? option

  const getOptionLabel = (option: string | Record<string, any>) =>
    typeof option === 'object' && props.optionLabelKey ? option?.[props.optionLabelKey] : option

  const isInModelValue = (option: Option) => {
    return props.modelValue.some((item) => getOptionLabel(item) === getOptionLabel(option))
  }

  const filteredOptions = computed(() =>
    props.options.filter(
      (option) =>
        !isInModelValue(option) && (searchTerm.value ? contains(getOptionValue(option).name, searchTerm.value) : true),
    ),
  )

  const updateModelValue = (value: unknown) => {
    if (Array.isArray(value)) {
      emit('update:modelValue', value)
    }
  }

  const handleFocus = () => {
    if (!open.value) {
      open.value = true
    }
  }

  const handleSelect = (event: any) => {
    updateModelValue([...props.modelValue, event.detail.value])
    searchTerm.value = ''

    if (filteredOptions.value.length === 0) {
      open.value = false
    }
  }

  const handleEnterKey = (event: KeyboardEvent) => {
    const search = searchTerm.value.trim()
    if (search) {
      if (filteredOptions.value.length > 0) {
        handleSelect({ detail: { value: filteredOptions.value[0] } })
      } else {
        const newValue = { name: search }
        if (!props.modelValue.find((item) => getOptionValue(item) === search)) {
          updateModelValue([...props.modelValue, newValue])
        }
      }
    }
  }

  const convertOptionValue = (value: any, key?: string) => {
    if (typeof value === 'object' && value?.value && key && value[key]) {
      return value[key]
    } else if (typeof value === 'object' && value?.value) {
      return value.value
    }
    return value
  }

  const delimiter = /[\t\n\r]+/
</script>

<template>
  <Combobox v-model:open="open" :model-value="modelValue" :ignore-filter="true" @update:model-value="updateModelValue">
    <ComboboxAnchor as-child class="p-0">
      <TagsInput
        :model-value="modelValue"
        :delimiter="delimiter"
        :display-value="getOptionLabel"
        :convert-value="convertOptionValue"
        add-on-paste
        add-on-tab
        class="bg-input/30 flex w-full px-2"
        @update:model-value="updateModelValue"
      >
        <div class="flex flex-wrap items-center gap-2 py-2">
          <TagsInputItem
            v-for="item in modelValue"
            :key="getOptionValue(item).name"
            :value="item"
            :style="{ ...(item.color ? { backgroundColor: item.color, color: getContrastYIQ(item.color) } : {}) }"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>

        <ComboboxInput v-model="searchTerm" as-child disable-search-icon>
          <TagsInputInput
            :placeholder="placeholder"
            class="flex-1 border-none p-1 focus-visible:ring-0"
            @keydown.enter.prevent="handleEnterKey"
            @focus="handleFocus"
          />
        </ComboboxInput>
      </TagsInput>

      <ComboboxList position="popper" side="bottom" align="start">
        <ComboboxItem
          v-if="searchTerm && !filteredOptions.length"
          :value="{ name: searchTerm }"
          class="h-auto px-3 pt-2 pb-1"
          @select.prevent="handleSelect"
        >
          Créer {{ searchTerm }}
        </ComboboxItem>
        <ComboboxGroup>
          <ComboboxItem
            v-for="(option, i) in filteredOptions"
            :key="`option-${i}`"
            :value="getOptionValue(option)"
            @select.prevent="handleSelect"
          >
            {{ getOptionLabel(option) }}
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
