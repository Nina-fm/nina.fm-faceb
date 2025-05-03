<script lang="ts" setup generic="TData">
  import type { Table } from '@tanstack/vue-table'
  import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

  interface DataTablePaginationProps {
    table: Table<TData & { id: string | number }>
  }
  defineProps<DataTablePaginationProps>()
</script>

<template>
  <div class="flex items-center justify-end space-x-2 py-4">
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
