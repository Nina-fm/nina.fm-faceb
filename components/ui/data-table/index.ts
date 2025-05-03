export { default as DataTable } from './DataTable.vue'
export { default as DataTableFilter } from './DataTableFilter.vue'
export { default as DataTableHeader } from './DataTableHeader.vue'
export { default as DataTableMultiFilter } from './DataTableMultiFilter.vue'
export { default as DataTablePagination } from './DataTablePagination.vue'
export { default as DataTableRowActions } from './DataTableRowActions.vue'

export interface FilterDef {
  id: string
  label: string
  options: Array<{ label: string; value: string | number }>
  multiple?: boolean
}

