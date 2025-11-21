<script setup lang="ts">
  import { XIcon } from 'lucide-vue-next'

  interface Props {
    open: boolean
    src?: string
    alt?: string
  }

  interface Emits {
    (e: 'update:open', value: boolean): void
  }

  const props = withDefaults(defineProps<Props>(), {
    alt: '',
  })

  const emit = defineEmits<Emits>()

  const close = () => {
    emit('update:open', false)
  }
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="props.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        @click.self="close"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          @click="close"
        >
          <XIcon class="size-4" />
        </button>

        <!-- Image container -->
        <div class="flex items-center justify-center p-6">
          <img
            v-if="props.src"
            :src="props.src"
            :alt="props.alt"
            class="max-h-[calc(100vh-12rem)] max-w-[calc(100vw-3rem)] rounded-lg shadow-lg"
          />
        </div>

        <!-- Custom content slot -->
        <div class="absolute right-0 bottom-0 left-0 bg-black/50 px-6 py-4 text-white">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
