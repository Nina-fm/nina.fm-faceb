# Instructions Copilot - Nina.fm Face B (v2)

## Architecture du projet

### Stack technique

- **Framework**: Nuxt 3 (Vue 3 + TypeScript)
- **State Management**: Pinia
- **Data Fetching**: TanStack Query (Vue Query)
- **Forms**: vee-validate + zod
- **UI Components**: shadcn-vue (reka-ui primitives)
- **Styling**: Tailwind CSS
- **API**: Nina.fm NestJS API

### Structure des dossiers

```
Face B (v2)/
├── components/      # Composants Vue réutilisables
│   ├── fields/     # Champs de formulaire avec vee-validate
│   ├── ui/         # Composants UI shadcn-vue
│   └── [domain]/   # Composants par domaine (mixtapes, djs, tags, users)
├── composables/    # Composables Vue (API, helpers)
├── pages/          # Pages Nuxt (routing automatique)
├── stores/         # Stores Pinia
├── types/          # Types TypeScript
├── utils/          # Utilitaires
└── docs/           # Documentation
```

## Patterns et conventions

### 1. API Calls avec TanStack Query

**✅ Pattern à suivre** :

```typescript
// composables/[resource]Api.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { HttpMethod, useApi } from './api'
import { buildEndpoint, createErrorHandler, getListQueryConfig } from './apiHelpers'
import { queryKeys } from './query-keys'

export const useResourceApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  // QUERIES (GET)
  const getResources = (params?: MaybeRef<Partial<QueryDto>>) =>
    useQuery({
      queryKey: computed(() => queryKeys.resources.list(unref(params) || {})),
      queryFn: async () => {
        const endpoint = buildEndpoint(API_ENDPOINTS.RESOURCES.BASE, unref(params) || {})
        return call<PaginatedResponse<Resource>>(endpoint, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      ...getListQueryConfig(),
    })

  const getResource = (id: MaybeRef<string>) =>
    useQuery({
      queryKey: computed(() => queryKeys.resources.detail(unref(id))),
      queryFn: async () => {
        return call<{ data: Resource }>(API_ENDPOINTS.RESOURCES.BY_ID(unref(id)), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(id)),
    })

  // MUTATIONS (POST/PATCH/DELETE)
  const createResource = useMutation({
    mutationFn: async (payload: CreateResourceDto) =>
      call<Resource>(API_ENDPOINTS.RESOURCES.BASE, {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.lists() })
    },
    onError: createErrorHandler('la création de la ressource'),
  })

  const updateResource = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateResourceDto }) =>
      call<{ data: Resource }>(API_ENDPOINTS.RESOURCES.BY_ID(id), {
        method: HttpMethod.PATCH,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.detail(variables.id) })
    },
    onError: createErrorHandler('la mise à jour de la ressource'),
  })

  const deleteResource = useMutation({
    mutationFn: async (id: string) =>
      call(API_ENDPOINTS.RESOURCES.BY_ID(id), {
        method: HttpMethod.DELETE,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.lists() })
    },
    onError: createErrorHandler('la suppression de la ressource'),
  })

  return {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
  }
}
```

**Utilisation dans les pages** :

```vue
<script setup>
  const { getResource, updateResource } = useResourceApi()
  const route = useRoute()
  const id = route.params.id as string

  // Query
  const { data, isPending, error } = getResource(id)

  // Mutation
  const handleSubmit = async (values: FormData) => {
    await updateResource.mutateAsync({ id, payload: values })
    toast.success('Modifié avec succès')
  }
</script>
```

### 2. Formulaires avec vee-validate

**Structure** :

```
components/fields/
├── TextField.vue          # Champ texte simple
├── SelectField.vue        # Select/dropdown
├── DjsField.vue          # Champ avec DjsCombobox
├── DjsCombobox.vue       # Combobox multi-select pour DJs
├── TagsField.vue         # Champ avec TagCombobox
├── TagCombobox.vue       # Combobox multi-select pour Tags
├── ObjectsField.vue      # Liste d'objets (drag & drop)
└── TracksField.vue       # Cas spécial: tracks avec import/export
```

**Pattern Field** :

```vue
<!-- components/fields/CustomField.vue -->
<script lang="ts" setup>
  const props = defineProps<{
    name: string
    label: string
    description?: string
    // ... autres props
  }>()
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <CustomInput v-bind="componentField" @update:model-value="componentField['onUpdate:modelValue']" />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
```

**Schema zod** :

```typescript
// components/[domain]/[resource].schema.ts
import { z } from 'zod'

export const resourceFormSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  year: z.string().regex(/^\d+$/, 'Année invalide'),
  // ... autres champs
})

export type ResourceFormData = z.infer<typeof resourceFormSchema>

export const resourceFormSetValues = (data?: ResourceFormData) => ({
  name: data?.name || '',
  year: data?.year || new Date().getFullYear().toString(),
  // ... valeurs par défaut
})
```

### 3. Combobox reka-ui (IMPORTANT)

**⚠️ Pattern critique pour éviter les freeze** :

```vue
<script setup>
  type Option = {
    label: string
    value: T
  }

  const props = defineProps<{
    modelValue?: Option[] | string[]
    options: Option[]
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Option[] | string[]): void
  }>()

  const open = ref(false)
  const searchTerm = ref('')

  // OBLIGATOIRE: v-model local synchronisé
  const localValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  })
</script>

<template>
  <!-- OBLIGATOIRE: v-model sur Combobox (pas juste v-model:open) -->
  <Combobox v-model="localValue" v-model:open="open">
    <ComboboxAnchor as-child>
      <TagsInput
        :model-value="modelValue"
        @update:model-value="(value) => $emit('update:modelValue', value as Option[])"
      >
        <ComboboxInput as-child disable-search-icon>
          <TagsInputInput />
        </ComboboxInput>
      </TagsInput>

      <ComboboxList>
        <ComboboxItem v-for="option in options" :key="option.label" :value="option" @select.prevent="handleSelect">
          {{ option.label }}
        </ComboboxItem>
      </ComboboxList>
    </ComboboxAnchor>
  </Combobox>
</template>
```

**❌ Ce qui NE marche PAS** :

- `<Combobox v-model:open="open">` sans `v-model`
- Event handlers manuels `@update:model-value` sur Combobox
- Détection de boucles avec compteurs

**✅ Ce qui marche** :

- `v-model="localValue"` sur Combobox
- `v-model:open="open"` pour le dropdown
- `disable-search-icon` sur ComboboxInput
- Computed writable pour la prop

### 4. Gestion des réponses API

**✅ Format unifié** : Tous les endpoints retournent maintenant un format cohérent

- **Endpoints de liste**: `{ data: T[], meta: {...} }`
- **Endpoints de détail**: `{ data: T }`
- **Mutations (POST/PATCH)**: `{ data: T }`

**Pattern standard dans les composables** :

```typescript
const getResource = (id: MaybeRef<string>) =>
  useQuery({
    queryKey: computed(() => queryKeys.resources.detail(unref(id))),
    queryFn: async () => {
      return call<{ data: Resource }>(API_ENDPOINTS.RESOURCES.BY_ID(unref(id)), {
        method: HttpMethod.GET,
        requireAuth: true,
      })
    },
    enabled: computed(() => !!unref(id)),
  })
```

**Usage dans les pages** :

```typescript
const { data } = getResource(id)
const resource = computed(() => data.value?.data)
```

### 5. TypeScript - Gestion des types stricts

**ESLint rules actives** :

- `no-explicit-any`: Interdit `any`, utiliser `unknown`
- `@typescript-eslint/no-unused-vars`: Variables non utilisées avec `_` prefix

**Pattern pour types complexes** :

```typescript
// ❌ Éviter
const handler = (event: any) => {}

// ✅ Correct
const handler = (event: unknown) => {
  const evt = event as Record<string, unknown>
  const detail = evt.detail as Record<string, unknown>
  // ...
}
```

**@ts-ignore vs @ts-expect-error** :

- Utiliser `@ts-ignore` pour les incompatibilités de lib tierces
- Ne PAS utiliser pour masquer des erreurs de code

## Problèmes résolus et bonnes pratiques

### 1. ✅ Combobox reka-ui - Pattern validé

**Solution** : Toujours utiliser `v-model` sur le Combobox (voir section 3)  
**Référence** : shadcn-vue TagsInputComboboxDemo

### 2. ✅ API response format - Harmonisé

**Tous les endpoints retournent maintenant** : `{ data: T }` ou `{ data: T[], meta: {...} }`  
**Plus besoin** de cast double ou de workarounds

### 3. ✅ Cover upload pour Mixtapes - Implémenté

**Fonctionnel** :

- ImageUploadField dans les formulaires
- Upload via imageApi
- coverId connecté dans les DTOs create/update

### 4. ✅ TypeORM updates - Pattern établi

**Règle importante** : Pour vider un champ optionnel, envoyer une valeur explicite

- ❌ `undefined` → Le champ n'est PAS mis à jour
- ✅ `''` (string vide) ou `null` → Le champ est vidé
- Exemple : `tracksAsText: values.tracks?.length > 0 ? serialize(values.tracks) : ''`

## Checklist pour nouvelles features

- [ ] Créer le composable API avec TanStack Query
- [ ] Définir les query keys dans `query-keys.ts`
- [ ] Créer les types dans `types/api/`
- [ ] Créer le schema zod pour les formulaires
- [ ] Créer les composants Field nécessaires
- [ ] Créer les pages avec proper error/loading states
- [ ] Ajouter les breadcrumbs
- [ ] Gérer les permissions (roles)
- [ ] Tester create/read/update/delete
- [ ] Vérifier les erreurs TypeScript
- [ ] Commit avec message conventionnel

## Ressources

- [TanStack Query docs](https://tanstack.com/query/latest/docs/vue/overview)
- [vee-validate docs](https://vee-validate.logaretm.com/v4/)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [reka-ui](https://www.reka-ui.com/)
- Documentation API: `/Users/vincent/Sites/nina/nina.fm-api/docs/`
