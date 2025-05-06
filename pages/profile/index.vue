<script lang="ts" setup>
  import { PencilIcon } from 'lucide-vue-next'

  const { user } = useAuthApi()

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Mon profil',
      },
    ],
  })
</script>

<template>
  <PageHeader title="Mon profile utilisateur">
    <template #actions>
      <Button size="icon" variant="outline">
        <NuxtLink :to="`/profile/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <UserDetails v-if="user" :user="user" />
</template>
