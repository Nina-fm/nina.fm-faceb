<script lang="ts" setup>
import { AuthorExt, AuthorParamsExt } from '~~/types/supatypes';

const { author } = defineProps<{
    author?: AuthorExt
}>();

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'submit', value: AuthorParamsExt): void
}>()

const { user } = storeToRefs(useAuthStore());
const rules = useFieldRules()
const valid = ref(false)
const isEdit = computed(() => !!author);
const form = reactive({
    name: author?.name ?? null,
    user_id: author.user_id ?? null
});

const handleCancel = () => emit("cancel")

const handleSubmit = () => emit("submit", form);

const handleMe = () => {
    form.user_id = user.value?.id
}

</script>

<template>
    <v-form v-model="valid" validate-on="blur">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="form.name" label="Nom" :rules="[rules.min2Char]" required />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="11">
                    <v-text-field v-model="form.user_id" label="Admin (userId)" />
                </v-col>
                <v-col cols="1" align-self="center">
                    <v-tooltip activator="parent" location="start" text="C'est moi">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" variant="plain" icon="mdi-hand-front-left" @click="handleMe" />
                        </template>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div class="form-buttons">
                        <v-btn class="mr-2" @click="handleCancel">Annuler</v-btn>
                        <v-btn color="primary" @click="handleSubmit">{{ isEdit? "Mettre à jour": "Ajouter" }}</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<style scoped>

</style>
