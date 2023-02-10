<script lang="ts" setup>
import { TrackParams } from '~~/types/supatypes';
import { ItemBase } from './RepeatableField.vue';

const props = defineProps<{
    modelValue: ItemBase[],
    textValue: string | null,
    label: string,
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: ItemBase[]): void,
    (e: 'update:textValue', value: string | null): void,
}>();

const { modelValue, textValue } = toRefs(props);
const { label } = props;
const openImport = ref(false);
const text = ref<string | null>(textValue.value);
const data: ItemBase[] = reactive(modelValue.value);
const emptyTrack: ItemBase = {
    title: null,
    artist: null,
    start_at: null
};

watch(data, (value) => {
    emit('update:modelValue', value)
})

watch(text, (value) => {
    emit('update:textValue', value)
})

const handleOpenImport = () => {
    openImport.value = true
}

const handleCancelImport = () => {
    openImport.value = false;
}

const handleImport = () => {
    openImport.value = false;
    const lines: string[] = text.value?.split(/\r?\n/) ?? [];
    const newLines: ItemBase[] = lines.map((line, i) => {
        const infos = /(\d+)\s(.*)\s:\s(.*)/g.exec(line);
        return {
            position: i,
            artist: infos?.[2],
            title: infos?.[3]
        };
    });
    data.splice(0, data.length, ...newLines);
}
</script>

<template>
    <repeatable-field v-model="data" :label="label" :empty-item="emptyTrack" @click="handleOpenImport">
        <template v-slot:prepend-buttons>
            <v-tooltip text="Importer au format texte" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-import" variant="plain" class="field-inner-button" @click.stop="handleOpenImport"
                        v-bind="props" />
                </template>
            </v-tooltip>
        </template>
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
        <template v-slot:append-outer>
            <text-import-modal v-model:open-value="openImport" v-model:model-value="text" :label="label"
                @cancel="handleCancelImport" @import="handleImport" multiline>
                <template v-slot:alert>
                    Veuillez respecter une ligne par piste, au format :
                    <pre>01 Nom de l'artiste : Titre de la piste</pre>
                </template>
            </text-import-modal>
        </template>
    </repeatable-field>
</template>

<style lang="scss" scoped>
.field-inner-button {
    // margin-top: -4px;
}
</style>
