<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { PencilIcon, XIcon } from 'lucide-vue-next'

  definePageMeta({ roles: [Role.VIEWER, Role.ADMIN] })

  const { user } = useAuth()
  const { checkRole } = usePermissions()

  onBeforeMount(() => {
    if (checkRole(Role.VIEWER) && user.value?.id !== user.value?.id) {
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
  <!-- @ts-expect-error: OpenAPI generated types are readonly, User type is mutable -->
  <UserDetails v-if="user" :user="user" />
</template>
