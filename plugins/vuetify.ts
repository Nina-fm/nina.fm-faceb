import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

// plugins/vuetify.js
import { ThemeDefinition, createVuetify } from "vuetify"

import { fr } from "vuetify/locale"

const NinaTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#FFB300",
    secondary: "#FFC107",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false, // Explicitly disable SSR for Vuetify in SPA mode
    locale: {
      locale: "fr",
      messages: { fr },
    },
    theme: {
      defaultTheme: "NinaTheme",
      themes: {
        NinaTheme,
      },
    },
    components: {
      ...components,
    },
    directives,
    defaults: {
      VInput: {
        variant: "outlined",
        hideDetails: "auto",
      },
      VField: {
        variant: "outlined",
        hideDetails: "auto",
      },
      VTextField: {
        variant: "outlined",
        hideDetails: "auto",
      },
      VTextarea: {
        variant: "outlined",
        hideDetails: "auto",
      },
      VSelect: {
        variant: "outlined",
        hideDetails: "auto",
      },
      VAutocomplete: {
        variant: "outlined",
        hideDetails: "auto",
      },
      VCombobox: {
        variant: "outlined",
        hideDetails: "auto",
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
