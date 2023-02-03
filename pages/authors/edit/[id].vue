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

const handleCancel = () => {
    navigateTo('/authors')
}

const handleSubmit = async () => {
    const { error } = await updateAuthor(id, form);
    if (!error) navigateTo(`/authors`)
}
</script>

<template>
    <PageHeader @back="navigateTo('/authors')" title="Modifier le DJ" />
    <v-container class="n-page-content">
        <v-card>
            <v-card-text>
                <AuthorForm v-model="form" edit @cancel="handleCancel" @submit="handleSubmit" />
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style scoped>

</style>
