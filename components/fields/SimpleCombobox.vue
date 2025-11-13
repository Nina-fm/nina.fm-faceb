<script lang="ts" setup generic="T">
  interface Option {
    label: string
    value: T
    [key: string]: unknown
  }

  const props = withDefaults(
    defineProps<{
      modelValue?: string[]
      name: string
      placeholder?: string
      options: Option[]
      canCreate?: boolean
      createLabel?: (search: string) => string
    }>(),
    {
      modelValue: () => [],
      placeholder: '',
      canCreate: false,
      createLabel: (search: string) => `Créer "${search}"`,
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
  }>()

  const searchTerm = ref('')
  const isOpen = ref(false)
  const selectedIndex = ref(-1)
  const containerRef = ref<HTMLDivElement>()
  const inputRef = ref<HTMLInputElement>()

  const filteredOptions = computed(() => {
    if (!searchTerm.value) return props.options.slice(0, 20)

    const search = searchTerm.value.toLowerCase()
    return props.options.filter((opt) => opt.label.toLowerCase().includes(search)).slice(0, 20)
  })

  const showCreateOption = computed(() => {
    return (
      props.canCreate &&
      searchTerm.value &&
      !filteredOptions.value.some((opt) => opt.label.toLowerCase() === searchTerm.value.toLowerCase())
    )
  })

  const addValue = (value: string) => {
    if (!value || props.modelValue.includes(value)) return
    emit('update:modelValue', [...props.modelValue, value])
    searchTerm.value = ''
    selectedIndex.value = -1
  }

  const removeValue = (value: string) => {
    emit(
      'update:modelValue',
      props.modelValue.filter((v) => v !== value),
    )
  }

  const selectOption = (option: Option) => {
    addValue(option.label)
    isOpen.value = false
  }

  const createNew = () => {
    addValue(searchTerm.value)
    isOpen.value = false
  }

  const handleKeydown = (e: KeyboardEvent) => {
    const totalOptions = filteredOptions.value.length + (showCreateOption.value ? 1 : 0)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % totalOptions
      isOpen.value = true
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex.value = selectedIndex.value <= 0 ? totalOptions - 1 : selectedIndex.value - 1
      isOpen.value = true
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < filteredOptions.value.length) {
        const option = filteredOptions.value[selectedIndex.value]
        if (option) selectOption(option)
      } else if (showCreateOption.value) {
        createNew()
      }
    } else if (e.key === 'Escape') {
      isOpen.value = false
      selectedIndex.value = -1
    } else if (e.key === 'Backspace' && !searchTerm.value && props.modelValue.length > 0) {
      const lastValue = props.modelValue[props.modelValue.length - 1]
      if (lastValue) removeValue(lastValue)
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData('text')
    if (!text) return

    e.preventDefault()
    const delimiter = /[\t\n\r,&]|\s+and\s+/gi
    const values = text
      .split(delimiter)
      .map((v) => v.trim())
      .filter((v) => v && !props.modelValue.includes(v))

    if (values.length > 0) {
      emit('update:modelValue', [...props.modelValue, ...values])
    }
  }

  // Close dropdown when clicking outside
  onClickOutside(containerRef, () => {
    isOpen.value = false
    selectedIndex.value = -1
  })

  // Reset selected index when search changes
  watch(searchTerm, () => {
    selectedIndex.value = -1
  })
</script>

<template>
  <div ref="containerRef" class="relative">
    <div class="bg-input focus-within:ring-ring flex w-full flex-wrap gap-2 rounded-md px-3 py-2 focus-within:ring-2">
      <span
        v-for="value in modelValue"
        :key="value"
        class="bg-primary text-primary-foreground flex items-center gap-1 rounded px-2 py-1 text-sm"
      >
        {{ value }}
        <button type="button" class="hover:bg-primary-foreground/20 rounded-sm" @click.stop="removeValue(value)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>

      <input
        ref="inputRef"
        v-model="searchTerm"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        class="flex-1 border-none bg-transparent outline-none"
        @focus="isOpen = true"
        @keydown="handleKeydown"
        @paste="handlePaste"
      />
    </div>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen && (filteredOptions.length > 0 || showCreateOption)"
        class="bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md"
      >
        <div
          v-if="showCreateOption"
          class="hover:bg-accent hover:text-accent-foreground cursor-pointer px-3 py-2 text-sm"
          :class="{ 'bg-accent': selectedIndex === filteredOptions.length }"
          @click="createNew"
        >
          {{ createLabel(searchTerm) }}
        </div>

        <div
          v-for="(option, i) in filteredOptions"
          :key="i"
          class="hover:bg-accent hover:text-accent-foreground cursor-pointer px-3 py-2 text-sm"
          :class="{ 'bg-accent': selectedIndex === i }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>
