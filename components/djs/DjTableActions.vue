<script lang="ts" setup>
  import { ListMusicIcon } from 'lucide-vue-next'

  defineEmits<{
    showMixtapes: []
  }>()
</script>

<template>
  <DataTableRowActions>
    <Tooltiped text="Voir ses mixtapes">
      <Button size="icon" variant="ghost" class="text-muted-foreground" @click.stop="$emit('showMixtapes')">
        <ListMusicIcon />
      </Button>
    </Tooltiped>
    <!-- <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" class="text-muted-foreground">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem @click="$emit('showMixtapes')">Voir les mixtapes</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> -->
  </DataTableRowActions>
</template>
