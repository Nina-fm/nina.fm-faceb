<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      name: string
      label?: string
      description?: string
      placeholder?: string
    }>(),
    {
      placeholder: '',
    },
  )

  const { value, setValue } = useField(() => props.name)

  const splittedTime = computed(() => {
    const time = value.value as string
    if (!time) return { hours: '00', minutes: '00', seconds: '00' }
    const [hours, minutes, seconds] = time.split(':')
    return { hours, minutes, seconds }
  })

  const hoursRef = useTemplateRef('hoursRef')
  const minutesRef = useTemplateRef('minutesRef')
  const secondsRef = useTemplateRef('secondsRef')

  const hours = ref(splittedTime.value.hours)
  const minutes = ref(splittedTime.value.minutes)
  const seconds = ref(splittedTime.value.seconds)

  const updateTime = () => {
    const newTime = `${hours.value}:${minutes.value}:${seconds.value}`
    setValue(newTime)
  }

  const handleUpdateHours = (event: Event) => {
    const target = event.target as HTMLInputElement
    hours.value = target.value.padStart(2, '0')
    updateTime()
  }

  const handleUpdateMinutes = (event: Event) => {
    const target = event.target as HTMLInputElement
    minutes.value = target.value.padStart(2, '0')
    updateTime()
  }

  const handleUpdateSeconds = (event: Event) => {
    const target = event.target as HTMLInputElement
    seconds.value = target.value.padStart(2, '0')
    updateTime()
  }
</script>

<template>
  <FormItem v-bind="$attrs">
    <FormLabel v-if="label">{{ label }}</FormLabel>
    <div class="flex gap-2">
      <FormControl>
        <div
          :class="
            cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 items-center gap-1 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            )
          "
        >
          <input
            ref="hoursRef"
            name="hours"
            :value="hours"
            placeholder="--"
            class="w-5 text-center focus:outline-0"
            @focus="hoursRef?.select()"
            @change="handleUpdateHours"
          />
          :
          <input
            ref="minutesRef"
            name="minutes"
            :value="minutes"
            placeholder="--"
            class="w-5 text-center focus:outline-0"
            @focus="minutesRef?.select()"
            @change="handleUpdateMinutes"
          />
          :
          <input
            ref="secondsRef"
            name="seconds"
            :value="seconds"
            placeholder="--"
            class="w-5 text-center focus:outline-0"
            @focus="secondsRef?.select()"
            @change="handleUpdateSeconds"
          />
        </div>
      </FormControl>
    </div>
    <FormDescription v-if="description">{{ description }}</FormDescription>
    <FormMessage />
  </FormItem>
</template>

<style></style>
