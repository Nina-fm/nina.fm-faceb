<script setup lang="ts" generic="TData, TValue">
  import type { ColumnDef } from '@tanstack/vue-table'
  import { FlexRender, getCoreRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'
  import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

  const props = defineProps<{
    columns: ColumnDef<TData & { id: string | number }, TValue>[]
    data: (TData & { id: string | number })[]
    loading?: boolean
    pagination?: boolean
    background?: boolean
  }>()

  const emits = defineEmits<{
    (e: 'rowClick', id: string | number): void
  }>()

  const hasRowClick = computed(() => {
    return !!getCurrentInstance()?.vnode.props?.['onRowClick']
  })

  const table = useVueTable({
    get data() {
      return props.data
    },
    get columns() {
      return props.columns
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
</script>

<template>
  <div :class="cn('rounded-md', { 'bg-foreground/3 px-4 py-2': props.background })">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
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
            <TableCell :colspan="columns.length" class="text-center">Aucun résultat.</TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <div v-if="props.pagination" class="flex items-center justify-end space-x-2 py-4">
    <div class="text-muted-foreground flex-1 text-sm">{{ table.getFilteredRowModel().rows.length }} résultat(s)</div>
    <div class="space-x-2">
      <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
        <ChevronLeftIcon />
      </Button>
      <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
        <ChevronRightIcon />
      </Button>
    </div>
  </div>
</template>
