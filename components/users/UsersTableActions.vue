<script lang="ts" setup>
  import { PencilIcon, Trash2Icon } from 'lucide-vue-next'

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
    <Tooltiped text="Modifier">
      <Button v-if="editable" size="icon" variant="ghost" class="text-muted-foreground" @click.stop="$emit('edit')">
        <PencilIcon />
      </Button>
    </Tooltiped>
    <Tooltiped :text="deletable ? 'Supprimer' : 'Vous ne pouvez pas supprimer cet utilisateur'">
      <Button
        :disabled="!deletable"
        size="icon"
        variant="ghost"
        class="text-muted-foreground disabled:text-muted-foreground/40"
        @click.stop="$emit('delete')"
      >
        <Trash2Icon />
      </Button>
    </Tooltiped>
  </DataTableRowActions>
</template>
