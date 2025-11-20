<script lang="ts" setup generic="TData">
  import type { Table } from '@tanstack/vue-table'
  import { Check, ChevronsUpDown, FunnelIcon } from 'lucide-vue-next'

  interface DataTableFilterProps {
    table: Table<TData & { id: string | number }>
    id: string
    label: string
    options: {
      label: string
      value?: string | number
    }[]
  }
  const props = defineProps<DataTableFilterProps>()

  const open = ref(false)

  const filterValue = computed(() => props.table.getColumn(props.id)?.getFilterValue() as string | number | undefined)

  const isActive = computed(() => filterValue.value !== undefined && filterValue.value !== null)

  const selectedLabel = computed(() => {
    if (!filterValue.value) return props.label
    return props.options.find((opt) => opt.value === filterValue.value)?.label ?? props.label
  })

  const handleSelect = (value: string | number) => {
    const column = props.table.getColumn(props.id)
    if (column) {
      if (filterValue.value === value) {
        column.setFilterValue(undefined)
      } else {
        column.setFilterValue(value)
      }
    }
    open.value = false
  }
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        role="combobox"
        :aria-expanded="open"
        :class="
          cn('text-muted-foreground justify-between', {
            'text-accent-foreground': isActive,
          })
        "
      >
        <FunnelIcon class="mr-1 size-3" />
        <span class="truncate">{{ selectedLabel }}</span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-56 p-0">
      <Command>
        <CommandInput :placeholder="`Rechercher ${label.toLowerCase()}...`" />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="String(option.value)"
              :keywords="[option.label]"
              @select="handleSelect(option.value!)"
            >
              <Check :class="cn('mr-2 h-4 w-4', filterValue === option.value ? 'opacity-100' : 'opacity-0')" />
              {{ option.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
