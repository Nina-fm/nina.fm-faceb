<script lang="ts" setup>
  import { MoreVerticalIcon } from 'lucide-vue-next'

  withDefaults(
    defineProps<{
      deletable?: boolean
      editable?: boolean
    }>(),
    {
      deletable: true,
      editable: true,
    },
  )

  defineEmits<{
    show: []
    edit: []
    delete: []
  }>()
</script>

<template>
  <DataTableRowActions v-if="editable || deletable">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" class="text-muted-foreground">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem @click="$emit('show')">Voir</DropdownMenuItem>
        <DropdownMenuItem v-if="editable" @click="$emit('edit')">Modifier</DropdownMenuItem>
        <DropdownMenuItem v-if="deletable" class="text-destructive" @click="$emit('delete')">
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </DataTableRowActions>
</template>
