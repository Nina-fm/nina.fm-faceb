import "~~/node_modules/vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css"

// https://github.com/XiongAmao/vue-easy-lightbox
import VueEasyLightbox from "vue-easy-lightbox"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueEasyLightbox)
})
