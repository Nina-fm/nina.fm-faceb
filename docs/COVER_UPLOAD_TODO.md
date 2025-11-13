# Cover Image Management - TODO

## Statut : 📋 À implémenter

## Contexte

Les Mixtapes doivent avoir une image de couverture (cover) :

- Format recommandé : 1600x1600px
- Stockage : Bucket S3 "covers"
- Association : `coverId` dans la Mixtape

## Fonctionnalités à implémenter

### 1. Upload d'image

#### Composant ImageUploadField

À créer : `components/fields/ImageUploadField.vue`

**Features** :

- Preview de l'image
- Drag & drop
- Validation (format, taille)
- Crop/resize optionnel
- Indicateur de progression upload

**Props** :

```typescript
{
  name: string              // Nom du champ vee-validate
  label?: string
  description?: string
  bucket: 'covers'          // Bucket S3
  maxSize?: number          // Taille max en bytes (défaut: 5MB)
  aspectRatio?: string      // Ex: '1:1' pour carré
  recommended?: string      // Ex: '1600x1600px'
}
```

**v-model** :

```typescript
{
  filename?: string
  file?: File
  bucket?: string
  url?: string  // Pour preview existante
}
```

#### API Image

Déjà disponible : `composables/imageApi.ts`

```typescript
const { uploadImage, getImageUrl } = useImageApi()

// Upload
const uploadResult = await uploadImage.mutateAsync({
  file: File,
  bucket: 'covers',
})
// Retourne { id, uri, ... }

// Get URL
const imageUrl = getImageUrl(image)
```

### 2. Intégration dans MixtapeForm

#### Schema

Déjà présent dans `mixtape.schema.ts` :

```typescript
cover: z.object({
  filename: z.string().optional(),
  file: z.instanceof(File).optional(),
  alt: z.string().optional(),
  bucket: z.string().nullable().optional(),
  url: z.string().optional(),
}).optional()
```

#### Formulaire

```vue
<template>
  <ImageUploadField name="cover" bucket="covers" label="Cover" description="Taille recommandée : 1600x1600px" />
</template>
```

### 3. Flow de création

```typescript
const handleSubmit = async (values: MixtapeFormData) => {
  let coverId: string | undefined

  // 1. Upload de l'image si nouvelle
  if (values.cover?.file) {
    const uploadResult = await uploadImage.mutateAsync({
      file: values.cover.file,
      bucket: 'covers',
    })
    coverId = uploadResult.id
  } else if (values.cover?.url) {
    // Image existante, garder l'ID actuel
    coverId = extractIdFromUrl(values.cover.url)
  }

  // 2. Créer la mixtape avec coverId
  const payload: CreateMixtapeDto = {
    // ... autres champs
    coverId: coverId,
  }

  await createMixtape.mutateAsync(payload)
}
```

### 4. Flow d'édition

```typescript
const handleSubmit = async (values: MixtapeFormData) => {
  let coverId: string | undefined

  // 1. Nouvelle image uploadée ?
  if (values.cover?.file) {
    const uploadResult = await uploadImage.mutateAsync({
      file: values.cover.file,
      bucket: 'covers',
    })
    coverId = uploadResult.id
  } else if (values.cover?.url) {
    // Pas de changement, garder l'existante
    coverId = undefined // Ne pas envoyer dans le PATCH
  }

  // 2. Mettre à jour
  const payload: UpdateMixtapeDto = {
    // ... autres champs
    ...(coverId && { coverId }), // Seulement si nouvelle image
  }

  await updateMixtape.mutateAsync({ mixtapeId: id, payload })
}
```

### 5. Affichage dans le détail

```vue
<!-- MixtapeDetails.vue -->
<template>
  <Avatar class="size-38 rounded-lg">
    <AvatarImage v-if="mixtape.cover" :src="getImageUrl(mixtape.cover) || ''" :alt="mixtape.cover.originalName" />
    <AvatarFallback class="bg-muted text-muted-foreground rounded-lg">
      <ImageIcon class="size-14" />
    </AvatarFallback>
  </Avatar>
</template>
```

## Structure des fichiers

```
components/
├── fields/
│   └── ImageUploadField.vue        # À créer
└── mixtapes/
    ├── MixtapeForm.vue              # À modifier (ajouter ImageUploadField)
    └── MixtapeDetails.vue           # Déjà OK

composables/
└── imageApi.ts                      # Déjà existant

pages/
└── mixtapes/
    ├── add.vue                      # À modifier (handle upload)
    └── [id]/
        └── edit.vue                 # À modifier (handle upload)
```

## Checklist d'implémentation

### Étape 1 : Composant ImageUploadField

- [ ] Créer `components/fields/ImageUploadField.vue`
- [ ] Implémenter preview
- [ ] Implémenter drag & drop
- [ ] Ajouter validation
- [ ] Tester upload avec `imageApi`

### Étape 2 : Intégration MixtapeForm

- [ ] Ajouter ImageUploadField dans le formulaire
- [ ] Tester avec schema zod
- [ ] Vérifier le positionnement (grid layout)

### Étape 3 : Flow de création

- [ ] Modifier `pages/mixtapes/add.vue`
- [ ] Implémenter upload avant create
- [ ] Gérer les erreurs d'upload
- [ ] Tester création avec cover

### Étape 4 : Flow d'édition

- [ ] Modifier `pages/mixtapes/[id]/edit.vue`
- [ ] Charger cover existante
- [ ] Implémenter remplacement
- [ ] Tester modification avec/sans changement cover

### Étape 5 : Affichage

- [ ] Vérifier `MixtapeDetails.vue` (déjà OK normalement)
- [ ] Vérifier `MixtapeTable.vue` (preview dans liste)
- [ ] Ajouter fallback icon si pas de cover

## Contraintes techniques

### API

- Endpoint upload : `POST /images/upload`
- Headers : `multipart/form-data`
- Body : `{ file: File, bucket: string }`
- Response : `{ id, uri, bucket, ... }`

### Validation

- Formats acceptés : jpg, jpeg, png, webp
- Taille max : 5MB (configurable)
- Dimensions recommandées : 1600x1600px
- Aspect ratio : 1:1 (carré)

### Storage

- Bucket S3 : `covers`
- URL pattern : `https://cdn.nina.fm/covers/{filename}`
- Thumbnails auto-générés par API

## Notes

- L'API gère déjà l'upload et le storage
- `imageApi.ts` expose déjà les méthodes nécessaires
- Le schema zod supporte déjà le champ `cover`
- Attention au type de retour API pour l'upload (voir API_RESPONSE_FORMATS.md)

## Références

- `composables/imageApi.ts` : Implémentation upload existante
- `components/mixtapes/MixtapeDetails.vue` : Exemple d'affichage
- API docs : `/Users/vincent/Sites/nina/nina.fm-api/docs/`
