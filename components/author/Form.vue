<script lang="ts" setup>
import { AuthorParams } from '~~/types/supatypes';

const { modelValue, edit } = defineProps<{
    modelValue: AuthorParams,
    edit?: boolean
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: AuthorParams): void
    (e: 'cancel'): void
    (e: 'submit', value: AuthorParams): void
}>()

const valid = ref(false)

const handleCancel = () => emit("cancel")
const handleSubmit = () => emit("submit", modelValue);

const rules = {
    min2Char: (v: string) => v.length >= 2 || 'Le nom doit comporter au moins 2 caractères'
}

</script>

<template>
    <v-form v-model="valid" @submit.prevent="handleSubmit" validate-on="blur">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="modelValue.name" label="Nom" :rules="[rules.min2Char]" required />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="modelValue.user_id" label="Admin (userId)" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div class="buttons">
                        <v-btn class="mr-2" @click="handleCancel">Annuler</v-btn>
                        <v-btn color="primary" type="submit">{{ edit? "Mettre à jour": "Ajouter" }}</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<style scoped>
.buttons {
    display: flex;
    justify-content: flex-end;
}
</style>
