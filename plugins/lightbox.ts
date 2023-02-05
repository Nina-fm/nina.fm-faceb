import "~~/node_modules/vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css";

import VueEasyLightbox from "vue-easy-lightbox";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueEasyLightbox);
});
