<script setup lang="ts" generic="TData, TValue">
  import {
    FlexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
  } from '@tanstack/vue-table'
  import { DeleteIcon, XIcon } from 'lucide-vue-next'
  import Badge from '~/components/ui/badge/Badge.vue'
  import type { FilterBadgeValues, FilterDef } from '~/components/ui/data-table'

  const DataTableHeader = resolveComponent('DataTableHeader')

  const props = defineProps<{
    columns: ColumnDef<TData & { id: string | number }, TValue>[]
    data: (TData & { id: string | number })[]
    loading?: boolean
    pagination?: boolean
    background?: boolean
    emptyText?: string
    sorting?: SortingState
    filters?: FilterDef[]
    search?: boolean
    searchValue?: string | number
    activeFilters?: ColumnFiltersState
  }>()

  const emits = defineEmits<{
    (e: 'clearSearch'): void
    (e: 'rowClick', id: string | number): void
    (e: 'filterChange', filters: ColumnFiltersState): void
  }>()

  const hasRowClick = computed(() => {
    return !!getCurrentInstance()?.vnode.props?.['onRowClick']
  })

  const multiValuesFilterFn = (
    row: { getValue: (columnId: string) => string[] },
    columnId: string,
    values: string[],
  ) => {
    const roles = row.getValue(columnId) as string[]
    return values.reduce((res: boolean, value: string) => roles.includes(value) || res, false)
  }

  const overrideFilterFn = (column: { filterFn: unknown; accessorKey: string; enableColumnFilter?: boolean }) => {
    // Si le filtrage de colonne est explicitement désactivé, ne pas ajouter de filterFn
    if (column.enableColumnFilter === false) {
      return undefined
    }
    if (column.filterFn) {
      return column.filterFn
    }
    if (props.filters?.find((f) => f.id === column.accessorKey)?.multiple) {
      return multiValuesFilterFn
    }
    return undefined
  }

  const columns = computed(() => {
    return props.columns.map((column) => {
      return {
        ...column,
        filterFn: overrideFilterFn(column as { filterFn: unknown; accessorKey: string }),
      }
    }) as ColumnDef<TData & { id: string | number }, TValue>[]
  })

  const sorting = ref<SortingState>(props.sorting ?? [])
  const columnFilters = ref<ColumnFiltersState>([])
  const searchText = ref<string | number>('')

  // Émettre les changements de filtres vers le parent
  watch(
    columnFilters,
    (newFilters) => {
      emits('filterChange', newFilters)
    },
    { deep: true },
  )

  const table = useVueTable({
    get data() {
      return props.data
    },
    get columns() {
      return columns.value
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      get sorting() {
        return sorting.value
      },
      get columnFilters() {
        return columnFilters.value
      },
    },
  })

  const filterValues = computed(() =>
    table.getState().columnFilters.map((filter) => ({
      id: filter.id,
      value: filter.value,
      label: props.filters?.find((f) => f.id === filter.id)?.label,
      optionLabel: props.filters?.find((f) => f.id === filter.id)?.options.find((o) => o.value === filter.value)?.label,
    })),
  )

  const filterValuesForBadges = computed(() =>
    filterValues.value.reduce<FilterBadgeValues[]>((res, filter) => {
      return [
        ...res,
        ...(Array.isArray(filter.value)
          ? (filter.value?.map((value) => {
              const filterDef = props.filters?.find((f) => f.id === filter.id)
              const filterOptionDef = filterDef?.options.find((o) => o.value === value)
              return {
                id: filter.id,
                value,
                label: filter.label,
                selectedLabel: filterDef?.selectedLabel,
                optionLabel: filterOptionDef?.label,
                optionRenderLabel: filterOptionDef?.renderLabel,
              }
            }) ?? [])
          : [filter]),
      ]
    }, []),
  )

  const handleSearchUpdateModelValue = (value: string | number) => {
    searchText.value = value
    table.setGlobalFilter(value)
  }

  const handleSearchClear = () => {
    searchText.value = ''
    table.setGlobalFilter('')
    emits('clearSearch')
  }

  const handleRemoveFilter = (id: string, value: unknown) => {
    const column = table.getColumn(id)
    if (!column) return
    const isMultiple = props.filters?.find((f) => f.id === id)?.multiple
    const filterValue = column.getFilterValue() as string[]
    if (isMultiple) {
      const filteredArray = filterValue.filter((v) => v !== value)
      const newFilterValue = filteredArray.length ? filteredArray : undefined
      column.setFilterValue(newFilterValue)
    } else {
      column.setFilterValue(undefined)
    }
  }

  onBeforeMount(() => {
    if (props.searchValue) {
      handleSearchUpdateModelValue(props.searchValue)
    }
    if (props.activeFilters) {
      columnFilters.value = props.activeFilters
    }
  })
</script>

<template>
  <div v-if="props.search || props.filters?.length" class="flex flex-col gap-4 pb-4">
    <div class="flex justify-between gap-4">
      <div class="relative w-full max-w-sm items-center">
        <Input
          v-if="props.search"
          class="h-8 max-w-sm"
          placeholder="Rechercher..."
          :model-value="searchText"
          @update:model-value="handleSearchUpdateModelValue"
        />
        <span
          class="absolute inset-y-0 end-0 flex cursor-pointer items-center justify-center px-2"
          @click="handleSearchClear"
        >
          <DeleteIcon class="text-muted-foreground size-4" />
        </span>
      </div>
      <div class="flex items-center justify-end gap-2">
        <template v-if="props.filters?.length">
          <template v-for="filter in props.filters" :key="filter.id">
            <DataTableMultiFilter
              v-if="filter.multiple"
              :id="filter.id"
              :table="table"
              :label="filter.label"
              :options="filter.options"
            />
            <DataTableFilter v-else :id="filter.id" :table="table" :label="filter.label" :options="filter.options" />
          </template>
        </template>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div v-for="filter in filterValuesForBadges" :key="filter.id">
        <component :is="filter.optionRenderLabel ?? Badge" variant="secondary" class="font-normal">
          <p>{{ filter?.selectedLabel ?? filter.label }} : {{ filter.optionLabel }}</p>
          <div class="cursor-pointer text-xs" @click="() => handleRemoveFilter(filter.id, filter.value)">
            <XIcon class="size-4" />
          </div>
        </component>
      </div>
    </div>
  </div>
  <div :class="cn('rounded-md', { 'bg-foreground/3 px-4 py-2': props.background })">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :col-span="header.colSpan"
            :style="{ width: `${header.getSize()}px` }"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="
                header.column.getCanSort()
                  ? h(DataTableHeader, { column: header.column, title: header.column.columnDef.header })
                  : header.column.columnDef.header
              "
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="props.loading">
          <TableRow>
            <TableCell :colspan="columns.length" class="text-center">
              <Loader class="inline-block" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            :class="
              cn({
                'cursor-pointer': hasRowClick,
              })
            "
            @click="emits('rowClick', row.original?.id)"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="text-center">
              {{ props.emptyText ?? 'Aucun résultat.' }}
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <DataTablePagination v-if="props.pagination" :table="table" />
</template>
