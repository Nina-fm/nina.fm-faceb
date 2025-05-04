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
      value: string | number
    }[]
  }
  const props = defineProps<DataTableFilterProps>()

  const filterValue = computed(() => props.table.getColumn(props.id)?.getFilterValue() as unknown[])

  const isActive = computed(() => filterValue !== undefined && filterValue !== null)

  const getModelValue = (value: string | number) => {
    return filterValue.value?.includes(value) ?? false
  }

  const handleUpdateModelValue = (option: string | number, value: Checked) => {
    const column = props.table.getColumn(props.id)
    if (column) {
      const previousValue = column?.getFilterValue() ?? []
      if (value) {
        column.setFilterValue([...(previousValue as Checked[]), option])
      } else {
        const newValue = Array.isArray(previousValue) ? previousValue.filter((o) => o !== option) : []
        column.setFilterValue(newValue.length ? newValue : undefined)
      }
    }
  }
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
        <FunnelIcon class="mr-1 size-3" />
        <span>{{ label }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuCheckboxItem
        v-for="option in options"
        :key="option.value"
        :model-value="getModelValue(option.value)"
        @update:model-value="(value) => handleUpdateModelValue(option.value, value)"
      >
        {{ option.label }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
