<script lang="ts" setup>
  import { MoreVerticalIcon } from 'lucide-vue-next'

  withDefaults(
    defineProps<{
      deletable?: boolean
      sendable?: boolean
    }>(),
    {
      deletable: true,
      sendable: true,
    },
  )

  defineEmits<{
    delete: []
    send: []
  }>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size="icon" variant="ghost" class="text-muted-foreground">
        <MoreVerticalIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem v-if="sendable" @click="$emit('send')">Renvoyer</DropdownMenuItem>
      <DropdownMenuItem v-if="deletable" class="text-destructive" @click="$emit('delete')">Supprimer</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
