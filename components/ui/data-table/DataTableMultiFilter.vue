<script lang="ts" setup generic="TData">
  import type { Table } from '@tanstack/vue-table'
  import { Check, ChevronsUpDown, FunnelIcon } from 'lucide-vue-next'
  import type { FilterDef } from '~/components/ui/data-table'

  interface DataTableFilterProps extends FilterDef {
    table: Table<TData & { id: string | number }>
  }

  const props = defineProps<DataTableFilterProps>()

  const open = ref(false)

  const filterValue = computed(() => props.table.getColumn(props.id)?.getFilterValue() as unknown[])

  const isActive = computed(() => filterValue.value !== undefined && filterValue.value !== null)

  const selectedCount = computed(() => {
    if (!filterValue.value || !Array.isArray(filterValue.value)) return 0
    return filterValue.value.length
  })

  const buttonLabel = computed(() => {
    if (selectedCount.value === 0) return props.label
    return `${props.label} (${selectedCount.value})`
  })

  const isSelected = (value: string | number) => {
    return filterValue.value?.includes(value) ?? false
  }

  const handleSelect = (value: string | number) => {
    const column = props.table.getColumn(props.id)
    if (!column) return

    const currentValue = (column.getFilterValue() ?? []) as unknown[]

    if (currentValue.includes(value)) {
      const newValue = currentValue.filter((v) => v !== value)
      column.setFilterValue(newValue.length ? newValue : undefined)
    } else {
      column.setFilterValue([...currentValue, value])
    }
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
        <span class="truncate">{{ buttonLabel }}</span>
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
              @select="handleSelect(option.value)"
            >
              <Check :class="cn('mr-2 h-4 w-4', isSelected(option.value) ? 'opacity-100' : 'opacity-0')" />
              <component :is="option.renderLabel" v-if="option.renderLabel">{{ option.label }}</component>
              <span v-else>{{ option.label }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
