<script setup lang="ts">
  import { Button, Html, Text } from '@vue-email/components'

  defineProps({
    url: String,
  })
</script>

<template>
  <Html lang="en">
    <Text>Bonjour,</Text>
    <Text>Vous êtes invité à rejoindre l'application Nina Face B.</Text>
    <Text>Pour accepter cette invitation et créer votre compte, il vous suffit de cliquer sur le lien ci-dessous.</Text>
    <Button :href="url">Créer mon compte</Button>
  </Html>
</template>
