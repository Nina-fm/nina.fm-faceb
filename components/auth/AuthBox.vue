<script lang="ts" setup>
  defineProps<{
    title: string
    subtitle?: string
  }>()

  const config = useRuntimeConfig()
</script>

<template>
  <Card class="w-full max-w-lg">
    <CardHeader>
      <h2 class="text-center text-2xl font-bold">
        {{ title }}
      </h2>
      <p class="text-center text-sm text-gray-500">
        {{ subtitle ?? config.public.sitename }}
      </p>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
    <CardFooter v-if="$slots['footer'] || $slots['pre-footer']">
      <div class="flex w-full flex-col items-center gap-5">
        <div class="text-xs">
          <slot name="pre-footer" />
        </div>
        <div class="flex justify-center">
          <slot name="footer" />
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
