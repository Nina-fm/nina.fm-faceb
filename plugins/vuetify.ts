import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// plugins/vuetify.js
import { ThemeDefinition, createVuetify } from "vuetify";

import { VDataTable } from "vuetify/labs/VDataTable";

const NinaTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#2196F3",
    secondary: "#FFC107",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "NinaTheme",
      themes: {
        NinaTheme,
      },
    },
    components: {
      ...components,
      VDataTable,
    },
    directives,
    defaults: {
      VTextField: {
        variant: "outlined",
      },
      VTextarea: {
        variant: "outlined",
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
