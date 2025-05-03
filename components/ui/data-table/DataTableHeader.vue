<script setup lang="ts" generic="TData">
  import { Button } from '@/components/ui/button'
  import { cn } from '@/lib/utils'
  import type { Column } from '@tanstack/vue-table'
  import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'

  interface DataTableColumnHeaderProps {
    column: Column<TData, any>
    title: string | ((props: any) => any)
  }

  const props = defineProps<DataTableColumnHeaderProps>()
  const isDesc = computed(() => props.column.getIsSorted() === 'desc')

  const toggleSorting = () => {
    props.column.toggleSorting(!isDesc.value)
  }
</script>

<script lang="ts">
  export default {
    inheritAttrs: false,
  }
</script>

<template>
  <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <Button variant="ghost" size="sm" class="data-[state=open]:bg-accent -ml-3 h-8" @click="toggleSorting">
      <span>{{ title }}</span>
      <ChevronDownIcon v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
      <ChevronUpIcon v-else-if="column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
    </Button>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
