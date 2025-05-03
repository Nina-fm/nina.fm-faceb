<script lang="ts" setup generic="TData">
  import type { Table } from '@tanstack/vue-table'
  import { FunnelIcon } from 'lucide-vue-next'
  import type { DropdownMenuCheckboxItemProps } from 'reka-ui'

  type Checked = DropdownMenuCheckboxItemProps['modelValue']

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

  const isActive = computed(() => {
    const column = props.table.getColumn(props.id)
    if (!column) return false
    const filterValue = column.getFilterValue() as Checked
    return filterValue !== undefined && filterValue !== null
  })
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        :class="
          cn('data-[state=open]:bg-accent text-muted-foreground', {
            'text-accent-foreground': isActive,
          })
        "
      >
        <span>{{ label }}</span>
        <FunnelIcon class="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuCheckboxItem
        v-for="option in options"
        :key="option.value"
        :model-value="(table.getColumn(id)?.getFilterValue() as Checked) === option.value"
        @update:model-value="table.getColumn(id)?.setFilterValue(option.value)"
      >
        {{ option.label }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
