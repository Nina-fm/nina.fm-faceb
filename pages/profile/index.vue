<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { PencilIcon, XIcon } from 'lucide-vue-next'

  definePageMeta({ roles: [Role.ADMIN] })

  const { currentUserId } = useAuthApi()
  const { getUserById } = useUserApi()
  const { data: user } = await useAsyncData('user', () => getUserById(currentUserId.value ?? ''))

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
      <Button size="icon" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
      <Button size="icon" variant="outline">
        <NuxtLink :to="`/profile/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <UserDetails v-if="user" :user="user" />
</template>
