<script lang="ts" setup>
  type Track = {
    position?: number
    artist: string
    title: string
    start_at: string | null
  }

  const props = defineProps<{
    name: string
    label: string
    placeholder?: string
  }>()

  const emit = defineEmits<{
    (e: 'save'): void
    (e: 'import'): void
  }>()

  const { value, setValue } = useField<Track[]>(() => props.name)
  const { value: textValue, setValue: setTextValue, setErrors } = useField<string>(() => `${props.name}AsText`)

  console.log('TracksField', value.value, textValue.value)

  // https://regex101.com/r/48Pf9u/1
  // [<position>]<artist> <separator: [:•-]> <title>[ (<start_at: 00:00:00>)]
  const trackPattern =
    /(?<position>\d+\s)?(?<artist>.+?)\s+[\:\-\•]\s+(?<title>.*?)(?=$|\s\((?<start_at>\d{2}\:\d{2}:\d{2})\))/

  const parsedText = computed<Track[]>(() =>
    textValue.value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const match = line.match(trackPattern)
        if (!match) return null
        const [, position, artist, title, startAt] = match
        return {
          position: position ? parseInt(position, 10) : undefined,
          artist: artist.trim(),
          title: title.trim(),
          start_at: startAt || null,
        }
      })
      .filter((line) => line !== null),
  )

  const isImportable = computed(() => parsedText.value.length > 0)

  const handleAddTrack = () => {
    const currentTracks = value.value || []
    setValue([
      ...value.value,
      {
        position: currentTracks.length + 1,
        artist: '',
        title: '',
        start_at: '',
      },
    ])
  }

  const handleDeleteTrack = (index: number) => {
    const newTracks = [...value.value]
    newTracks.splice(index, 1)
    setValue(newTracks)
  }

  const handleClear = () => {
    setValue([])
    setTextValue('')
  }

  const handleSaveTracksAsText = () => {
    emit('save')
  }

  const handleImportTracks = () => {
    if (parsedText.value.length > 0) {
      setValue(parsedText.value)
      setTextValue('')
      emit('import')
    } else {
      setErrors('Aucune piste à un format importable.')
    }
  }
</script>

<template>
  <ObjectsField
    :name="name"
    :label="label"
    :placeholder="placeholder ?? 'Aucune piste.'"
    :objectFields="[
      { type: 'text', label: 'Artiste(s)', name: 'artist' },
      { type: 'text', label: 'Titre', name: 'title' },
      { type: 'time', label: 'Début', hint: '(hh:mm:ss)', name: 'start_at', class: 'min-w-30 max-w-30' },
    ]"
    @deleteRow="handleDeleteTrack"
  >
    <template #actions>
      <Tooltiped text="Importer les pistes depuis un texte">
        <ImportField
          :name="`${name}AsText`"
          :label="`${label} à importer`"
          placeholder="Saisir/coller le texte à importer…"
          :importable="isImportable"
          @save="handleSaveTracksAsText"
          @import="handleImportTracks"
        >
          <Alert variant="infoMuted">
            <AlertTitle>Attention au format !</AlertTitle>
            <AlertDescription>
              Veuillez respecter une ligne par piste, au format :
              <br />
              <span class="font-mono">Nom de l'artiste : Titre de la piste</span>
              Vous pouvez aussi ajouter le numéro de la piste et le timing :
              <br />
              <span class="font-mono">01 Nom de l'artiste : Titre de la piste (00:00:00)</span>
            </AlertDescription>
          </Alert>
        </ImportField>
      </Tooltiped>
    </template>
  </ObjectsField>
</template>
