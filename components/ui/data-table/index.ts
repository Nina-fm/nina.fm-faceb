import type { VNodeChild } from 'vue'

export { default as DataTable } from './DataTable.vue'
export { default as DataTableFilter } from './DataTableFilter.vue'
export { default as DataTableHeader } from './DataTableHeader.vue'
export { default as DataTableMultiFilter } from './DataTableMultiFilter.vue'
export { default as DataTablePagination } from './DataTablePagination.vue'
export { default as DataTableRowActions } from './DataTableRowActions.vue'

export interface FilterDef {
  id: string
  label: string
  selectedLabel?: string
  options: Array<{ label: string; renderLabel?: VNodeChild; value: string | number }>
  multiple?: boolean
}

export interface FilterBadgeValues {
  id: string
  value: unknown
  label?: string
  selectedLabel?: string
  optionLabel?: string
  optionRenderLabel?: VNodeChild
}
