<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { FingerprintIcon } from 'lucide-vue-next'
  import { useForm } from 'vee-validate'
  import * as z from 'zod'
  import TextField from '~/components/fields/TextField.vue'
  import type { AuthorExt, AuthorParamsExt } from '~/types/supatypes'

  const props = defineProps<{
    author?: AuthorExt
  }>()

  const emit = defineEmits<{
    (e: 'form:dirty', value: boolean): void
    (e: 'cancel'): void
    (e: 'submit', value: AuthorParamsExt): void
  }>()

  const { author } = toRefs(props)
  const { user } = useAuthStoreRefs()

  const formSchema = toTypedSchema(
    z.object({
      name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
      user_id: z.string().optional(),
    }),
  )

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: author.value?.name || '',
      user_id: author.value?.user_id || undefined,
    },
  })

  const handleItsMe = () => {
    form.setFieldValue('user_id', user.value?.id)
  }

  const handleSubmit = form.handleSubmit((values) => {
    emit('submit', values as AuthorParamsExt)
  })

  watch(
    () => form.meta.value.dirty,
    (value) => {
      emit('form:dirty', value)
    },
  )

  const hint = 'Attention à bien respecter le format AirTime !'
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 @container/mixtapeform border-none">
      <CardContent>
        <form @submit="() => handleSubmit()">
          <div class="flex flex-col gap-5">
            <TextField name="name" label="Nom" :description="hint" />
            <TextField name="user_id" label="User ID">
              <template #suffix>
                <Button size="icon" variant="outline" @click.prevent="handleItsMe">
                  <FingerprintIcon />
                </Button>
              </template>
            </TextField>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
