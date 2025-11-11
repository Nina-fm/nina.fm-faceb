<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { PencilIcon, XIcon } from 'lucide-vue-next'

  definePageMeta({ roles: [Role.VIEWER, Role.ADMIN] })

  const { currentUserId, hasRole, user } = useAuthApi()

  onBeforeMount(() => {
    if (hasRole(Role.VIEWER) && user.value?.id !== currentUserId.value) {
      return navigateTo('/')
    }
  })

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Mon profil',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/')
  }
</script>

<template>
  <PageHeader title="Mon profile utilisateur">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
      <Button size="fab" variant="outline">
        <NuxtLink :to="`/profile/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <UserDetails v-if="user" :user="user" />
</template>
