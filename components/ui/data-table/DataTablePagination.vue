<script lang="ts" setup generic="TData">
  import type { Table } from '@tanstack/vue-table'
  import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

  interface DataTablePaginationProps {
    table: Table<TData & { id: string | number }>
    serverPagination?: {
      total: number
      page: number
      limit: number
      pageCount: number
    }
    siblingCount?: number // Nombre de pages à afficher de chaque côté de la page courante (défaut: 2)
  }
  const props = defineProps<DataTablePaginationProps>()

  // Default value for siblingCount
  const sibling = computed(() => props.siblingCount ?? 2)

  const emit = defineEmits<{
    pageChange: [page: number]
    limitChange: [limit: number]
  }>()

  const resultsText = computed(() => {
    if (props.serverPagination) {
      const { total, page, limit } = props.serverPagination
      const start = (page - 1) * limit + 1
      const end = Math.min(page * limit, total)
      return `${start}-${end} sur ${total} résultat${total > 1 ? 's' : ''}`
    }
    const count = props.table.getFilteredRowModel().rows.length
    return `${count} résultat${count > 1 ? 's' : ''}`
  })

  const handleLimitChange = (newLimit: unknown) => {
    if (!newLimit) return
    const limit = Number(newLimit)

    if (props.serverPagination) {
      emit('limitChange', limit)
    } else {
      props.table.setPageSize(limit)
    }
  }

  const limitOptions = [
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
  ]

  const currentLimit = computed(() => {
    if (props.serverPagination) {
      return String(props.serverPagination.limit)
    }
    return String(props.table.getState().pagination.pageSize)
  })

  // Track clicked page for immediate visual feedback
  const clickedPage = ref<number | null>(null)

  const handlePageClick = (pageNum: number) => {
    clickedPage.value = pageNum
    if (props.serverPagination) {
      emit('pageChange', pageNum)
    } else {
      props.table.setPageIndex(pageNum - 1)
    }
  }

  const handlePreviousPage = () => {
    const targetPage = currentPage.value - 1
    clickedPage.value = targetPage
    if (props.serverPagination) {
      emit('pageChange', targetPage)
    } else {
      props.table.previousPage()
    }
  }

  const handleNextPage = () => {
    const targetPage = currentPage.value + 1
    clickedPage.value = targetPage
    if (props.serverPagination) {
      emit('pageChange', targetPage)
    } else {
      props.table.nextPage()
    }
  }

  const currentPage = computed(() => {
    if (props.serverPagination) {
      return Number(props.serverPagination.page)
    }
    return props.table.getState().pagination.pageIndex + 1
  })

  // Sync clickedPage with currentPage when data loads
  watch(currentPage, (newPage) => {
    if (clickedPage.value !== null && clickedPage.value === newPage) {
      // Reset clickedPage once serverPagination is updated
      clickedPage.value = null
    }
  })

  // Page to highlight (clicked or current)
  const activePage = computed(() => {
    return clickedPage.value ?? currentPage.value
  })

  const totalPages = computed(() => {
    if (props.serverPagination) {
      return props.serverPagination.pageCount
    }
    return props.table.getPageCount()
  })

  const canPreviousPage = computed(() => {
    if (props.serverPagination) {
      return props.serverPagination.page > 1
    }
    return props.table.getCanPreviousPage()
  })

  const canNextPage = computed(() => {
    if (props.serverPagination) {
      return props.serverPagination.page < props.serverPagination.pageCount
    }
    return props.table.getCanNextPage()
  })

  // Générer les numéros de pages à afficher selon le nombre de boutons configuré
  const pageNumbers = computed(() => {
    const current = currentPage.value
    const total = totalPages.value
    const siblings = sibling.value // Nombre de boutons de chaque côté de la page courante
    const centerButtons = siblings * 2 + 1 // Nombre total de boutons au centre (current ± siblings)
    const minPagesForEllipsis = centerButtons + 2 // Minimum de pages pour afficher des ellipses

    console.log('📄 pageNumbers computed:', { current, total, siblings })

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []

    if (total <= minPagesForEllipsis) {
      // Si trop peu de pages : afficher toutes
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
      console.log('📄 Total <= minPagesForEllipsis, returning:', pages)
      return pages
    }

    // Toujours la première page
    pages.push(1)

    // Si on est proche du début
    if (current <= siblings + 2) {
      // Afficher centerButtons pages après la première
      for (let i = 2; i <= centerButtons + 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis-end')
      pages.push(total)
      console.log('📄 Near start, returning:', pages)
      return pages
    }

    // Si on est proche de la fin
    if (current >= total - siblings - 1) {
      pages.push('ellipsis-start')
      // Afficher centerButtons pages avant la dernière
      for (let i = total - centerButtons; i < total; i++) {
        pages.push(i)
      }
      pages.push(total)
      console.log('📄 Near end, returning:', pages)
      return pages
    }

    // Au milieu : 1 ... current-siblings ... current ... current+siblings ... total
    pages.push('ellipsis-start')
    for (let i = current - siblings; i <= current + siblings; i++) {
      pages.push(i)
    }
    pages.push('ellipsis-end')
    pages.push(total)

    console.log('📄 Middle, returning:', pages)
    return pages
  })
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <!-- Left side: Items per page + Results count -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <Select :model-value="currentLimit" @update:model-value="handleLimitChange">
          <SelectTrigger class="h-8 w-[135px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in limitOptions" :key="option.value" :value="option.value">
              {{ option.label }} par page
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="text-muted-foreground text-sm">
        <span>{{ resultsText }}</span>
      </div>
    </div>

    <!-- Right side: Custom Pagination -->
    <div class="flex items-center gap-1">
      <Button variant="outline" size="sm" :disabled="!canPreviousPage" @click="handlePreviousPage">
        <ChevronLeftIcon class="size-4" />
      </Button>

      <template v-for="(pageNum, index) in pageNumbers" :key="index">
        <Button
          v-if="typeof pageNum === 'number'"
          :variant="pageNum === activePage ? 'default' : 'outline'"
          size="sm"
          class="min-w-[32px]"
          @click="handlePageClick(pageNum)"
        >
          {{ pageNum }}
        </Button>
        <span v-else class="text-muted-foreground px-2">…</span>
      </template>

      <Button variant="outline" size="sm" :disabled="!canNextPage" @click="handleNextPage">
        <ChevronRightIcon class="size-4" />
      </Button>
    </div>
  </div>
</template>
