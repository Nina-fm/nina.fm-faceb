<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })

const { params } = useRoute();
const { updateAuthor, getById } = useAuthorsStore();

const id = params.id as string
const { data } = await useAsyncData("author", () => getById(id));
const author = computed(() => data.value);
const form = reactive({
    name: author.value.name,
    user_id: author.value.user_id
});

const handleSubmit = async () => {
    const { error } = await updateAuthor(id, form);
    if (!error) navigateTo(`/authors/${id}`)
}
</script>

<template>
    <PageHeader @back="navigateTo('/authors')" title="Mettre à jour le DJ" />
    <v-container class="n-page-content">
        <v-card>
            <v-card-text>
                <AuthorForm v-model="form" edit @cancel="navigateTo('/authors')" @submit="handleSubmit" />
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style scoped>

</style>
