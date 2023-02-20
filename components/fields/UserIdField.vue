<script lang="ts" setup>
const props = defineProps<{
  modelValue: string,
  tooltip?: string,
  label?: string
}>();

const emit = defineEmits<{
  (e: 'update:model-value', value?: string): void
}>()

const { user } = useAuthStoreRefs();
const { modelValue } = toRefs(props);
const userId = ref<string | undefined>(modelValue.value);

watch(userId, (value) => {
  emit('update:model-value', value);
})

const handleAutoFill = () => {
  userId.value = user.value?.id
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-text-field v-model="userId" :label="label ?? 'UserId'" clearable>
        <template v-slot:append-inner>
          <v-tooltip activator="parent" location="start" :text="tooltip ?? 'C\'est moi'">
            <template v-slot:activator="{ props }">
              <v-btn variant="plain" icon="mdi-hand-front-left" class="field-inner-button" @click="handleAutoFill"
                v-bind="props" />
            </template>
          </v-tooltip>
        </template>
      </v-text-field>
    </v-col>
</v-row>
</template>

<style scoped></style>
