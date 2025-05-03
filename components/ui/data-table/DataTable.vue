<script setup lang="ts" generic="TData, TValue">
  import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/vue-table'
  import {
    FlexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
  } from '@tanstack/vue-table'
  import type { FilterDef } from '~/components/ui/data-table'

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
  }>()

  const emits = defineEmits<{
    (e: 'rowClick', id: string | number): void
  }>()

  const hasRowClick = computed(() => {
    return !!getCurrentInstance()?.vnode.props?.['onRowClick']
  })

  const sorting = ref<SortingState>(props.sorting ?? [])
  const columnFilters = ref<ColumnFiltersState>([])
  const searchText = ref<string | number>('')

  const table = useVueTable({
    get data() {
      return props.data
    },
    get columns() {
      return props.columns
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

  const handleSearchUpdateModelValue = (value: string | number) => {
    searchText.value = value
    table.setGlobalFilter(value)
  }
</script>

<template>
  <div v-if="props.search || props.filters?.length" class="flex justify-between gap-4 pb-4">
    <Input
      v-if="props.search"
      class="h-8 max-w-sm"
      placeholder="Rechercher..."
      :model-value="searchText"
      @update:model-value="handleSearchUpdateModelValue"
    />
    <div class="flex items-center justify-end gap-2">
      <template v-if="props.filters?.length">
        <DataTableFilter
          v-for="filter in props.filters"
          :id="filter.id"
          :table="table"
          :label="filter.label"
          :options="filter.options"
        />
      </template>
    </div>
  </div>
  <div :class="cn('rounded-md', { 'bg-foreground/3 px-4 py-2': props.background })">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
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
